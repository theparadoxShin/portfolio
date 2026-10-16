// Build-time "static content" for crawlers that do not run JavaScript.
//
// The site is a single-page app: without JavaScript, index.html is an empty
// shell. At build time this plugin reads the published content from the API and
// writes it into the HTML that every route serves:
//   - a <noscript> block with the real content (intro, projects with links, …)
//   - JSON-LD structured data listing the projects
//   - one sitemap.xml entry per project detail page
// If the API cannot be reached, the build continues with the original HTML.
// Shared file: keep frontend-daemon-craft and frontend-portfolio copies identical.
import fs from 'node:fs'
import path from 'node:path'
import dns from 'node:dns'

export const esc = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

const projectUrl = (siteUrl, project) => `${siteUrl}/projects/${encodeURIComponent(project.slug || project.id)}`

/**
 * @param {object} options
 * @param {string} options.apiUrl     API base, e.g. https://api.daemon-craft.com/api
 * @param {string} options.siteUrl    canonical site URL, no trailing slash
 * @param {string} options.site       'daemon-craft' | 'portfolio' (?site= filter)
 * @param {string} options.name       organization / person name (heading)
 * @param {string} options.intro      one-paragraph presentation
 * @param {string} options.email      contact address
 * @param {string} options.colors     { text, background, link }
 * @param {Array}  options.sections   extra sections: { heading, path, line(item) => html | '' }
 * @param {object} options.creator    JSON-LD author/creator of the projects
 */
export default function staticContent(options) {
  const { apiUrl, siteUrl, site, name, intro, email, colors, sections = [], creator } = options
  let outDir = 'dist'
  let content = null

  const get = async (p) => {
    const res = await fetch(`${apiUrl}${p}`, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`GET ${p} → ${res.status}`)
    const body = await res.json()
    return Array.isArray(body.data) ? body.data : []
  }

  const projectLine = (project) => {
    const summary = project.shortDescription || project.description || ''
    const live = project.liveUrl
      ? ` — <a href="${esc(project.liveUrl)}" style="color:${colors.link}">${esc(hostOf(project.liveUrl) || project.liveUrl)}</a>`
      : ''
    return `<li><a href="${esc(projectUrl(siteUrl, project))}" style="color:${colors.link}"><strong>${esc(project.title)}</strong></a>${summary ? ` — ${esc(summary)}` : ''}${live}</li>`
  }

  const renderNoscript = () => {
    const blocks = [
      `<h1 style="margin:0 0 12px">${esc(name)}</h1>`,
      `<p>${esc(intro)}</p>`,
    ]
    if (content.projects.length) {
      blocks.push('<h2>Projects &amp; products</h2>', `<ul>${content.projects.map(projectLine).join('')}</ul>`)
    }
    content.sections.forEach(({ heading, items }) => {
      if (items.length) blocks.push(`<h2>${esc(heading)}</h2>`, `<ul>${items.join('')}</ul>`)
    })
    blocks.push(`<p>Contact: <a href="mailto:${esc(email)}" style="color:${colors.link}">${esc(email)}</a> · This site works best with JavaScript enabled.</p>`)
    return `<noscript>\n      <div style="max-width:960px;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.6;color:${colors.text};background:${colors.background}">\n        ${blocks.join('\n        ')}\n      </div>\n    </noscript>`
  }

  const renderJsonLd = () => {
    const items = content.projects.map((project, i) => {
      const image = (project.images || []).find((img) => img.isPrimary) || (project.images || [])[0]
      const item = {
        '@type': project.liveUrl ? 'SoftwareApplication' : 'CreativeWork',
        name: project.title,
        description: project.shortDescription || project.description,
        url: project.liveUrl || projectUrl(siteUrl, project),
        ...(image && { image: image.url }),
        ...(project.liveUrl && { applicationCategory: 'BusinessApplication', operatingSystem: 'Web' }),
        ...(creator && { creator }),
      }
      return { '@type': 'ListItem', position: i + 1, url: projectUrl(siteUrl, project), item }
    })
    const json = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${name} — projects`,
      itemListElement: items,
    }, null, 2).replace(/</g, '\\u003c')
    return `<script type="application/ld+json" id="static-projects">\n${json}\n    </script>`
  }

  return {
    name: 'static-content',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async buildStart() {
      content = null
      if (!apiUrl) {
        this.warn('VITE_API_URL is not set: static content for crawlers skipped')
        return
      }
      dns.setDefaultResultOrder?.('ipv4first')
      try {
        const [projects, ...extra] = await Promise.all([
          get(`/projects?site=${site}`),
          ...sections.map((s) => get(s.path)),
        ])
        content = {
          projects,
          sections: sections.map((s, i) => ({ heading: s.heading, items: extra[i].map(s.line).filter(Boolean) })),
        }
        console.log(`[static-content] ${projects.length} project(s) written into index.html for crawlers`)
      } catch (err) {
        this.warn(`static content for crawlers skipped (API unreachable: ${err.message})`)
      }
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!content) return html
        const noscript = renderNoscript()
        const withNoscript = /<noscript>[\s\S]*?<\/noscript>/.test(html)
          ? html.replace(/<noscript>[\s\S]*?<\/noscript>/, () => noscript)
          : html.replace('</body>', () => `  ${noscript}\n  </body>`)
        return content.projects.length
          ? withNoscript.replace('</head>', () => `    ${renderJsonLd()}\n  </head>`)
          : withNoscript
      },
    },
    closeBundle() {
      if (!content?.projects.length) return
      const file = path.join(outDir, 'sitemap.xml')
      if (!fs.existsSync(file)) return
      let xml = fs.readFileSync(file, 'utf8')
      const entries = content.projects
        .map((project) => ({ loc: projectUrl(siteUrl, project), lastmod: String(project.updatedAt || '').slice(0, 10) }))
        .filter(({ loc }) => !xml.includes(`<loc>${loc}</loc>`))
        .map(({ loc, lastmod }) => `  <url>\n    <loc>${esc(loc)}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`)
      if (!entries.length) return
      xml = xml.replace('</urlset>', `${entries.join('')}</urlset>`)
      fs.writeFileSync(file, xml)
    },
  }
}

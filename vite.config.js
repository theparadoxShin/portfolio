import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import staticContent, { esc } from './vite-plugins/static-content.js'

export default defineConfig(({ mode }) => {
  // VITE_API_URL: from the environment (npm run deploy / CI) or .env.production.
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = process.env.VITE_API_URL || env.VITE_API_URL

  return {
    plugins: [
      react(),
      staticContent({
        apiUrl,
        siteUrl: 'https://parfaittedomtedom.com',
        site: 'portfolio',
        name: 'Parfait Ben-oni Tedom Tedom',
        intro: 'Full-stack engineer and mechatronics engineer building intelligent systems that bridge software, hardware and AI. Founder of Daemon Craft (https://daemon-craft.com). Based in Edmonton, Alberta, Canada.',
        email: 'me@parfaittedomtedom.com',
        colors: { text: '#f3f4f6', background: '#0A0F1C', link: '#00D9FF' },
        creator: { '@type': 'Person', name: 'Parfait Ben-oni Tedom Tedom', url: 'https://parfaittedomtedom.com/' },
        sections: [
          {
            heading: 'Experience',
            path: '/experiences',
            line: (e) => `<li><strong>${esc(e.position)}</strong> — ${esc(e.company)}${e.isCurrent ? ' (current)' : ''}</li>`,
          },
          {
            heading: 'Certifications',
            path: '/certifications',
            line: (c) => `<li>${esc(c.name)} — ${esc(c.issuer)}</li>`,
          },
        ],
      }),
    ],
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          // Vendor code changes rarely: separate chunks stay cached across deploys.
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
          },
        },
      },
    },
  }
})

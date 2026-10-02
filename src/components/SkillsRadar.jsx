import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Short axis labels per skill category (the API sends long names).
const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  'ai-ml': 'AI/ML',
  ai: 'AI/ML',
  iot: 'IoT',
  robotics: 'Robotics',
  cad: 'CAD',
  cloud: 'Cloud',
  embedded: 'Embedded',
  database: 'Database',
  devops: 'DevOps',
  mobile: 'Mobile',
  other: 'Other',
}

const CATEGORY_COLORS = {
  frontend: '#3B82F6',
  backend: '#10B981',
  'ai-ml': '#8B5CF6',
  ai: '#8B5CF6',
  iot: '#F59E0B',
  robotics: '#EF4444',
  cad: '#EC4899',
  cloud: '#06B6D4',
  embedded: '#6366F1',
  database: '#14B8A6',
  devops: '#F97316',
  mobile: '#A78BFA',
  other: '#9CA3AF',
}

/** Values shown when the API is unavailable (previous static content). */
export const DEFAULT_RADAR = [
  { key: 'frontend', value: 85 },
  { key: 'backend', value: 90 },
  { key: 'ai-ml', value: 88 },
  { key: 'iot', value: 82 },
  { key: 'robotics', value: 75 },
  { key: 'cad', value: 70 },
  { key: 'cloud', value: 85 },
  { key: 'embedded', value: 78 },
].map((item) => ({ ...item, label: CATEGORY_LABELS[item.key], color: CATEGORY_COLORS[item.key] }))

const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)))

/** `/skills/radar` (or `/skills` filtered on isRadarSkill) → chart data. */
export const toRadarData = (items = []) => items
  .filter((item) => item && Number.isFinite(Number(item.level)))
  .map((item) => ({
    key: item.category || item.id || item.name,
    label: CATEGORY_LABELS[item.category] || item.name || item.category,
    value: clamp(item.level),
    color: item.color || CATEGORY_COLORS[item.category] || '#00D9FF',
  }))

const SkillsRadar = ({ data = DEFAULT_RADAR, maxSize = 440, showHint = true }) => {
  const uid = useId().replace(/:/g, '')
  const containerRef = useRef(null)
  const [width, setWidth] = useState(maxSize)
  const [active, setActive] = useState(null)

  // Draw at the real rendered width so labels keep a readable pixel size.
  useLayoutEffect(() => {
    const node = containerRef.current
    if (!node) return undefined
    const measure = () => setWidth(Math.min(maxSize, Math.max(240, Math.floor(node.clientWidth))))
    measure()
    if (typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(measure)
    ro.observe(node)
    return () => ro.disconnect()
  }, [maxSize])

  const points = data.length >= 3 ? data : DEFAULT_RADAR
  const fontSize = width < 380 ? 12 : 14
  const longest = Math.max(...points.map((p) => String(p.label).length))
  const labelWidth = longest * fontSize * 0.62
  const gap = 10
  const radius = Math.max(56, Math.min(width / 2 - labelWidth - gap, maxSize / 2 - 60))
  const vPad = fontSize * 2.6 + gap
  const height = Math.round(radius * 2 + vPad * 2)
  const cx = width / 2
  const cy = height / 2
  const levels = 5

  const geometry = useMemo(() => {
    const slice = (Math.PI * 2) / points.length
    return points.map((point, i) => {
      const angle = slice * i - Math.PI / 2
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const r = radius * (point.value / 100)
      let anchor = 'middle'
      if (cos > 0.2) anchor = 'start'
      else if (cos < -0.2) anchor = 'end'
      return {
        ...point,
        x: cx + r * cos,
        y: cy + r * sin,
        axisX: cx + radius * cos,
        axisY: cy + radius * sin,
        labelX: cx + (radius + gap) * cos,
        labelY: cy + (radius + gap + fontSize * 0.6) * sin,
        anchor,
      }
    })
  }, [points, radius, cx, cy, gap, fontSize])

  const polygonPath = `${geometry.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')} Z`
  const summary = points.map((p) => `${p.label} ${p.value}%`).join(', ')

  return (
    <figure className="w-full" style={{ maxWidth: maxSize }}>
      <div ref={containerRef} className="w-full">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto block max-w-full"
          role="img"
          aria-labelledby={`${uid}-title ${uid}-desc`}
        >
          <title id={`${uid}-title`}>Skills radar chart</title>
          <desc id={`${uid}-desc`}>{summary}</desc>
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
            </linearGradient>
            <filter id={`${uid}-glow`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Level rings */}
          {Array.from({ length: levels }, (_, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={(radius / levels) * (i + 1)}
              fill="none"
              stroke="rgba(0, 217, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Axes */}
          {geometry.map((p) => (
            <line key={`axis-${p.key}`} x1={cx} y1={cy} x2={p.axisX} y2={p.axisY} stroke="rgba(0, 217, 255, 0.18)" strokeWidth="1" />
          ))}

          {/* Area */}
          <motion.path
            d={polygonPath}
            fill={`url(#${uid}-fill)`}
            stroke="#00D9FF"
            strokeWidth="2"
            strokeLinejoin="round"
            filter={`url(#${uid}-glow)`}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* Points */}
          {geometry.map((p) => {
            const isActive = active === p.key
            return (
              <g key={`pt-${p.key}`}>
                {isActive && (
                  <circle cx={p.x} cy={p.y} r={12} fill="none" stroke={p.color} strokeWidth="2" opacity="0.5" />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 7 : 5}
                  fill={p.color}
                  stroke="#0A0F1C"
                  strokeWidth="2"
                  onMouseEnter={() => setActive(p.key)}
                  onMouseLeave={() => setActive(null)}
                  style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
                />
              </g>
            )
          })}

          {/* Labels */}
          {geometry.map((p) => {
            const isActive = active === p.key
            return (
              <g key={`label-${p.key}`} aria-hidden="true">
                <text
                  x={p.labelX}
                  y={p.labelY}
                  textAnchor={p.anchor}
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  className={`font-heading ${isActive ? 'fill-white' : 'fill-gray-300'}`}
                  style={{ fontWeight: isActive ? 600 : 400 }}
                >
                  {p.label}
                </text>
                {isActive && (
                  <text
                    x={p.labelX}
                    y={p.labelY + fontSize * 1.3}
                    textAnchor={p.anchor}
                    dominantBaseline="middle"
                    fontSize={fontSize - 1}
                    className="fill-primary font-mono"
                  >
                    {p.value}%
                  </text>
                )}
              </g>
            )
          })}

          <circle cx={cx} cy={cy} r={8} fill="#00D9FF" opacity={0.3} />
          <circle cx={cx} cy={cy} r={4} fill="#00D9FF" />
        </svg>
      </div>

      {/* Legend: doubles as the touch / keyboard way to read values */}
      <figcaption className="mt-4">
        <ul className="flex flex-wrap justify-center gap-x-1">
          {points.map((p) => {
            const isActive = active === p.key
            return (
              <li key={`legend-${p.key}`}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onMouseEnter={() => setActive(p.key)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(p.key)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(isActive ? null : p.key)}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-xs transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} aria-hidden="true" />
                  <span>{p.label}</span>
                  <span className="font-mono text-gray-400">{p.value}%</span>
                </button>
              </li>
            )
          })}
        </ul>
        {showHint && (
          <p className="mt-3 text-center text-xs text-gray-400">
            Hover or tap a skill to highlight it on the chart
          </p>
        )}
      </figcaption>
    </figure>
  )
}

export default SkillsRadar

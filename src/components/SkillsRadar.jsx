import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

// Skill categories with colors - supports both 'ai' and 'ai-ml' keys
const skillCategories = [
  { key: 'frontend', altKey: 'frontend', label: 'Frontend', color: '#3B82F6' },
  { key: 'backend', altKey: 'backend', label: 'Backend', color: '#10B981' },
  { key: 'ai-ml', altKey: 'ai', label: 'AI/ML', color: '#8B5CF6' },
  { key: 'iot', altKey: 'iot', label: 'IoT', color: '#F59E0B' },
  { key: 'robotics', altKey: 'robotics', label: 'Robotics', color: '#EF4444' },
  { key: 'cad', altKey: 'cad', label: 'CAD', color: '#EC4899' },
  { key: 'cloud', altKey: 'cloud', label: 'Cloud', color: '#06B6D4' },
  { key: 'embedded', altKey: 'embedded', label: 'Embedded', color: '#6366F1' },
]

// Default skill values (0-100)
const defaultSkills = {
  frontend: 85,
  backend: 90,
  'ai-ml': 88,
  ai: 88, // fallback key
  iot: 82,
  robotics: 75,
  cad: 70,
  cloud: 85,
  embedded: 78,
}

// Helper to get skill value supporting both key formats
const getSkillValue = (skills, category) => {
  return skills[category.key] ?? skills[category.altKey] ?? 0
}

const SkillsRadar = ({ 
  skills = defaultSkills, 
  size = 400, 
  showLabels = true,
  showValues = true,
  animated = true 
}) => {
  const [hoveredSkill, setHoveredSkill] = useState(null)
  
  const center = size / 2
  const radius = (size / 2) - 60 // Leave space for labels
  const levels = 5 // Number of concentric circles
  
  // Calculate polygon points
  const getPolygonPoints = useMemo(() => {
    const numPoints = skillCategories.length
    const angleSlice = (Math.PI * 2) / numPoints
    
    return skillCategories.map((category, i) => {
      const value = getSkillValue(skills, category)
      const normalizedValue = value / 100
      const angle = angleSlice * i - Math.PI / 2 // Start from top
      
      const x = center + radius * normalizedValue * Math.cos(angle)
      const y = center + radius * normalizedValue * Math.sin(angle)
      
      return { x, y, value, ...category }
    })
  }, [skills, center, radius])

  // Get axis end points
  const getAxisPoints = useMemo(() => {
    const numPoints = skillCategories.length
    const angleSlice = (Math.PI * 2) / numPoints
    
    return skillCategories.map((category, i) => {
      const angle = angleSlice * i - Math.PI / 2
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
        labelX: center + (radius + 30) * Math.cos(angle),
        labelY: center + (radius + 30) * Math.sin(angle),
        ...category
      }
    })
  }, [center, radius])

  // Generate level circles
  const levelCircles = useMemo(() => {
    return Array.from({ length: levels }, (_, i) => {
      const levelRadius = (radius / levels) * (i + 1)
      return { radius: levelRadius, value: ((i + 1) / levels) * 100 }
    })
  }, [radius, levels])

  // Create polygon path
  const polygonPath = useMemo(() => {
    return getPolygonPoints
      .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' Z'
  }, [getPolygonPoints])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          {/* Gradient for the filled area */}
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circles (levels) */}
        {levelCircles.map((level, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={level.radius}
            fill="none"
            stroke="rgba(0, 217, 255, 0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Axis lines */}
        {getAxisPoints.map((point, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="rgba(0, 217, 255, 0.15)"
            strokeWidth="1"
          />
        ))}

        {/* Filled area */}
        <motion.path
          d={polygonPath}
          fill="url(#radarGradient)"
          stroke="#00D9FF"
          strokeWidth="2"
          filter="url(#glow)"
          initial={animated ? { opacity: 0, scale: 0.5 } : {}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Data points */}
        {getPolygonPoints.map((point, i) => (
          <motion.g key={i}>
            {/* Point circle */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={hoveredSkill === point.key ? 8 : 5}
              fill={point.color}
              stroke="#0A0F1C"
              strokeWidth="2"
              filter="url(#glow)"
              initial={animated ? { scale: 0 } : {}}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
              onMouseEnter={() => setHoveredSkill(point.key)}
              onMouseLeave={() => setHoveredSkill(null)}
              style={{ cursor: 'pointer' }}
            />
            
            {/* Pulse animation on hover */}
            {hoveredSkill === point.key && (
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={12}
                fill="none"
                stroke={point.color}
                strokeWidth="2"
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.g>
        ))}

        {/* Labels */}
        {showLabels && getAxisPoints.map((point, i) => {
          // Calculate text anchor based on position
          const angle = (Math.PI * 2 / skillCategories.length) * i - Math.PI / 2
          const textAnchor = Math.abs(angle) < 0.1 || Math.abs(angle - Math.PI) < 0.1 
            ? 'middle' 
            : angle > -Math.PI / 2 && angle < Math.PI / 2 
              ? 'start' 
              : 'end'
          
          const isHovered = hoveredSkill === point.key
          
          return (
            <motion.g key={`label-${i}`}>
              <text
                x={point.labelX}
                y={point.labelY}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className={`text-sm font-heading transition-all duration-300 ${
                  isHovered ? 'fill-white' : 'fill-gray-400'
                }`}
                style={{ 
                  fontWeight: isHovered ? 600 : 400,
                  filter: isHovered ? 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.8))' : 'none'
                }}
              >
                {point.label}
              </text>
              
              {/* Value on hover */}
              {showValues && isHovered && (
                <motion.text
                  x={point.labelX}
                  y={point.labelY + 18}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  className="text-xs font-mono fill-primary"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {point.value}%
                </motion.text>
              )}
            </motion.g>
          )
        })}

        {/* Center decoration */}
        <circle
          cx={center}
          cy={center}
          r={8}
          fill="#00D9FF"
          opacity={0.3}
        />
        <circle
          cx={center}
          cy={center}
          r={4}
          fill="#00D9FF"
        />
      </svg>

      {/* Legend below the chart */}
      <motion.div 
        className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-full"
        initial={animated ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-wrap justify-center gap-4">
          {skillCategories.map((category) => (
            <div 
              key={category.key}
              className={`flex items-center space-x-2 cursor-pointer transition-all duration-300 ${
                hoveredSkill === category.key ? 'scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              onMouseEnter={() => setHoveredSkill(category.key)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs text-gray-400">{category.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Compact version for smaller displays
export const SkillsRadarCompact = ({ skills = defaultSkills }) => {
  return (
    <div className="flex justify-center">
      <SkillsRadar 
        skills={skills} 
        size={300} 
        showLabels={true}
        showValues={true}
      />
    </div>
  )
}

export default SkillsRadar

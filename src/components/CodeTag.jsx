import { motion } from 'framer-motion'

/**
 * CodeTag - Displays text in programming language syntax style
 * Supports: C/C++ (printf), Python (print), JavaScript (console.log), Rust (println!), Go (fmt.Println)
 * Randomly selects a language style for variety
 */

const codeStyles = [
  {
    language: 'c',
    format: (text) => `printf("${text}");`,
    color: 'text-blue-400',
  },
  {
    language: 'python',
    format: (text) => `print("${text}")`,
    color: 'text-green-400',
  },
  {
    language: 'cpp',
    format: (text) => `std::cout << "${text}";`,
    color: 'text-cyan-400',
  },
  {
    language: 'rust',
    format: (text) => `println!("${text}");`,
    color: 'text-orange-400',
  },
  {
    language: 'go',
    format: (text) => `fmt.Println("${text}")`,
    color: 'text-sky-400',
  },
]

// Deterministic selection based on text to keep consistency
const getStyleIndex = (text) => {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash) % codeStyles.length
}

const CodeTag = ({ 
  children, 
  language = 'auto', // 'auto' | 'c' | 'python' | 'cpp' | 'rust' | 'go'
  animate = true,
  className = '',
  size = 'sm' // 'xs' | 'sm' | 'md'
}) => {
  const text = typeof children === 'string' ? children : String(children)
  
  // Select style
  let style
  if (language === 'auto') {
    style = codeStyles[getStyleIndex(text)]
  } else {
    style = codeStyles.find(s => s.language === language) || codeStyles[0]
  }

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
  }

  // Screen readers get the plain label, not the code syntax around it.
  const content = (
    <>
      <span className="sr-only">{text}</span>
      <code aria-hidden="true" className={`font-mono ${style.color} ${sizeClasses[size]} tracking-wider break-words ${className}`}>
        {style.format(text)}
      </code>
    </>
  )

  if (animate) {
    return (
      <motion.span
        className="inline-block max-w-full"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content}
      </motion.span>
    )
  }

  return content
}

// Section tag variant with consistent styling
export const SectionTag = ({ children, className = '' }) => {
  return (
    <div className={`inline-block max-w-full px-4 py-2 rounded-lg bg-dark-light/50 border border-white/10 ${className}`}>
      <CodeTag size="sm" animate={false}>
        {children}
      </CodeTag>
    </div>
  )
}

export default CodeTag

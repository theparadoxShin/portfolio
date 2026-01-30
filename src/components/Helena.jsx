import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, X, Send, Bot, User, 
  Loader2, Sparkles, Minimize2 
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Suggested questions for users
const SUGGESTED_QUESTIONS = [
  "What are Ben's main skills?",
  "Tell me about his AI/ML projects",
  "What certifications does he have?",
  "What's his work experience?",
  "How can I contact him?"
]

function Helena() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Helena, Ben's AI assistant. I can tell you all about his skills, projects, experience, and more. What would you like to know?"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/helena/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Helena chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact Ben directly via the contact form." 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedQuestion = (question) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary
                       flex items-center justify-center shadow-glow cursor-pointer z-50
                       hover:shadow-glow-lg transition-shadow duration-300"
          >
            <Bot className="text-white" size={24} />
            
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-primary/50 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)]
                       bg-dark-lighter border border-white/10 rounded-2xl
                       shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4
                          border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary
                              flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Helena</h3>
                  <p className="text-gray-400 text-xs">AI Assistant • Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Minimize2 className="text-gray-400" size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="text-gray-400" size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[85%] ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' 
                            ? 'bg-primary/20' 
                            : 'bg-gradient-to-r from-primary to-secondary'
                        }`}>
                          {message.role === 'user' 
                            ? <User className="text-primary" size={16} />
                            : <Bot className="text-white" size={16} />
                          }
                        </div>
                        <div className={`rounded-2xl px-4 py-2.5 ${
                          message.role === 'user'
                            ? 'bg-primary text-white rounded-tr-sm'
                            : 'bg-dark border border-white/10 text-gray-200 rounded-tl-sm'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start space-x-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary
                                    flex items-center justify-center">
                        <Bot className="text-white" size={16} />
                      </div>
                      <div className="bg-dark border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                        <Loader2 className="text-primary animate-spin" size={18} />
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-2 flex-shrink-0">
                    <p className="text-gray-500 text-xs mb-2">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.slice(0, 3).map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400
                                   hover:bg-white/10 hover:text-white transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/10 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about Ben..."
                      className="flex-1 bg-dark border border-white/10 rounded-xl px-4 py-2.5
                               text-white placeholder-gray-500 text-sm
                               focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary
                               flex items-center justify-center
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:opacity-90 transition-opacity"
                    >
                      <Send className="text-white" size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Helena

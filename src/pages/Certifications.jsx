import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [filter, setFilter] = useState('all');

  // Static certifications data (will be replaced by API)
  const certifications = [
    {
      id: 1,
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2024',
      credentialId: 'AWS-CCP-2024',
      category: 'cloud',
      logo: '☁️',
      color: '#FF9900',
      description: 'Foundational understanding of AWS Cloud concepts, services, security, architecture, pricing, and support.',
      skills: ['AWS Services', 'Cloud Architecture', 'Security', 'Cost Management'],
      verifyUrl: 'https://aws.amazon.com/verification'
    },
    {
      id: 2,
      name: 'AWS Certified AI Practitioner',
      issuer: 'Amazon Web Services',
      date: '2024',
      credentialId: 'AWS-AIP-2024',
      category: 'ai',
      logo: '🤖',
      color: '#FF9900',
      description: 'Demonstrates knowledge of AI/ML concepts and how to apply them using AWS services.',
      skills: ['Machine Learning', 'AI Services', 'Amazon Bedrock', 'SageMaker'],
      verifyUrl: 'https://aws.amazon.com/verification'
    },
    {
      id: 3,
      name: 'Generative AI with LLMs',
      issuer: 'DeepLearning.AI',
      date: '2024',
      credentialId: 'DLAI-GENAI-2024',
      category: 'ai',
      logo: '🧠',
      color: '#00A3E0',
      description: 'Advanced understanding of generative AI, large language models, and their applications.',
      skills: ['LLMs', 'Prompt Engineering', 'Fine-tuning', 'RAG'],
      verifyUrl: 'https://www.deeplearning.ai/verify'
    },
    {
      id: 4,
      name: 'AI Agents in LangGraph',
      issuer: 'DeepLearning.AI',
      date: '2024',
      credentialId: 'DLAI-LANGGRAPH-2024',
      category: 'ai',
      logo: '⚡',
      color: '#00A3E0',
      description: 'Building and deploying AI agents using LangGraph framework for complex workflows.',
      skills: ['LangGraph', 'AI Agents', 'Workflow Automation', 'LangChain'],
      verifyUrl: 'https://www.deeplearning.ai/verify'
    },
    {
      id: 5,
      name: 'Multi AI Agent Systems with crewAI',
      issuer: 'DeepLearning.AI',
      date: '2024',
      credentialId: 'DLAI-CREWAI-2024',
      category: 'ai',
      logo: '👥',
      color: '#00A3E0',
      description: 'Designing and implementing multi-agent AI systems for collaborative problem solving.',
      skills: ['crewAI', 'Multi-Agent Systems', 'Orchestration', 'Agent Communication'],
      verifyUrl: 'https://www.deeplearning.ai/verify'
    },
    {
      id: 6,
      name: 'Mechatronics Engineering Diploma',
      issuer: 'Institut Universitaire de Technologie',
      date: '2019',
      credentialId: 'IUT-MECA-2019',
      category: 'engineering',
      logo: '⚙️',
      color: '#6B7280',
      description: 'Comprehensive engineering degree covering mechanics, electronics, and computer science integration.',
      skills: ['Robotics', 'Embedded Systems', 'CAD/CAM', 'Control Systems'],
      verifyUrl: null
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: '🎯' },
    { id: 'cloud', label: 'Cloud', icon: '☁️' },
    { id: 'ai', label: 'AI/ML', icon: '🤖' },
    { id: 'engineering', label: 'Engineering', icon: '⚙️' }
  ];

  const filteredCerts = filter === 'all' 
    ? certifications 
    : certifications.filter(cert => cert.category === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
          >
            <span className="text-2xl">🏆</span>
            <span className="text-primary font-medium">Certifications & Credentials</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Professional</span>{' '}
            <span className="text-white">Certifications</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Validated expertise through industry-recognized certifications in cloud computing, 
            artificial intelligence, and engineering.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { value: certifications.length, label: 'Certifications', icon: '📜' },
            { value: certifications.filter(c => c.category === 'ai').length, label: 'AI/ML Certs', icon: '🤖' },
            { value: certifications.filter(c => c.category === 'cloud').length, label: 'Cloud Certs', icon: '☁️' },
            { value: '2024', label: 'Latest Year', icon: '📅' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === cat.id
                  ? 'bg-primary text-dark shadow-lg shadow-primary/30'
                  : 'glass-card text-gray-300 hover:text-white hover:border-primary/50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert) => (
              <motion.div
                key={cert.id}
                variants={cardVariants}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setSelectedCert(cert)}
                className="glass-card p-6 cursor-pointer group hover:border-primary/50 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${cert.color}20` }}
                  >
                    {cert.logo}
                  </motion.div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${cert.color}20`, color: cert.color }}
                  >
                    {cert.date}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {cert.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{cert.issuer}</p>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 rounded-md text-xs bg-white/5 text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {cert.skills.length > 3 && (
                    <span className="px-2 py-1 rounded-md text-xs bg-primary/20 text-primary">
                      +{cert.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-gray-500">ID: {cert.credentialId}</span>
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="text-primary text-sm flex items-center gap-1"
                  >
                    View Details →
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl"
                    style={{ backgroundColor: `${selectedCert.color}20` }}
                  >
                    {selectedCert.logo}
                  </motion.div>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <h2 className="text-2xl font-bold text-white mb-2">{selectedCert.name}</h2>
                <p className="text-primary font-medium mb-4">{selectedCert.issuer}</p>
                
                <p className="text-gray-400 mb-6">{selectedCert.description}</p>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass-card p-3">
                    <span className="text-xs text-gray-500">Issued</span>
                    <p className="text-white font-medium">{selectedCert.date}</p>
                  </div>
                  <div className="glass-card p-3">
                    <span className="text-xs text-gray-500">Credential ID</span>
                    <p className="text-white font-medium text-sm">{selectedCert.credentialId}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Skills Validated</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg text-sm"
                        style={{ backgroundColor: `${selectedCert.color}20`, color: selectedCert.color }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {selectedCert.verifyUrl && (
                  <motion.a
                    href={selectedCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full py-3 rounded-lg text-center font-medium transition-all"
                    style={{ backgroundColor: selectedCert.color, color: '#000' }}
                  >
                    Verify Credential ↗
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="glass-card p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Continuous Learning Journey
            </h3>
            <p className="text-gray-400 mb-6">
              I'm committed to staying at the forefront of technology. 
              Currently pursuing AWS Solutions Architect and more AI certifications.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg bg-primary text-dark font-medium"
              >
                Let's Connect
              </motion.a>
              <motion.a
                href="/projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg glass-card text-white font-medium"
              >
                View My Work
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certifications;

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, Bot, Brain, Zap, Users, Cog, Award, Shield,
  Code2, Database, Server, Filter, ExternalLink, X, Trophy
} from 'lucide-react';
import { useCertifications } from '../hooks/useApi';

// Icon component mapping
const IconComponent = ({ name, size = 24, className = '' }) => {
  const icons = {
    cloud: Cloud,
    bot: Bot,
    brain: Brain,
    zap: Zap,
    users: Users,
    cog: Cog,
    award: Award,
    shield: Shield,
    code: Code2,
    database: Database,
    server: Server,
  };
  const Icon = icons[name] || Award;
  return <Icon size={size} className={className} />;
};

// Fallback certifications data
const fallbackCertifications = [
  {
    _id: '1',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issueDate: '2024-01-15',
    credentialId: 'AWS-CCP-2024',
    category: 'cloud',
    level: 'foundational',
    icon: 'cloud',
    color: '#FF9900',
    description: 'Foundational understanding of AWS Cloud concepts, services, security, architecture, pricing, and support.',
    skills: ['AWS Services', 'Cloud Architecture', 'Security', 'Cost Management'],
    credentialUrl: 'https://aws.amazon.com/verification',
    isPublished: true
  },
  {
    _id: '2',
    name: 'AWS Certified AI Practitioner',
    issuer: 'Amazon Web Services',
    issueDate: '2024-03-20',
    credentialId: 'AWS-AIP-2024',
    category: 'ai-ml',
    level: 'foundational',
    icon: 'bot',
    color: '#FF9900',
    description: 'Demonstrates knowledge of AI/ML concepts and how to apply them using AWS services.',
    skills: ['Machine Learning', 'AI Services', 'Amazon Bedrock', 'SageMaker'],
    credentialUrl: 'https://aws.amazon.com/verification',
    isPublished: true
  },
  {
    _id: '3',
    name: 'Generative AI with LLMs',
    issuer: 'DeepLearning.AI',
    issueDate: '2024-02-10',
    credentialId: 'DLAI-GENAI-2024',
    category: 'ai-ml',
    level: 'associate',
    icon: 'brain',
    color: '#00A3E0',
    description: 'Advanced understanding of generative AI, large language models, and their applications.',
    skills: ['LLMs', 'Prompt Engineering', 'Fine-tuning', 'RAG'],
    credentialUrl: 'https://www.deeplearning.ai/verify',
    isPublished: true
  },
  {
    _id: '4',
    name: 'AI Agents in LangGraph',
    issuer: 'DeepLearning.AI',
    issueDate: '2024-04-05',
    credentialId: 'DLAI-LANGGRAPH-2024',
    category: 'ai-ml',
    level: 'associate',
    icon: 'zap',
    color: '#00A3E0',
    description: 'Building and deploying AI agents using LangGraph framework for complex workflows.',
    skills: ['LangGraph', 'AI Agents', 'Workflow Automation', 'LangChain'],
    credentialUrl: 'https://www.deeplearning.ai/verify',
    isPublished: true
  },
  {
    _id: '5',
    name: 'Multi AI Agent Systems with crewAI',
    issuer: 'DeepLearning.AI',
    issueDate: '2024-05-15',
    credentialId: 'DLAI-CREWAI-2024',
    category: 'ai-ml',
    level: 'associate',
    icon: 'users',
    color: '#00A3E0',
    description: 'Designing and implementing multi-agent AI systems for collaborative problem solving.',
    skills: ['crewAI', 'Multi-Agent Systems', 'Orchestration', 'Agent Communication'],
    credentialUrl: 'https://www.deeplearning.ai/verify',
    isPublished: true
  },
  {
    _id: '6',
    name: 'Mechatronics Engineering Diploma',
    issuer: 'Institut Universitaire de Technologie',
    issueDate: '2019-07-01',
    credentialId: 'IUT-MECA-2019',
    category: 'other',
    level: 'professional',
    icon: 'cog',
    color: '#6B7280',
    description: 'Comprehensive engineering degree covering mechanics, electronics, and computer science integration.',
    skills: ['Robotics', 'Embedded Systems', 'CAD/CAM', 'Control Systems'],
    credentialUrl: null,
    isPublished: true
  }
];

// Category mapping for filtering
const categoryMapping = {
  'all': 'all',
  'cloud': 'cloud',
  'ai': 'ai-ml',
  'ai-ml': 'ai-ml',
  'engineering': 'other',
  'other': 'other'
};

// Helper functions
const getCategoryIcon = (category) => {
  const iconMap = {
    'cloud': 'cloud',
    'ai-ml': 'bot',
    'development': 'code',
    'security': 'shield',
    'data': 'database',
    'devops': 'server',
    'other': 'award'
  };
  return iconMap[category] || 'award';
};

const getCategoryColor = (category) => {
  const colorMap = {
    'cloud': '#FF9900',
    'ai-ml': '#00A3E0',
    'development': '#3B82F6',
    'security': '#EF4444',
    'data': '#10B981',
    'devops': '#8B5CF6',
    'other': '#6B7280'
  };
  return colorMap[category] || '#6B7280';
};

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [filter, setFilter] = useState('all');
  const { certifications: apiCertifications, loading } = useCertifications();
  
  // Use API data if available, otherwise fallback
  const certifications = useMemo(() => {
    if (apiCertifications?.length > 0) {
      // Map API data to display format
      return apiCertifications.map(cert => ({
        ...cert,
        icon: cert.icon || getCategoryIcon(cert.category),
        color: cert.color || getCategoryColor(cert.category),
        date: cert.issueDate ? new Date(cert.issueDate).getFullYear().toString() : 'N/A',
        verifyUrl: cert.credentialUrl
      }));
    }
    // Add computed fields to fallback data
    return fallbackCertifications.map(cert => ({
      ...cert,
      date: cert.issueDate ? new Date(cert.issueDate).getFullYear().toString() : 'N/A',
      verifyUrl: cert.credentialUrl
    }));
  }, [apiCertifications]);

  const categories = [
    { id: 'all', label: 'All', iconName: 'filter' },
    { id: 'cloud', label: 'Cloud', iconName: 'cloud' },
    { id: 'ai', label: 'AI/ML', iconName: 'bot' },
    { id: 'engineering', label: 'Engineering', iconName: 'cog' }
  ];

  // Category icons mapping
  const CategoryIcon = ({ name }) => {
    const icons = { filter: Filter, cloud: Cloud, bot: Bot, cog: Cog };
    const Icon = icons[name] || Filter;
    return <Icon size={16} />;
  };

  const filteredCerts = filter === 'all' 
    ? certifications 
    : certifications.filter(cert => {
        const mappedFilter = categoryMapping[filter] || filter;
        return cert.category === mappedFilter || cert.category === filter;
      });

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
            <Trophy className="w-5 h-5 text-primary" />
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
            { value: certifications.length, label: 'Certifications', iconName: 'award' },
            { value: certifications.filter(c => c.category === 'ai-ml').length, label: 'AI/ML Certs', iconName: 'bot' },
            { value: certifications.filter(c => c.category === 'cloud').length, label: 'Cloud Certs', iconName: 'cloud' },
            { value: '2024', label: 'Latest Year', iconName: 'zap' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <div className="text-primary mb-2 flex justify-center">
                <IconComponent name={stat.iconName} size={28} />
              </div>
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
              <CategoryIcon name={cat.iconName} />
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
                key={cert._id || cert.id}
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
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${cert.color}20`, color: cert.color }}
                  >
                    <IconComponent name={cert.icon} size={28} />
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
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedCert.color}20`, color: selectedCert.color }}
                  >
                    <IconComponent name={selectedCert.icon} size={40} />
                  </motion.div>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={24} />
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
              Currently pursuing AWS, Nvidia, and more AI certifications.
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

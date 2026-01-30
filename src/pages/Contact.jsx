import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContact } from '../hooks/useApi';

const Contact = () => {
  const { submitContact, loading, error, success, reset } = useContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    source: 'portfolio'
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitContact(formData);
    if (result) {
      setFormData({ name: '', email: '', subject: '', message: '', source: 'portfolio' });
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      label: 'Email',
      value: 'contact@parfaittedomtedom.com',
      href: 'mailto:contact@parfaittedomtedom.com',
      color: '#00D9FF'
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'Ben Parfait Tedomtedom',
      href: 'https://linkedin.com/in/parfaittedomtedom',
      color: '#0077B5'
    },
    {
      icon: '🐙',
      label: 'GitHub',
      value: '@parfaittedomtedom',
      href: 'https://github.com/parfaittedomtedom',
      color: '#8B5CF6'
    },
    {
      icon: '📍',
      label: 'Location',
      value: 'Montreal, QC, Canada',
      href: null,
      color: '#10B981'
    }
  ];

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 rounded-lg bg-white/5 border transition-all duration-300
    ${focusedField === fieldName 
      ? 'border-primary shadow-lg shadow-primary/20' 
      : 'border-white/10 hover:border-white/20'}
    text-white placeholder-gray-500 outline-none
  `;

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
            <span className="text-2xl">✉️</span>
            <span className="text-primary font-medium">Get In Touch</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Let's</span>{' '}
            <span className="gradient-text">Connect</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or just want to chat? I'd love to hear from you. 
            Drop me a message and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        <span
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${item.color}20` }}
                        >
                          {item.icon}
                        </span>
                        <div>
                          <p className="text-sm text-gray-500">{item.label}</p>
                          <p className="text-white group-hover:text-primary transition-colors">
                            {item.value}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-3">
                        <span
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${item.color}20` }}
                        >
                          {item.icon}
                        </span>
                        <div>
                          <p className="text-sm text-gray-500">{item.label}</p>
                          <p className="text-white">{item.value}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Availability Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-green-400 font-medium">Available for opportunities</span>
              </div>
              <p className="text-gray-400 text-sm">
                Currently open for freelance projects, consulting, and full-time positions 
                in robotics, AI, and full-stack development.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card p-6"
            >
              <h4 className="text-white font-medium mb-4">Quick Links</h4>
              <div className="flex flex-wrap gap-2">
                {['Resume', 'Projects', 'LinkedIn', 'GitHub'].map((link) => (
                  <motion.a
                    key={link}
                    href={link === 'Projects' ? '/projects' : '#'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:text-primary hover:bg-white/10 transition-all text-sm"
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                    >
                      <span className="text-5xl">✅</span>
                    </motion.div>
                    <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                    <p className="text-gray-400 mb-6">
                      Thank you for reaching out. I'll get back to you soon.
                    </p>
                    <motion.button
                      onClick={reset}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-lg bg-primary text-dark font-medium"
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Name & Email Row */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Your name"
                          required
                          className={inputClasses('name')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="your@email.com"
                          required
                          className={inputClasses('email')}
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="What's this about?"
                        required
                        className={inputClasses('subject')}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Tell me about your project or inquiry..."
                        required
                        rows={5}
                        className={inputClasses('message') + ' resize-none'}
                      />
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className={`
                        w-full py-4 rounded-lg font-medium text-lg transition-all duration-300
                        ${loading 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-primary text-dark hover:shadow-lg hover:shadow-primary/30'}
                      `}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Map / CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="glass-card p-8 md:p-12 text-center max-w-4xl mx-auto">
            <div className="flex justify-center gap-4 mb-6">
              {['🇨🇦', '🤖', '☁️', '⚡'].map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-4xl"
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Based in Montreal, Working Globally
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Whether you're in North America, Europe, or anywhere else, 
              I'm ready to collaborate on your next innovative project.
              Let's build something amazing together.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

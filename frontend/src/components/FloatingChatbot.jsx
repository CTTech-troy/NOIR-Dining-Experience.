import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Phone, Mic, Volume2 } from 'lucide-react';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 Welcome to NOIR. How can I help you today? I can help with reservations, menu questions, or place an order.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponses = [
        'That sounds great! Would you like to make a reservation or place an order?',
        'I\'d be happy to help! Can you tell me more about what you\'re looking for?',
        'Absolutely! Our menu features authentic French cuisine with modern touches.',
        'Perfect! When would you like to visit us? I can check availability for you.',
        'You can reach our team at (555) 123-4567 for special requests.'
      ];
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleStartCall = () => {
    setIsCallActive(!isCallActive);
    // Implement actual voice call integration here
    if (!isCallActive) {
      const callMessage = {
        id: messages.length + 1,
        type: 'system',
        text: '📞 Voice call started...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, callMessage]);
    }
  };

  const handleVoiceInput = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    // Implement voice recognition here
    if (!isVoiceEnabled) {
      const voiceMessage = {
        id: messages.length + 1,
        type: 'system',
        text: '🎤 Listening...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, voiceMessage]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gold-400 text-black rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-full max-w-sm h-[600px] bg-dark-100 border border-gold-400/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gold-400/10 to-dark-200 border-b border-gold-400/20 p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-serif font-bold text-gold-400">NOIR AI Assistant</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gold-400/10 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-white/60">Chat, call, or voice assist</p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-100/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-gold-400 text-black rounded-br-none'
                        : msg.type === 'system'
                        ? 'bg-dark-200 text-gold-400 text-sm italic'
                        : 'bg-dark-200 text-white border border-gold-400/20 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-xs mt-1 block ${
                      msg.type === 'user'
                        ? 'text-black/50'
                        : 'text-white/40'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 items-center"
                >
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="w-2 h-2 bg-gold-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-gold-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-gold-400 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gold-400/20 p-3 bg-dark-200/50 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isVoiceEnabled
                    ? 'bg-gold-400 text-black'
                    : 'bg-dark-100 border border-gold-400/30 text-white hover:border-gold-400'
                }`}
                title="Voice Input"
              >
                <Mic className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartCall}
                className={`p-2 rounded-lg transition-colors ${
                  isCallActive
                    ? 'bg-gold-400 text-black'
                    : 'bg-dark-100 border border-gold-400/30 text-white hover:border-gold-400'
                }`}
                title="Voice Call"
              >
                <Phone className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-dark-100 border border-gold-400/30 text-white hover:border-gold-400 transition-colors"
                title="Text to Speech"
              >
                <Volume2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="border-t border-gold-400/20 p-3 bg-dark-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-dark-200 border border-gold-400/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-gold-400 transition-colors text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-gold-400 text-black rounded-lg px-4 py-2 font-semibold hover:bg-gold-500 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

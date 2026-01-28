// Logger utility - sends all logs to backend terminal
const BACKEND_LOG_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export const logger = {
  log: (message, ...args) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message} ${args.join(' ')}`;
    
    // Still log to browser for immediate feedback
    console.log(logMessage);
    
    // Send to backend
    fetch(`${BACKEND_LOG_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        level: 'info',
        message,
        args,
        timestamp
      })
    }).catch(() => {}); // Silently fail if backend not available
  },

  error: (message, ...args) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `❌ [${timestamp}] ${message} ${args.join(' ')}`;
    
    console.error(logMessage);
    
    fetch(`${BACKEND_LOG_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        level: 'error',
        message,
        args,
        timestamp
      })
    }).catch(() => {});
  },

  warn: (message, ...args) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `⚠️ [${timestamp}] ${message} ${args.join(' ')}`;
    
    console.warn(logMessage);
    
    fetch(`${BACKEND_LOG_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        level: 'warn',
        message,
        args,
        timestamp
      })
    }).catch(() => {});
  }
};

export default logger;

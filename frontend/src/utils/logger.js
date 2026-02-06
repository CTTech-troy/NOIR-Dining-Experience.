// Logger utility - sends all logs to backend terminal
const BACKEND_LOG_URL = import.meta.env.VITE_BACKEND_URL || 'https://noirdining.netlify.app/api';

// Small helper that posts JSON with a short timeout and swallows errors
async function postWithTimeout(url, payload, timeout = 4000) {
  if (!url) return;
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(id);
  } catch (e) {
    // network errors/timeouts are expected in some environments; don't throw
  }
}

export const logger = {
  log: (message, ...args) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message} ${args.join(' ')}`;
    console.log(logMessage);
    // fire-and-forget with timeout
    postWithTimeout(`${BACKEND_LOG_URL}/logs`, {
      level: 'info',
      message,
      args,
      timestamp
    });
  },

  error: (message, ...args) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `❌ [${timestamp}] ${message} ${args.join(' ')}`;
    console.error(logMessage);
    postWithTimeout(`${BACKEND_LOG_URL}/logs`, {
      level: 'error',
      message,
      args,
      timestamp
    });
  },

  warn: (message, ...args) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `⚠️ [${timestamp}] ${message} ${args.join(' ')}`;
    console.warn(logMessage);
    postWithTimeout(`${BACKEND_LOG_URL}/logs`, {
      level: 'warn',
      message,
      args,
      timestamp
    });
  }
};

export default logger;

/**
 * VAPI Direct Integration
 * Simple direct integration without complex module loading
 * Place this in public/ folder for direct access
 */

// Load VAPI SDK from public CDN
window.loadVapiSDK = async function() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.Vapi) {
      console.log('✅ VAPI SDK already loaded');
      resolve(window.Vapi);
      return;
    }

    const cdnUrls = [
      'https://unpkg.com/@vapi-ai/web@latest/dist/index.umd.js',
      'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/index.umd.js',
      'https://cdn.vapi.ai/web/latest/vapi.js'
    ];

    let currentUrlIndex = 0;

    const loadScript = () => {
      if (currentUrlIndex >= cdnUrls.length) {
        reject(new Error('All VAPI CDN URLs failed'));
        return;
      }

      const url = cdnUrls[currentUrlIndex];
      console.log(`📡 Loading VAPI from: ${url}`);

      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.type = 'text/javascript';

      script.onload = () => {
        console.log(`✅ VAPI SDK loaded from: ${url}`);
        
        // Give it a moment to initialize
        setTimeout(() => {
          if (window.Vapi || window.default) {
            const VapiClass = window.Vapi || window.default;
            resolve(VapiClass);
          } else {
            // Try next URL
            currentUrlIndex++;
            loadScript();
          }
        }, 500);
      };

      script.onerror = () => {
        console.warn(`⏭️ Failed to load from ${url}, trying next...`);
        currentUrlIndex++;
        loadScript();
      };

      document.head.appendChild(script);
    };

    loadScript();
  });
};

// Create VAPI instance
window.initializeVapi = async function(apiKey) {
  try {
    const Vapi = await window.loadVapiSDK();
    
    if (!Vapi) {
      throw new Error('VAPI SDK not available');
    }

    const instance = new Vapi(apiKey);
    console.log('✅ VAPI instance created successfully');
    
    return instance;
  } catch (error) {
    console.error('❌ Failed to initialize VAPI:', error);
    throw error;
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadVapiSDK: window.loadVapiSDK,
    initializeVapi: window.initializeVapi
  };
}

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Phone, Mic } from "lucide-react";
// import { encryptPayload } from "../utils/encryption";
import { logger } from "../utils/logger";

// ==================== CONFIGURATION ====================
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

logger.log("🔧 VAPI Configuration - Using CDN Script");
logger.log("📡 SDK loaded via: https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js");
logger.log("🌐 Backend URL:", BACKEND_URL);

// ==================== COMPONENT ====================
export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [voiceConnectionStatus, setVoiceConnectionStatus] = useState("idle"); // idle, connecting, connected, failed
  const [retryCount, setRetryCount] = useState(0);
  const [useTextChat, setUseTextChat] = useState(false);
  const [voiceActivityDetected, setVoiceActivityDetected] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0); // 0-100 for visual indicator

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! 👋 Welcome to NOIR. How can I help you today?",
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef(null);

  // ---- Call session storage ----
  const callSessionRef = useRef({
    callId: null,
    transcript: [],
    summary: null,
    recordingUrl: null,
    startedAt: null,
    endedAt: null
  });

  // ---- Refs ----
  const vapiInstanceRef = useRef(null);
  const audioRef = useRef(null);

  // ---- Auto scroll chat ----
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Initialize Vapi from window.vapiSDK ----
  useEffect(() => {
    const initializeVapi = () => {
      try {
        if (window.vapiSDK) {
          logger.log("✅ Vapi SDK loaded from window.vapiSDK");
          logger.log("🚀 Vapi SDK ready for voice calls");
          vapiInstanceRef.current = window.vapiSDK;
        } else {
          logger.warn("⏳ Vapi SDK not loaded yet from CDN, will retry...");
          setTimeout(initializeVapi, 500);
        }
      } catch (error) {
        logger.error("❌ Vapi SDK check failed:", error.message);
      }
    };

    initializeVapi();
  }, []);

  // ---- Check Microphone Permissions ----
  useEffect(() => {
    const checkMicrophoneAccess = async () => {
      try {
        logger.log("🎤 Checking microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        logger.log("✅ Microphone access GRANTED");
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        logger.error("❌ Microphone access DENIED:", error.name, "-", error.message);
        if (error.name === "NotAllowedError") {
          addMessage("system", "❌ Microphone permission denied. Please allow microphone access in browser settings.");
        } else if (error.name === "NotFoundError") {
          addMessage("system", "❌ No microphone device found. Please check your hardware.");
        }
      }
    };

    checkMicrophoneAccess();
  }, []);

  // ---- Verify Environment Variables ----
  useEffect(() => {
    const vapiApiKey = import.meta.env.VITE_VAPI_API_KEY;
    const vapiAssistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
    
    logger.log("🔐 Environment Check:");
    logger.log("  - VAPI_API_KEY:", vapiApiKey ? "✅ Loaded" : "❌ MISSING");
    logger.log("  - VAPI_ASSISTANT_ID:", vapiAssistantId ? "✅ Loaded" : "❌ MISSING");
    logger.log("  - BACKEND_URL:", BACKEND_URL);
    
    if (!vapiApiKey || !vapiAssistantId) {
      addMessage("system", "⚠️ Missing VAPI credentials. Check .env file.");
    }
  }, []);

  // ---- Make Voice Call using Vapi SDK ----
  const makeVoiceCall = async () => {
    try {
      if (!window.vapiSDK) {
        throw new Error("Vapi SDK not loaded. Please check CDN connection.");
      }

      logger.log("📞 Starting voice call with Vapi SDK...");

      const vapiApiKey = import.meta.env.VITE_VAPI_API_KEY;
      const vapiAssistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

      if (!vapiApiKey || !vapiAssistantId) {
        throw new Error("Vapi credentials missing from environment");
      }

      // Start the call using Vapi SDK (browser WebRTC microphone only)
      logger.log("🎙️ Calling window.vapiSDK.run() with credentials...");
      logger.log("📋 Call Config:", {
        hasApiKey: !!vapiApiKey,
        hasAssistantId: !!vapiAssistantId,
        apiKeyLength: vapiApiKey?.length,
        assistantIdLength: vapiAssistantId?.length
      });

      window.vapiSDK.run({
        apiKey: vapiApiKey,
        assistant: vapiAssistantId,
        onMessage: handleVapiMessage,
        onError: handleVapiError,
        onEnd: handleVapiEnd
      });

      logger.log("✅ Vapi call initiated - SDK will handle mic & audio automatically");
      logger.log("📢 Waiting for assistant to start speaking (First Message Mode)...");

      return { success: true };
    } catch (error) {
      logger.error("❌ Vapi call failed:", error.message);
      throw error;
    }
  };

  // Handle Vapi messages
  const handleVapiMessage = (message) => {
    logger.log("📬 Vapi message received:", message.type || message);
    
    // Log all message details for debugging
    if (message.type) {
      logger.log("  ➜ Message type:", message.type);
      if (message.transcript) logger.log("  ➜ Transcript:", message.transcript);
      if (message.transcription) logger.log("  ➜ Transcription:", message.transcription);
    }
    
    if (message.type === "user-transcription" || message.type === "user_transcription") {
      setVoiceActivityDetected(true);
      const text = message.transcription || message.text || "";
      if (text) {
        logger.log("🎤 User:", text.substring(0, 50));
        addMessage("user", text);
      }
    } else if (message.type === "assistant-transcription" || message.type === "assistant_transcription") {
      const text = message.transcription || message.text || "";
      if (text) {
        logger.log("🤖 Assistant:", text.substring(0, 50));
        addMessage("bot", text);
      }
    } else if (message.type === "call-start" || message.type === "call_start") {
      logger.log("📞 Call started - Listening for assistant to speak...");
      addMessage("system", "📞 Call connected - Listening for assistant...");
    } else if (message.type === "call-end" || message.type === "call_end") {
      logger.log("📴 Call ended");
      setVoiceActivityDetected(false);
      setVolumeLevel(0);
    } else if (message.type === "remote-audio" || message.type === "remote-stream" || message.type === "audio") {
      logger.log("🎧 Remote audio received:", message.type);
      if (message.stream && audioRef.current) {
        audioRef.current.srcObject = message.stream;
        audioRef.current.play().then(() => {
          logger.log("🔊 Assistant audio playing!");
        }).catch((err) => {
          logger.error("❌ Audio playback failed:", err.name, "-", err.message);
          logger.warn("⚠️ Browser may have blocked autoplay. Common causes:");
          logger.warn("   - Browser autoplay policy requires user interaction first");
          logger.warn("   - Volume might be muted");
          logger.warn("   - Check audio output device in system settings");
        });
      }
    } else {
      // Log unknown message types for debugging
      logger.log("❓ Unknown message type:", JSON.stringify(message));
    }
  };

  const handleVapiError = (error) => {
    logger.error("❌ Vapi error:", error);
    logger.error("   Error details:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      type: typeof error
    });
    const errorMsg = error?.message || error?.toString() || "Unknown error";
    addMessage("system", `❌ Error: ${errorMsg}`);
  };

  const handleVapiEnd = () => {
    logger.log("📴 Vapi call ended");
    logger.log("📊 Call Statistics:");
    if (callSessionRef.current) {
      logger.log("  - Duration:", callSessionRef.current.endedAt ? (callSessionRef.current.endedAt - callSessionRef.current.startedAt) / 1000 + "s" : "N/A");
      logger.log("  - Messages:", messages.length);
    }
    
    // Ensure SDK is fully stopped and UI is closed
    try {
      const vapi = vapiInstanceRef.current || window.vapiSDK;
      if (vapi && vapi.stop) {
        vapi.stop();
        logger.log("🛑 Vapi SDK stopped");
      }
      
      // Hide any remaining Vapi UI elements
      const vapiRoot = document.getElementById('vapi-root');
      if (vapiRoot) {
        vapiRoot.style.display = 'none';
        vapiRoot.style.visibility = 'hidden';
      }
    } catch (error) {
      logger.warn("⚠️ Could not fully close Vapi UI:", error.message);
    }
    
    setIsCallActive(false);
    setVoiceActivityDetected(false);
    setVolumeLevel(0);
    setVoiceConnectionStatus("idle");
  };

  // ---- Add message to chat ----
  const addMessage = (type, text) => {
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        type,
        text,
        timestamp: new Date()
      }
    ]);
  };

  // ==================== VAPI CALL MANAGEMENT ====================
  const handleStartCall = async () => {
    if (!isCallActive) {
      try {
        logger.log("📞 Starting voice call with Vapi SDK...");
        logger.log("💡 Troubleshooting Checklist:");
        logger.log("  1️⃣ Microphone must be ALLOWED in browser");
        logger.log("  2️⃣ Check VAPI_ASSISTANT_ID in Vapi Dashboard - set First Message Mode to 'Assistant Speaks First'");
        logger.log("  3️⃣ Audio output device should be enabled (not muted)");
        logger.log("  4️⃣ Open browser console (F12) to see all messages below");

        if (!window.vapiSDK) {
          throw new Error("Vapi SDK not available. Please refresh the page.");
        }

        setIsLoading(true);
        setVoiceConnectionStatus("connecting");
        addMessage("system", "⏳ Initializing voice call...");

        // Start the call - Vapi SDK handles microphone automatically
        await makeVoiceCall();

        callSessionRef.current.startedAt = Date.now();
        callSessionRef.current.transcript = [];

        setIsCallActive(true);
        setIsLoading(false);
        setVoiceConnectionStatus("connected");
        setRetryCount(0);

        addMessage("system", "✅ Call connected! Speak now...");

        // Log to backend
        try {
          await fetch(`${BACKEND_URL}/vapi/initiate-call`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: "web-user",
              timestamp: new Date().toISOString()
            })
          });
          logger.log("✅ Call logged to backend");
        } catch (logError) {
          logger.warn("⚠️ Backend logging failed:", logError.message);
        }

        } catch (error) {
        logger.error("❌ Call failed:", error.message);
        setIsLoading(false);
        setVoiceConnectionStatus("failed");
        addMessage("system", `❌ Error: ${error.message}`);

        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          addMessage("system", `🔄 Retrying... (Attempt ${retryCount + 2}/3)`);
          setTimeout(handleStartCall, 2000);
        }
      }
    }
  };

  // ==================== END CALL ====================
  const handleEndCall = async () => {
    if (isCallActive) {
      try {
        logger.log("📴 Ending voice call...");

        // Stop the call via SDK
        const vapi = vapiInstanceRef.current || window.vapiSDK;
        if (vapi && vapi.stop) {
          vapi.stop();
          logger.log("✅ Call stopped via SDK");
        }

        setIsCallActive(false);
        setVoiceActivityDetected(false);
        setVolumeLevel(0);
        setVoiceConnectionStatus("idle");

        addMessage("system", "✅ Call ended");

        // Log call end to backend
        try {
          const callId = callSessionRef.current.callId || `call_${Date.now()}`;
          await fetch(`${BACKEND_URL}/vapi/end-call`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              callId: callId,
              transcript: callSessionRef.current.transcript,
              duration: (Date.now() - (callSessionRef.current.startedAt || Date.now())) / 1000,
              timestamp: new Date().toISOString()
            })
          });
          logger.log("✅ Call end logged to backend");
        } catch (logError) {
          logger.warn("⚠️ Failed to log call end:", logError.message);
        }

        callSessionRef.current.endedAt = Date.now();
      } catch (error) {
        logger.error("❌ Error ending call:", error.message);
        setIsCallActive(false);
        addMessage("system", "❌ Error ending call");
      }
    }
  };

  // ==================== TEXT CHAT MESSAGE HANDLING ====================
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage("user", input);
    setInput("");
  };

  const handleVoiceInput = () => {
    setIsVoiceEnabled(prev => !prev);
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        type: "system",
        text: !isVoiceEnabled
          ? "🎤 Voice input enabled"
          : "🎤 Voice input disabled",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Hidden Audio Element for Speaker Output */}
      <audio
        ref={audioRef}
        autoPlay
        playsInline
        style={{ display: "none" }}
      />

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-3 right-3 xs:bottom-4 xs:right-4 sm:bottom-6 sm:right-6 w-10 xs:w-12 sm:w-14 h-10 xs:h-12 sm:h-14 bg-gold-400 text-black rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={!isOpen ? { y: [0, -8, 0] } : {}}
        transition={!isOpen ? { duration: 1.5, repeat: Infinity, repeatDelay: 3 } : {}}
      >
        {isOpen ? (
          <X className="w-5 xs:w-5 sm:w-6 h-5 xs:h-5 sm:h-6" />
        ) : (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <MessageCircle className="w-5 xs:w-5 sm:w-6 h-5 xs:h-5 sm:h-6" />
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-14 xs:bottom-16 sm:bottom-24 right-2 left-2 xs:left-3 xs:right-3 sm:left-auto sm:right-6 w-auto sm:w-full sm:max-w-sm h-[420px] xs:h-[480px] sm:h-[600px] bg-dark-100 border border-gold-400/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gold-400/10 to-dark-200 border-b border-gold-400/20 p-2 xs:p-3 sm:p-4">
              <div className="flex justify-between items-center mb-1 xs:mb-2">
                <h3 className="text-xs xs:text-sm sm:text-lg font-serif font-bold text-gold-400">NOIR AI</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gold-400/10 rounded transition-colors"
                >
                  <X className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5" />
                </button>
              </div>
              <p className="text-[10px] xs:text-xs sm:text-sm text-white/60">Chat, call, voice</p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-2 xs:p-3 sm:p-4 space-y-2 xs:space-y-3 sm:space-y-4 bg-dark-100/50">
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
                    className={`max-w-xs px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-3 rounded-lg text-[10px] xs:text-xs sm:text-sm ${
                      msg.type === 'user'
                        ? 'bg-gold-400 text-black rounded-br-none'
                        : msg.type === 'system'
                        ? 'bg-dark-200 text-gold-400 italic'
                        : 'bg-dark-200 text-white border border-gold-400/20 rounded-bl-none'
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                    <span className={`text-[8px] xs:text-[9px] mt-0.5 xs:mt-1 block ${
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
                      className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-gold-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-gold-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-gold-400 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gold-400/20 p-1.5 xs:p-2 sm:p-3 bg-dark-200/50">
              {/* Voice Connection Status */}
              {voiceConnectionStatus !== "idle" && (
                <div className="mb-2 p-1.5 xs:p-2 rounded bg-dark-100 border border-gold-400/20 text-[10px] xs:text-xs text-white/70">
                  {voiceConnectionStatus === "connecting" && "⏳ Connecting to voice service..."}
                  {voiceConnectionStatus === "connected" && "✅ Voice connected"}
                  {voiceConnectionStatus === "failed" && "❌ Voice unavailable"}
                </div>
              )}
              
              <div className="flex gap-1 xs:gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVoiceInput}
                  className={`p-1 xs:p-1.5 sm:p-2 rounded-lg transition-colors ${
                    isVoiceEnabled
                      ? 'bg-gold-400 text-black'
                      : 'bg-dark-100 border border-gold-400/30 text-white hover:border-gold-400'
                  }`}
                  title="Voice Input"
                >
                  <Mic className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isCallActive ? handleEndCall : handleStartCall}
                  disabled={useTextChat}
                  className={`p-1 xs:p-1.5 sm:p-2 rounded-lg transition-colors ${
                    isCallActive
                      ? 'bg-gold-400 text-black'
                      : voiceConnectionStatus === "failed"
                      ? "bg-red-600/50 border border-red-400/50 text-white"
                      : 'bg-dark-100 border border-gold-400/30 text-white hover:border-gold-400'
                  }`}
                  title={isCallActive ? "End Call" : "Start Voice Call"}
                >
                  <Phone className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5" />
                </motion.button>

                {/* Voice Activity Indicator */}
                <AnimatePresence>
                  {isCallActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1 px-2 py-1.5 bg-dark-200 border border-gold-400/40 rounded-lg"
                    >
                      {/* Animated voice bars */}
                      <div className="flex items-center gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              height: voiceActivityDetected
                                ? [12, 20 + (volumeLevel / 100) * 20, 12][i % 3]
                                : 8,
                              opacity: voiceActivityDetected ? 1 : 0.5,
                            }}
                            transition={{
                              duration: 0.3,
                              delay: i * 0.05,
                              repeat: voiceActivityDetected ? Infinity : 0,
                              repeatType: "reverse",
                            }}
                            className={`w-1 rounded-full ${
                              voiceActivityDetected
                                ? "bg-gradient-to-t from-gold-400 to-gold-300"
                                : "bg-gold-400/40"
                            }`}
                          />
                        ))}
                      </div>
                      {/* Status text */}
                      <span className="text-[10px] xs:text-xs font-semibold text-gold-400 whitespace-nowrap ml-1">
                        {voiceActivityDetected ? "🎤 Speaking" : "📡 Listening"}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {useTextChat && (
                  <div className="text-[10px] xs:text-xs text-amber-400 py-1 px-2 bg-amber-400/10 rounded border border-amber-400/30">
                    💬 Text Mode
                  </div>
                )}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="border-t border-gold-400/20 p-1.5 xs:p-2 sm:p-3 bg-dark-100">
              <div className="flex gap-1 xs:gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message..."
                  className="flex-1 bg-dark-200 border border-gold-400/20 rounded-lg px-2 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 text-[10px] xs:text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-400 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-gold-400 text-black rounded-lg px-2 xs:px-2.5 sm:px-4 py-1 xs:py-1.5 sm:py-2 font-semibold hover:bg-gold-500 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <Send className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
        }
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Phone, Mic } from "lucide-react";
// import { encryptPayload } from "../utils/encryption";
import { logger } from "../utils/logger";
import ReservationReceipt from "./ReservationReceipt";

// ==================== CONFIGURATION ====================
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

logger.log("🔧 HTTP Configuration (IP-based session isolation)");
logger.log("📡 Backend URL:", BACKEND_URL);
logger.log("🌐 Session tracking: IP-based (no WebSocket)");

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
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState("connected"); // HTTP is always ready
  const [sessionInfo, setSessionInfo] = useState(null); // { sessionId, messageCount }
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);

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
  const dograhCallRef = useRef(null);
  const audioRef = useRef(null);

  // ⚡ CHECK BACKEND HEALTH ON APP LOAD
  useEffect(() => {
    logger.log("⚡ [Init] Checking backend health...");
    const checkHealth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL.replace('/api', '')}/health`);
        if (response.ok) {
          const data = await response.json();
          logger.log("✅ Backend healthy:", data);
          setConnectionStatus("connected");
          setSessionInfo({ sessionId: data.userIP, messageCount: 0 });
          addMessage("system", `✅ Session IP: ${data.userIP}`);
        }
      } catch (error) {
        logger.error("❌ Backend health check failed:", error);
        setConnectionStatus("disconnected");
      }
    };
    
    checkHealth();
  }, []);

  // ---- Initialize VAPI Voice Agent ----
  useEffect(() => {
    const initializeVAPIAgent = async () => {
      try {
        logger.log("🎤 Initializing VAPI voice agent...");
        
        const vapiKey = import.meta.env.VITE_VAPI_API_KEY;
        if (!vapiKey) {
          logger.warn("⚠️ VAPI_API_KEY not configured in .env");
          return;
        }

        // Try to import from npm package first
        try {
          logger.log("📦 Importing VAPI from npm package...");
          const { default: Vapi } = await import('@vapi-ai/web');
          
          logger.log("🚀 Creating VAPI instance from npm...");
          window.vapiInstance = new Vapi(vapiKey);
          logger.log("✅ VAPI instance created from npm package");
          
          setupVAPIListeners();
          setIsVoiceEnabled(true);
          logger.log("✅ VAPI voice agent ready");
          return;
        } catch (npmError) {
          logger.warn("⚠️ npm import failed:", npmError.message);
          logger.log("📚 Falling back to CDN loader...");
        }

        // Fallback to CDN loader script
        if (!window.loadVapiSDK) {
          logger.log("📚 Loading VAPI SDK loader from CDN...");
          const loaderScript = document.createElement("script");
          loaderScript.src = "/vapi-loader.js";
          loaderScript.async = true;
          
          loaderScript.onload = () => {
            logger.log("✅ VAPI loader script loaded");
            initializeVapiFromLoader();
          };
          
          loaderScript.onerror = () => {
            logger.error("❌ Failed to load VAPI loader");
            addMessage("system", "⚠️ Voice feature unavailable - SDK loading failed");
          };
          
          document.head.appendChild(loaderScript);
        } else {
          initializeVapiFromLoader();
        }
      } catch (error) {
        logger.error("❌ VAPI initialization error:", error.message);
        addMessage("system", `⚠️ Voice feature unavailable: ${error.message}`);
      }
    };

    const initializeVapiFromLoader = async () => {
      try {
        const vapiKey = import.meta.env.VITE_VAPI_API_KEY;
        logger.log("🚀 Creating VAPI instance from CDN...");
        window.vapiInstance = await window.initializeVapi(vapiKey);
        
        logger.log("✅ VAPI instance created with key:", vapiKey.substring(0, 8) + "...");
        setupVAPIListeners();
        setIsVoiceEnabled(true);
        logger.log("✅ VAPI voice agent ready");
      } catch (error) {
        logger.error("❌ Failed to create VAPI instance from CDN:", error.message);
        addMessage("system", `⚠️ Voice not available: ${error.message}`);
      }
    };

    const setupVAPIListeners = () => {
      if (!window.vapiInstance) return;

      window.vapiInstance.on("call-start", () => {
        logger.log("📞 Call started");
        setIsCallActive(true);
        setVoiceConnectionStatus("connected");
      });

      window.vapiInstance.on("call-end", ({ reason }) => {
        logger.log("📴 Call ended - Reason:", reason || "unknown");
        setIsCallActive(false);
        setVoiceConnectionStatus("idle");
        
        // Log specific end reasons for debugging
        if (reason === "silence-timed-out") {
          logger.warn("⚠️ Call ended due to silence - check mic and audio output");
        }
      });

      window.vapiInstance.on("speech-start", () => {
        logger.log("🔊 Riley speaking");
      });

      window.vapiInstance.on("speech-end", () => {
        logger.log("🤐 Riley finished");
      });

      window.vapiInstance.on("message", (message) => {
        if (message.type === 'transcript') {
          logger.log(`💬 ${message.role}: ${message.transcript}`);
        }
      });

      window.vapiInstance.on("audio", (audioData) => {
        logger.log("🎵 Audio received from assistant");
      });

      window.vapiInstance.on("error", (error) => {
        logger.error("❌ VAPI error:", error);
        setVoiceConnectionStatus("failed");
      });
    };

    initializeVAPIAgent();
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
      logger.warn("⚠️ VAPI credentials not fully configured. Voice calls may not work.");
    }
  }, []);

  // ---- Start Voice Call with VAPI ----
  const makeVoiceCall = async () => {
    try {
      logger.log("📞 Initiating VAPI voice call...");

      // STEP 1: Request microphone permissions
      logger.log("🎙️ Requesting microphone permission...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream - we just needed permission granted
        stream.getTracks().forEach(track => track.stop());
        logger.log("✅ Microphone permission granted");
      } catch (error) {
        throw new Error(`Microphone access denied: ${error.message}`);
      }

      // STEP 2: Resume AudioContext (CRITICAL for browser audio policy)
      logger.log("🔊 Resuming AudioContext...");
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        if (audioContext.state === "suspended") {
          await audioContext.resume();
          logger.log("✅ AudioContext resumed from suspended state");
        } else {
          logger.log("✅ AudioContext state:", audioContext.state);
        }
      }

      // STEP 3: Create/verify VAPI instance
      if (!window.vapiInstance) {
        logger.warn("⚠️ VAPI instance not ready, attempting to create...");
        
        const vapiKey = import.meta.env.VITE_VAPI_API_KEY;
        
        if (!vapiKey) {
          throw new Error("VAPI_API_KEY not configured in .env");
        }

        // Try npm import first
        try {
          logger.log("📦 Importing VAPI from npm...");
          const { default: Vapi } = await import('@vapi-ai/web');
          window.vapiInstance = new Vapi(vapiKey);
          logger.log("✅ VAPI instance created from npm");
        } catch (npmErr) {
          logger.warn("⚠️ npm import failed, checking for CDN-loaded SDK...");
          
          // Check if Vapi class is available from CDN
          const VapiClass = window.Vapi || window.default;
          if (!VapiClass) {
            throw new Error("VAPI SDK not loaded. Please refresh the page.");
          }

          window.vapiInstance = new VapiClass(vapiKey);
          logger.log("✅ VAPI instance created from CDN");
        }

        // STEP 4: Setup audio stream attachment for guaranteed playback
        logger.log("🔗 Setting up audio stream attachment...");
        window.vapiInstance.on("audio", (audioData) => {
          logger.log("🎵 Received audio from Vapi");
          
          try {
            // Create audio element if it doesn't exist
            if (!window.vapiAudioElement) {
              window.vapiAudioElement = document.createElement("audio");
              window.vapiAudioElement.id = "vapi-audio-output";
              window.vapiAudioElement.autoplay = true;
              window.vapiAudioElement.style.display = "none";
              document.body.appendChild(window.vapiAudioElement);
              logger.log("✅ Audio element created and attached to DOM");
            }

            // Attach audio stream
            if (audioData && audioData.rawAudio) {
              window.vapiAudioElement.srcObject = audioData.rawAudio;
              logger.log("✅ Audio stream attached to playback element");
            }
          } catch (error) {
            logger.error("❌ Error attaching audio:", error.message);
          }
        });
      }

      setVoiceConnectionStatus("connecting");
      addMessage("system", "🎤 Connecting to Riley...");

      const vapiAssistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
      if (!vapiAssistantId) {
        throw new Error("VAPI_ASSISTANT_ID not configured");
      }

      // STEP 5: Start the call with assistant ID
      logger.log("📞 Starting call with assistant:", vapiAssistantId);
      await window.vapiInstance.start(vapiAssistantId);

      setIsCallActive(true);
      setVoiceConnectionStatus("connected");
      addMessage("bot", "🎤 Connected to Riley! You can now speak about reservations, menu questions, or dining preferences. Riley is ready to help!");
      
      logger.log("✅ VAPI voice call initiated successfully");

      return { success: true };

    } catch (error) {
      logger.error("❌ Voice call failed:", error.message);
      setVoiceConnectionStatus("failed");
      addMessage("system", `❌ Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // Handle ending voice communication
  const endVAPICall = async () => {
    try {
      if (!window.vapiInstance) {
        logger.warn("⚠️ VAPI instance not available");
        return;
      }

      logger.log("🔴 Ending VAPI voice call");
      await window.vapiInstance.stop();
      
      setIsCallActive(false);
      setVoiceConnectionStatus("idle");
      addMessage("bot", "✅ Voice communication ended. Thank you for using Riley! Feel free to chat or book another call anytime.");
      
      logger.log("✅ VAPI call ended successfully");

    } catch (error) {
      logger.error("❌ Error ending voice session:", error.message);
      addMessage("system", `⚠️ Error ending call: ${error.message}`);
    }
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

  // ==================== IN-APP VOICE COMMUNICATION ====================
  const handleStartCall = async () => {
    if (!isCallActive) {
      try {
        logger.log("🎤 🎤 🎤 STARTING IN-APP VOICE COMMUNICATION 🎤 🎤 🎤");
        logger.log("💡 Information:");
        logger.log("  1️⃣ Your browser will request microphone access");
        logger.log("  2️⃣ Speak freely with the AI agent");
        logger.log("  3️⃣ Agent will understand and respond");
        logger.log("  4️⃣ Click Hang Up to end conversation");

        setIsLoading(true);
        setVoiceConnectionStatus("connecting");
        addMessage("system", "⏳ Preparing voice communication...");

        // Start the voice communication
        const result = await makeVoiceCall();

        if (!result.success) {
          throw new Error(result.error || "Failed to start voice communication");
        }

        callSessionRef.current.startedAt = new Date();
        callSessionRef.current.transcript = [];

        setIsCallActive(true);
        setIsLoading(false);
        setVoiceConnectionStatus("connected");
        setRetryCount(0);

        logger.log("✅ ✅ ✅ VOICE COMMUNICATION READY ✅ ✅ ✅");
        logger.log("🎤 You can now speak with the AI agent!");

      } catch (error) {
        logger.error("❌ Voice communication failed:", error.message);
        setIsLoading(false);
        setVoiceConnectionStatus("failed");
        setRetryCount(retryCount + 1);

        if (retryCount < 3) {
          addMessage("system", `❌ ${error.message} (Attempt ${retryCount + 1}/3)`);
          logger.log(`🔄 Retry available. Attempt ${retryCount + 1} of 3`);
        } else {
          addMessage("system", `❌ Voice communication failed after ${retryCount} attempts. Please try again.`);
          logger.error(`❌ Max retries (${retryCount}) exceeded`);
        }
      }
    } else {
      // End the voice communication if already active
      try {
        setIsLoading(true);
        await endVAPICall();
        setIsLoading(false);
      } catch (error) {
        logger.error("❌ Error ending communication:", error.message);
        setIsLoading(false);
      }
    }
  };

  // ==================== END CALL ====================
  const handleEndCall = async () => {
    if (isCallActive) {
      try {
        logger.log("📴 📴 📴 ENDING VAPI CALL 📴 📴 📴");

        // End the VAPI call
        await endVAPICall();

        setIsCallActive(false);
        setVoiceActivityDetected(false);
        setVolumeLevel(0);
        setVoiceConnectionStatus("idle");

        logger.log("✅ VAPI CALL DISCONNECTED");
        addMessage("system", "✅ Call ended successfully");

        callSessionRef.current.endedAt = new Date();
      } catch (error) {
        logger.error("❌ Error ending call:", error.message);
        setIsCallActive(false);
        addMessage("system", "❌ Error ending call");
      }
    }
  };

  // ==================== RESERVATION HANDLING ====================
  /**
   * Extract reservation details from AI response
   */
  const extractReservationDetails = (message, userMessage) => {
    // Try to extract date, time, and guest count from both messages
    const dateMatch = userMessage.match(/(\w+ \d{1,2}(?:st|nd|rd|th)?)/i) || message.match(/(\w+ \d{1,2}(?:st|nd|rd|th)?)/i);
    const timeMatch = userMessage.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/) || message.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/);
    const guestMatch = userMessage.match(/(\d+)\s*(?:guests?|people|persons)/) || message.match(/(\d+)\s*(?:guests?|people|persons)/);

    if (dateMatch && timeMatch && guestMatch) {
      // Parse date (e.g., "February 5th" -> "2026-02-05")
      const dateStr = dateMatch[1];
      const monthMap = {
        january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
        july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
      };
      const [monthName, day] = dateStr.match(/(\w+)\s+(\d+)/i).slice(1);
      const monthNum = monthMap[monthName.toLowerCase()];
      const year = new Date().getFullYear();
      const date = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Parse time
      const hour = String(timeMatch[1]).padStart(2, '0');
      const minute = timeMatch[2];
      const period = (timeMatch[3] || 'PM').toUpperCase();
      let hourNum = parseInt(hour);
      if (period === 'PM' && hourNum !== 12) hourNum += 12;
      if (period === 'AM' && hourNum === 12) hourNum = 0;
      const time = `${String(hourNum).padStart(2, '0')}:${minute}`;

      // Parse guest count
      const guests = parseInt(guestMatch[1]);

      return { date, time, numGuests: guests };
    }

    return null;
  };

  /**
   * Create reservation after checking availability
   */
  const createReservation = async (details, customerName) => {
    try {
      logger.log("📅 Creating reservation:", details);
      setIsProcessing(true);

      // First check availability
      const availResponse = await fetch(`${BACKEND_URL}/booking/check-availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numGuests: details.numGuests,
          date: details.date,
          time: details.time
        })
      });

      const availData = await availResponse.json();

      if (!availData.available) {
        addMessage("bot", `❌ Sorry, we don't have availability for ${details.numGuests} guest(s) on ${details.date} at ${details.time}. Would you like to try a different date or time?`);
        setIsProcessing(false);
        return;
      }

      addMessage("system", `✅ Availability confirmed! Processing your reservation...`);

      // Create reservation
      const bookResponse = await fetch(`${BACKEND_URL}/booking/create-reservation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName || "Guest",
          numGuests: details.numGuests,
          date: details.date,
          time: details.time,
          email: "",
          phone: ""
        })
      });

      const bookData = await bookResponse.json();

      if (bookData.success) {
        logger.log("✅ Reservation created:", bookData.reservation);
        
        // Set reservation and show modal
        setCurrentReservation(bookData.reservation);
        setShowReservationModal(true);

        addMessage("bot", `✅ **Reservation Confirmed!**\n\nReservation ID: ${bookData.reservation.id}\nTable ${bookData.reservation.tableId} (${bookData.reservation.tableLocation})\n\nPlease review the receipt and complete payment.`);
      } else {
        addMessage("bot", `❌ Failed to create reservation: ${bookData.error}`);
      }
    } catch (error) {
      logger.error("❌ Reservation error:", error);
      addMessage("system", `❌ Error creating reservation: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };


  // ==================== TEXT CHAT MESSAGE HANDLING ====================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = input;
    addMessage("user", userMessage);
    setInput("");
    setIsProcessing(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.type !== 'system')
        .map(msg => ({
          type: msg.type,
          text: msg.text
        }));

      logger.log("💬 Sending message via HTTP:", userMessage.substring(0, 50) + "...");

      // Send to backend HTTP endpoint (IP-based session isolation)
      const response = await fetch(`${BACKEND_URL}/openai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.message) {
        logger.log("✅ Response received:", data.message.substring(0, 50) + "...");
        logger.log("🌐 Session ID:", data.sessionId);
        addMessage("bot", data.message);
        
        // Update session info
        if (data.sessionId && data.messageCount !== undefined) {
          setSessionInfo({ 
            sessionId: data.sessionId, 
            messageCount: data.messageCount 
          });
        }

        // Check if this is a reservation confirmation message
        if (data.message.includes("confirm") && (data.message.includes("availability") || data.message.includes("hold"))) {
          // Extract reservation details from the conversation
          const reservationDetails = extractReservationDetails(data.message, userMessage);
          
          if (reservationDetails) {
            logger.log("📅 Booking details extracted:", reservationDetails);
            // Wait a moment, then create the reservation
            setTimeout(() => {
              createReservation(reservationDetails, "Guest");
            }, 1500);
          }
        }
      } else {
        throw new Error(data.error || "Failed to get response");
      }

    } catch (error) {
      logger.error("❌ Chat error:", error.message);
      addMessage("system", `❌ Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
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

  // ---- Auto scroll chat ----
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
              {/* Session & Connection Status */}
              <div className="mb-2 space-y-1">
                {/* Connection Status */}
                <div className="p-1.5 xs:p-2 rounded bg-dark-100 border border-gold-400/20 text-[10px] xs:text-xs text-white/70 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' :
                    connectionStatus === 'connecting' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></span>
                  {connectionStatus === 'connected' && "✅ Connected"}
                  {connectionStatus === 'connecting' && "⏳ Connecting..."}
                  {connectionStatus === 'disconnected' && "🔌 Disconnected"}
                </div>

                {/* Session Info */}
                {/* {sessionInfo && (
                  <div className="p-1.5 xs:p-2 rounded bg-dark-100 border border-blue-400/20 text-[9px] xs:text-[10px] text-blue-300 font-mono">
                    <div>🔐 Session: {sessionInfo.sessionId.substring(0, 8)}...</div>
                    <div>📊 Messages: {sessionInfo.messageCount}</div>
                  </div>
                )} */}
              </div>

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
                  id="call"
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
                  disabled={!input.trim() || isLoading || isProcessing}
                  className="bg-gold-400 text-black rounded-lg px-2 xs:px-2.5 sm:px-4 py-1 xs:py-1.5 sm:py-2 font-semibold hover:bg-gold-500 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4"
                    >
                      <Send className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4" />
                    </motion.div>
                  ) : (
                    <Send className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4" />
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reservation Receipt & Payment Modal */}
      <AnimatePresence>
        {showReservationModal && currentReservation && (
          <ReservationReceipt
            reservation={currentReservation}
            onClose={() => {
              setShowReservationModal(false);
              addMessage("system", "💬 Is there anything else I can help you with?");
            }}
            onPaymentComplete={(paymentInfo) => {
              setShowReservationModal(false);
              addMessage("system", `✅ Payment processed! (${paymentInfo.method})`);
              addMessage("bot", `🎉 Thank you for your reservation and payment! We look forward to seeing you at NOIR. Your reservation ID is ${currentReservation.id}.`);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};  

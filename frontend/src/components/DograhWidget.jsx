import React, { useState, useEffect } from "react";
import { Phone, PhoneOff } from "lucide-react";
import { logger } from "../utils/logger";

/**
 * DograhWidget Component
 * 
 * Integrates Dograh.ai Active Agents voice widget
 * Provides inline voice call interface with automatic widget loading
 */
export default function DograhWidget() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState(null);

  // ==================== INITIALIZE DOGRAH WIDGET WITH SPEAKER OUTPUT ====================
  useEffect(() => {
    const initializeDograhWidget = () => {
      try {
        logger.log("🎤 Initializing Dograh.ai Widget with speaker output...");

        // Check if widget token is configured
        const widgetToken = import.meta.env.VITE_DOGRAH_WIDGET_TOKEN;
        if (!widgetToken) {
          throw new Error("VITE_DOGRAH_WIDGET_TOKEN not configured in .env");
        }

        logger.log("✅ Widget token loaded from environment");
        logger.log("🔊 Configuring speaker output for agent audio...");

        // Load Dograh widget script
        if (!document.getElementById("dograh-widget-script")) {
          const script = document.createElement("script");
          script.id = "dograh-widget-script";
          script.src = `https://app.dograh.com/embed/dograh-widget.js?token=${widgetToken}&environment=production&apiEndpoint=https://api.dograh.com&audioOutput=enabled&speakerVolume=100`;
          script.async = true;

          script.onload = () => {
            logger.log("✅ Dograh.ai widget script loaded");
            
            // Wait for widget to initialize
            const checkWidget = () => {
              if (window.DograhWidget) {
                logger.log("✅ Dograh.ai widget available");
                
                // Configure audio output
                try {
                  if (window.DograhWidget.setAudioConfig) {
                    window.DograhWidget.setAudioConfig({
                      outputVolume: 100,
                      inputVolume: 100,
                      enableSpeaker: true,
                      enableMicrophone: true,
                      audioProcessing: true
                    });
                    logger.log("✅ Speaker output configured at 100% volume");
                  }
                  
                  if (window.DograhWidget.setAudioOutput) {
                    window.DograhWidget.setAudioOutput(true);
                    logger.log("✅ Speaker output enabled");
                  }
                } catch (audioError) {
                  logger.warn("⚠️ Audio config warning:", audioError.message);
                }
                
                setWidgetLoaded(true);

                // Setup event listeners
                try {
                  window.DograhWidget.onCallStart(() => {
                    logger.log("📞 Dograh call started with speaker enabled");
                    setIsCallActive(true);
                  });

                  window.DograhWidget.onCallEnd(() => {
                    logger.log("📴 Dograh call ended");
                    setIsCallActive(false);
                  });

                  window.DograhWidget.onError((error) => {
                    logger.error("❌ Dograh widget error:", error);
                    setWidgetError(error?.message || "Widget error");
                  });

                  window.DograhWidget.onAudioReceived?.(() => {
                    logger.log("🔊 Agent audio received and playing through speakers");
                  });

                  logger.log("✅ Dograh widget event listeners registered");
                } catch (error) {
                  logger.error("⚠️ Error setting up event listeners:", error);
                }
              } else {
                // Retry if widget not ready
                setTimeout(checkWidget, 100);
              }
            };
            checkWidget();
          };

          script.onerror = () => {
            logger.error("❌ Failed to load Dograh widget script");
            setWidgetError("Failed to load widget");
          };

          document.body.appendChild(script);
        } else {
          // Script already loaded
          setWidgetLoaded(true);
        }
      } catch (error) {
        logger.error("❌ Widget initialization error:", error.message);
        setWidgetError(error.message);
      }
    };

    initializeDograhWidget();
  }, []);

  // ==================== HANDLE CALL START WITH SPEAKER OUTPUT ====================
  const handleStartCall = () => {
    try {
      if (!window.DograhWidget) {
        throw new Error("Dograh widget not loaded");
      }

      logger.log("📞 Starting Dograh call with speaker output...");
      
      // Enable speaker output
      if (window.DograhWidget.setAudioOutput) {
        window.DograhWidget.setAudioOutput(true);
        logger.log("🔊 Speaker output enabled");
      }
      
      if (window.DograhWidget.setVolume) {
        window.DograhWidget.setVolume(100);
        logger.log("🔊 Volume set to 100%");
      }

      // Start the call
      window.DograhWidget.start();
      logger.log("✅ Voice call started with speakers enabled");
    } catch (error) {
      logger.error("❌ Error starting call:", error.message);
      setWidgetError(error.message);
    }
  };

  // ==================== HANDLE CALL END ====================
  const handleEndCall = () => {
    try {
      if (!window.DograhWidget) {
        throw new Error("Dograh widget not loaded");
      }

      logger.log("🔴 Ending Dograh call...");
      window.DograhWidget.end();
    } catch (error) {
      logger.error("❌ Error ending call:", error.message);
      setWidgetError(error.message);
    }
  };

  return (
    <div className="dograh-widget-container my-8">
      {/* Widget Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">
          🎤 Talk to Our Agent
        </h2>
        <p className="text-gray-300">
          Connect with our AI agent for immediate assistance
        </p>
      </div>

      {/* Error Display */}
      {widgetError && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
          <p className="font-semibold">⚠️ Widget Error</p>
          <p className="text-sm">{widgetError}</p>
        </div>
      )}

      {/* Loading State */}
      {!widgetLoaded && (
        <div className="bg-blue-900/30 border border-blue-700 text-blue-300 px-4 py-3 rounded mb-4">
          <p className="font-semibold">⏳ Loading Dograh Widget...</p>
        </div>
      )}

      {/* Dograh Inline Widget Container */}
      <div
        id="dograh-inline-container"
        className="min-h-[400px] mb-6 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden"
      >
        {/* Widget renders here automatically */}
        {!widgetLoaded && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin mb-4">
                <Phone className="w-8 h-8 text-blue-400 mx-auto" />
              </div>
              <p className="text-gray-400">Initializing voice widget...</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleStartCall}
          disabled={!widgetLoaded || isCallActive}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            !widgetLoaded || isCallActive
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
          }`}
        >
          <Phone className="w-5 h-5" />
          Start Call
        </button>

        <button
          onClick={handleEndCall}
          disabled={!isCallActive}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            !isCallActive
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white hover:shadow-lg"
          }`}
        >
          <PhoneOff className="w-5 h-5" />
          End Call
        </button>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 text-sm text-gray-400">
        {widgetLoaded ? (
          <>
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Widget Ready
            {isCallActive && (
              <span className="ml-4 text-green-400">
                📞 Call Active
              </span>
            )}
          </>
        ) : (
          <>
            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
            Loading...
          </>
        )}
      </div>
    </div>
  );
}

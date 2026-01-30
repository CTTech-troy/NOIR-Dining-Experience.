import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic } from 'lucide-react';
import { logger } from '../utils/logger';

/**
 * VapiVoiceWidget - Complete VAPI Web Interface Implementation
 * Handles voice calls with transcript display and real-time status
 */
const VapiVoiceWidget = ({ apiKey, assistantId, config = {} }) => {
  const [vapi, setVapi] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);

  // Initialize VAPI on component mount
  useEffect(() => {
    const initializeVAPI = async () => {
      try {
        logger.log("🎤 Initializing VAPI Web Interface...");
        
        // Dynamically import VAPI
        const { default: Vapi } = await import('@vapi-ai/web');
        
        if (!apiKey || !assistantId) {
          throw new Error("Missing VAPI credentials (apiKey or assistantId)");
        }

        const vapiInstance = new Vapi(apiKey);
        logger.log("✅ VAPI instance created");

        // Call Start Event
        vapiInstance.on('call-start', () => {
          logger.log("📞 Call started");
          setIsConnected(true);
          setError(null);
          setTranscript([]);
        });

        // Call End Event
        vapiInstance.on('call-end', () => {
          logger.log("📴 Call ended");
          setIsConnected(false);
          setIsSpeaking(false);
        });

        // Speech Start - Assistant is speaking
        vapiInstance.on('speech-start', () => {
          logger.log("🔊 Assistant started speaking");
          setIsSpeaking(true);
        });

        // Speech End - Assistant stopped speaking
        vapiInstance.on('speech-end', () => {
          logger.log("🤐 Assistant stopped speaking");
          setIsSpeaking(false);
        });

        // Message Event - Transcript updates
        vapiInstance.on('message', (message) => {
          logger.log("💬 Message received:", message.type);
          
          if (message.type === 'transcript') {
            setTranscript(prev => [
              ...prev,
              {
                role: message.role,
                text: message.transcript
              }
            ]);
          }
        });

        // Error Event
        vapiInstance.on('error', (error) => {
          logger.error("❌ VAPI Error:", error);
          setError(error.message || "An error occurred");
        });

        setVapi(vapiInstance);
        logger.log("✅ VAPI Voice Widget initialized");

        return () => {
          vapiInstance?.stop();
        };
      } catch (err) {
        logger.error("❌ Failed to initialize VAPI:", err.message);
        setError(err.message);
      }
    };

    initializeVAPI();
  }, [apiKey, assistantId]);

  // Start Voice Call
  const startCall = async () => {
    try {
      if (!vapi) {
        throw new Error("VAPI not initialized");
      }
      
      setIsLoading(true);
      logger.log("📞 Starting VAPI call with assistant:", assistantId);
      
      await vapi.start(assistantId);
      
      setIsLoading(false);
      logger.log("✅ VAPI call started successfully");
    } catch (err) {
      logger.error("❌ Failed to start call:", err.message);
      setError(err.message);
      setIsLoading(false);
    }
  };

  // End Voice Call
  const endCall = async () => {
    try {
      if (!vapi) {
        throw new Error("VAPI not initialized");
      }
      
      logger.log("📴 Stopping VAPI call");
      await vapi.stop();
      
      logger.log("✅ VAPI call ended successfully");
    } catch (err) {
      logger.error("❌ Failed to end call:", err.message);
      setError(err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif'
    }}>
      {!isConnected ? (
        // Call Start Button
        <button
          onClick={startCall}
          disabled={isLoading}
          style={{
            background: isLoading ? '#888' : '#12A594',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(18, 165, 148, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(18, 165, 148, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(18, 165, 148, 0.3)';
          }}
        >
          <Mic size={20} />
          {isLoading ? 'Connecting...' : '🎤 Talk to Riley'}
        </button>
      ) : (
        // Active Call Widget
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          width: '380px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid #e1e5e9'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: isSpeaking ? '#ff4444' : '#12A594',
                  animation: isSpeaking ? 'pulse 1s infinite' : 'none'
                }}
              ></div>
              <span style={{ fontWeight: 'bold', color: '#333' }}>
                {isSpeaking ? '🔊 Riley is speaking...' : '🎤 Listening...'}
              </span>
            </div>
            <button
              onClick={endCall}
              style={{
                background: '#ff4444',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#cc0000';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#ff4444';
              }}
            >
              <PhoneOff size={14} />
              End Call
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#ffe6e6',
              color: '#cc0000',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              marginBottom: '12px',
              border: '1px solid #ffcccc'
            }}>
              ❌ {error}
            </div>
          )}

          {/* Transcript Display */}
          <div style={{
            maxHeight: '240px',
            overflowY: 'auto',
            marginBottom: '12px',
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e1e5e9'
          }}>
            {transcript.length === 0 ? (
              <p style={{ color: '#999', fontSize: '14px', margin: 0, textAlign: 'center' }}>
                💬 Conversation will appear here...
              </p>
            ) : (
              transcript.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: '12px',
                    textAlign: msg.role === 'user' ? 'right' : 'left'
                  }}
                >
                  <div
                    style={{
                      background: msg.role === 'user' ? '#12A594' : '#333',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      display: 'inline-block',
                      fontSize: '13px',
                      maxWidth: '85%',
                      wordWrap: 'break-word',
                      lineHeight: '1.4'
                    }}
                  >
                    <strong style={{ fontSize: '11px', opacity: 0.8 }}>
                      {msg.role === 'user' ? 'You' : 'Riley'}:
                    </strong>
                    <br />
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Call Status */}
          <div style={{
            fontSize: '12px',
            color: '#666',
            textAlign: 'center',
            paddingTop: '8px',
            borderTop: '1px solid #e1e5e9'
          }}>
            {isSpeaking ? '🔴 Recording in progress...' : '⏸️ Ready to listen'}
          </div>
        </div>
      )}

      {/* Pulse Animation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default VapiVoiceWidget;

# Dograh.ai Active Agents Integration Guide

## Overview

This guide covers the complete integration of **Dograh.ai Active Agents** for voice call capabilities in the restaurantAI application. Dograh.ai replaces VAPI for handling inbound/outbound voice calls.

**Status**: ✅ Integration Complete

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Configuration](#configuration)
5. [API Endpoints](#api-endpoints)
6. [Components](#components)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FloatingChatbot.jsx (Text Chat + Voice Controls)   │   │
│  │  DograhWidget.jsx (Inline Voice Widget)             │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │ HTTP REST
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  dograh.Controller.js (Call Management)              │   │
│  │  dograh.Routes.js (API Endpoints)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │ API
                   ▼
         ┌─────────────────────┐
         │   Dograh.ai API     │
         │  api.dograh.ai/v1   │
         └─────────────────────┘
```

### Call Flow

```
User Initiates Call
        ↓
FloatingChatbot/DograhWidget → POST /api/dograh/initiate-call
        ↓
Backend calls Dograh.ai API
        ↓
Dograh.ai dials phone number
        ↓
Call Connected ↔ Bidirectional Audio
        ↓
Dograh.ai sends transcript callbacks
        ↓
Backend logs transcript
        ↓
POST /api/dograh/end-call
        ↓
Call Ended
```

---

## Backend Setup

### 1. Environment Variables

**File**: `.env`

```env
# Dograh.ai Active Agents Configuration
DOGRAH_API_KEY=mps_sk_nPTcBfsUdMxSqBNN5ErOKyjAHBRCOIki
DOGRAH_PRIVATE_KEY=dgr_79UXyQcdHSt2gd6RBUAOmW_2l1qKEZKc-LIDhTYeNzc
DOGRAH_AGENT_ID=your-dograh-agent-id
DOGRAH_API_URL=https://api.dograh.ai/v1
```

### 2. Backend Files

**dograh.Controller.js** (`backend/src/controller/dograh.Controller.js`)

Core functions:
- `initiateDograhCall()` - Start outbound call
- `handleInboundDograhCall()` - Receive inbound call
- `endDograhCall()` - End call session
- `getCallTranscript()` - Retrieve call details
- `logDograhCall()` - Log call analytics
- `getDograhAgentStatus()` - Check agent status
- `testDograhIntegration()` - Test integration

**dograh.Routes.js** (`backend/src/routers/dograh.Routes.js`)

Endpoints:
- `POST /api/dograh/initiate-call` - Initiate call
- `POST /api/dograh/inbound-call` - Webhook for inbound calls
- `POST /api/dograh/end-call` - End call
- `GET /api/dograh/call/:callId` - Get transcript
- `POST /api/dograh/call-log` - Log call
- `GET /api/dograh/agent-status` - Agent status
- `POST /api/dograh/test` - Test integration
- `GET /api/dograh/health` - Health check

### 3. Register Routes

**index.js**

```javascript
import dograhRoutes from "./src/routers/dograh.Routes.js";

// Register routes
app.use("/api/dograh", dograhRoutes);
```

---

## Frontend Setup

### 1. Environment Variables

**File**: `frontend/.env`

```env
# Dograh.ai Active Agents Configuration
VITE_DOGRAH_API_KEY=mps_sk_nPTcBfsUdMxSqBNN5ErOKyjAHBRCOIki
VITE_DOGRAH_PRIVATE_KEY=dgr_79UXyQcdHSt2gd6RBUAOmW_2l1qKEZKc-LIDhTYeNzc
VITE_DOGRAH_WIDGET_TOKEN=emb_ZuvoxDUYjE9WvaNanI3AGJdioBbKrZnbgOVf8bZC1V8

# Backend Configuration
VITE_BACKEND_URL=http://localhost:5000/api
```

### 2. Frontend Components

**Option 1: FloatingChatbot.jsx** (Integrated with chat)

The floating chatbot now includes Dograh.ai integration:
- Text chat with OpenRouter API
- Dograh.ai voice call button
- Automatic phone number prompt
- Call status tracking
- IP-based session isolation

**Option 2: DograhWidget.jsx** (Standalone widget)

Standalone voice widget component:
- Inline widget container
- Auto-initialization
- Start/End call buttons
- Status indicators
- Error handling

### 3. Usage

**In FloatingChatbot:**

```javascript
// Voice call buttons automatically use Dograh.ai
<button onClick={handleStartCall}>
  📞 Start Voice Call
</button>
```

**In App.jsx:**

```javascript
import DograhWidget from "./components/DograhWidget";

export default function App() {
  return (
    <div>
      <FloatingChatbot />
      {/* Optional: Standalone widget */}
      <DograhWidget />
    </div>
  );
}
```

---

## Configuration

### Dograh.ai Dashboard Setup

1. **Create Agent**
   - Go to [Dograh.ai Console](https://console.dograh.ai)
   - Create a new active agent
   - Configure greeting message
   - Set up phone number routing

2. **Get Credentials**
   ```
   - API Key: mps_sk_nPTcBfsUdMxSqBNN5ErOKyjAHBRCOIki
   - Private Key: dgr_79UXyQcdHSt2gd6RBUAOmW_2l1qKEZKc-LIDhTYeNzc
   - Agent ID: [Your Agent ID]
   - Widget Token: emb_ZuvoxDUYjE9WvaNanI3AGJdioBbKrZnbgOVf8bZC1V8
   ```

3. **Configure Webhook** (Optional)
   - Endpoint: `https://yourdomain.com/api/dograh/inbound-call`
   - Method: POST
   - Events: call-start, call-end, transcription

### Environment Configuration

**Backend (.env)**
```env
DOGRAH_API_KEY=your-api-key
DOGRAH_PRIVATE_KEY=your-private-key
DOGRAH_AGENT_ID=your-agent-id
DOGRAH_API_URL=https://api.dograh.ai/v1
```

**Frontend (.env)**
```env
VITE_DOGRAH_API_KEY=your-api-key
VITE_DOGRAH_PRIVATE_KEY=your-private-key
VITE_DOGRAH_WIDGET_TOKEN=your-widget-token
```

---

## API Endpoints

### 1. Initiate Call

**Request:**
```bash
POST /api/dograh/initiate-call
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "callbackUrl": "https://yourdomain.com/callback",
  "context": {
    "userName": "John Doe",
    "restaurantName": "NOIR",
    "message": "Thank you for choosing NOIR!"
  }
}
```

**Response:**
```json
{
  "success": true,
  "callId": "call_xyz123",
  "phoneNumber": "+1234567890",
  "status": "initiating"
}
```

### 2. Handle Inbound Call (Webhook)

**Request (from Dograh.ai):**
```bash
POST /api/dograh/inbound-call
Content-Type: application/json

{
  "callId": "call_xyz123",
  "phoneNumber": "+1234567890",
  "transcript": [
    {"speaker": "agent", "text": "Hello, thank you for calling NOIR"},
    {"speaker": "user", "text": "Hi, I'd like to make a reservation"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inbound call processed",
  "callId": "call_xyz123"
}
```

### 3. End Call

**Request:**
```bash
POST /api/dograh/end-call
Content-Type: application/json

{
  "callId": "call_xyz123",
  "transcript": [...],
  "duration": 125,
  "recordingUrl": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Dograh.ai call ended successfully",
  "callId": "call_xyz123",
  "summary": {
    "duration": 125,
    "transcriptItems": 8,
    "recording": "available"
  }
}
```

### 4. Get Call Transcript

**Request:**
```bash
GET /api/dograh/call/:callId
```

**Response:**
```json
{
  "success": true,
  "call": {
    "id": "call_xyz123",
    "phoneNumber": "+1234567890",
    "status": "ended",
    "duration": 125,
    "transcript": [...],
    "recordingUrl": "https://..."
  }
}
```

### 5. Agent Status

**Request:**
```bash
GET /api/dograh/agent-status
```

**Response:**
```json
{
  "success": true,
  "agent": {
    "initialized": true,
    "agentId": "agent_xyz",
    "credentialsConfigured": true,
    "activeCalls": 2,
    "version": "1.0.0"
  }
}
```

### 6. Test Integration

**Request:**
```bash
POST /api/dograh/test
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Dograh.ai integration test successful",
  "test": {
    "credentials": "configured",
    "agentId": "agent_xyz",
    "testCallId": "test_call_123",
    "timestamp": "2026-01-29T12:00:00Z"
  }
}
```

---

## Components

### FloatingChatbot.jsx

**Features:**
- Text chat with OpenRouter API
- Dograh.ai voice call integration
- Phone number input prompt
- Call status tracking
- Automatic transcript logging
- IP-based session isolation
- Booking flow integration

**Key Functions:**
```javascript
makeVoiceCall()      // Initiate Dograh call
endDograhCall()      // End active call
handleStartCall()    // Start call with prompts
handleEndCall()      // End call cleanly
```

**Usage:**
```jsx
<FloatingChatbot />
```

### DograhWidget.jsx

**Features:**
- Standalone voice widget
- Auto-initialization
- Inline widget container
- Manual start/end buttons
- Status indicators
- Error handling
- Event listeners

**Props:** None (uses environment variables)

**Usage:**
```jsx
import DograhWidget from "./components/DograhWidget";

export default function App() {
  return <DograhWidget />;
}
```

---

## Testing

### 1. Backend Health Check

```bash
curl http://localhost:5000/api/dograh/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "Dograh.ai Active Agents",
  "timestamp": "2026-01-29T12:00:00Z"
}
```

### 2. Test Integration

```bash
curl -X POST http://localhost:5000/api/dograh/test
```

### 3. Check Agent Status

```bash
curl http://localhost:5000/api/dograh/agent-status
```

### 4. Initiate Test Call

```bash
curl -X POST http://localhost:5000/api/dograh/initiate-call \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "context": {"message": "Test call"}
  }'
```

### 5. Frontend Testing

1. Open browser console (F12)
2. Check for "✅ Dograh.ai agent ready" message
3. Click "📞 Start Voice Call" button
4. Enter phone number when prompted
5. Monitor console for call logs
6. Check `/api/dograh/health` endpoint

---

## Troubleshooting

### Issue: Widget not loading

**Symptoms:**
- Widget doesn't appear
- "Loading..." stays indefinitely

**Solutions:**
1. Check widget token in `.env`
   ```env
   VITE_DOGRAH_WIDGET_TOKEN=emb_ZuvoxDUYjE9WvaNanI3AGJdioBbKrZnbgOVf8bZC1V8
   ```

2. Check browser console for script errors (F12)

3. Verify network request to Dograh CDN:
   ```
   https://app.dograh.com/embed/dograh-widget.js?token=...
   ```

4. Clear browser cache and reload

### Issue: Call initiation fails

**Symptoms:**
- "Call failed" error
- No callback from Dograh.ai

**Solutions:**
1. Verify credentials in `.env`:
   ```
   DOGRAH_API_KEY=mps_sk_nPTcBfsUdMxSqBNN5ErOKyjAHBRCOIki
   DOGRAH_PRIVATE_KEY=dgr_79UXyQcdHSt2gd6RBUAOmW_2l1qKEZKc-LIDhTYeNzc
   ```

2. Test with backend endpoint:
   ```bash
   POST /api/dograh/test
   ```

3. Check backend logs for API errors

4. Verify phone number format: `+1234567890`

5. Ensure Dograh.ai account has active credits

### Issue: No transcript received

**Symptoms:**
- Call completes but no transcript
- Empty transcript array

**Solutions:**
1. Check webhook configuration in Dograh.ai console

2. Verify `POST /api/dograh/inbound-call` endpoint is accessible

3. Check backend logs for webhook failures

4. Ensure call duration > 5 seconds (minimum for transcription)

### Issue: API Key invalid

**Symptoms:**
- 401 Unauthorized errors
- "Invalid credentials"

**Solutions:**
1. Regenerate credentials in Dograh.ai console

2. Update `.env` files:
   - `backend/.env`
   - `frontend/.env`

3. Restart backend server:
   ```bash
   npm run dev
   ```

4. Clear frontend cache and reload

### Issue: High latency / delays

**Symptoms:**
- Slow call initiation
- Delayed transcript delivery

**Solutions:**
1. Check network latency:
   ```bash
   ping api.dograh.ai
   ```

2. Verify backend is running on port 5000

3. Check Dograh.ai API status dashboard

4. Consider using regional endpoints if available

### Issue: Widget conflicts

**Symptoms:**
- Multiple widgets appear
- Widget doesn't respond to clicks

**Solutions:**
1. Ensure only one `<DograhWidget />` component is rendered

2. Remove old VAPI references from HTML

3. Check for script tag conflicts:
   ```javascript
   // Remove any remaining VAPI scripts
   const vapiScripts = document.querySelectorAll('[id*="vapi"]');
   vapiScripts.forEach(s => s.remove());
   ```

4. Use browser DevTools to inspect DOM

---

## Migration from VAPI to Dograh.ai

### What Changed

| Feature | VAPI | Dograh.ai |
|---------|------|-----------|
| **SDK Type** | Browser SDK | Outbound API + Widget |
| **Initialization** | CDN Script | REST API + Widget Token |
| **Call Control** | Browser-based | Server-initiated |
| **Microphone** | Required | Not required (uses phone) |
| **Transcription** | Real-time | Server-logged |
| **Phone Calls** | Browser only | Any phone |
| **Cost** | Pay-per-minute | Pay-per-call |

### Removed Components

- ❌ VAPI SDK script tag
- ❌ `VITE_VAPI_API_KEY` environment variable
- ❌ `VITE_VAPI_ASSISTANT_ID` environment variable
- ❌ `vapiInstanceRef` reference
- ❌ VAPI event handlers

### New Components

- ✅ Dograh.ai Controller
- ✅ Dograh.ai Routes
- ✅ DograhWidget Component
- ✅ Dograh environment variables
- ✅ REST API endpoints

---

## Best Practices

### 1. Error Handling

Always handle API errors:
```javascript
try {
  const response = await fetch("/api/dograh/initiate-call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber: number })
  });
  
  if (!response.ok) {
    throw new Error(`Call failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
} catch (error) {
  logger.error("Call error:", error.message);
}
```

### 2. Logging

Always log important call events:
```javascript
logger.log("📞 Call initiated:", callId);
logger.log("✅ Call connected");
logger.log("📴 Call ended");
logger.log("❌ Call failed:", error);
```

### 3. Session Tracking

Use IP-based session isolation:
```javascript
// Sessions automatically tracked by IP
const userIP = req.userIP;
logger.log(`[${userIP}] Call initiated`);
```

### 4. Transcript Management

Store transcripts for reference:
```javascript
callSession.transcript = transcript;
callSession.duration = duration;
callSession.recordingUrl = recordingUrl;
```

---

## Performance Optimization

### 1. Widget Lazy Loading

Load widget only when needed:
```javascript
const [showWidget, setShowWidget] = useState(false);

return (
  <>
    <button onClick={() => setShowWidget(true)}>
      Show Voice Widget
    </button>
    {showWidget && <DograhWidget />}
  </>
);
```

### 2. Call Caching

Cache call details:
```javascript
const callCache = new Map();
callCache.set(callId, {
  transcript: data.transcript,
  duration: data.duration,
  timestamp: new Date()
});
```

### 3. Batch Logging

Log multiple calls together:
```javascript
const logs = [];
// Collect logs
logs.push({ callId, duration, status });
// Send in batch
fetch("/api/dograh/call-log", { body: JSON.stringify(logs) });
```

---

## Support & Resources

- **Dograh.ai Docs**: https://docs.dograh.ai
- **API Reference**: https://api.dograh.ai/docs
- **Console**: https://console.dograh.ai
- **Support Email**: support@dograh.ai

---

**Last Updated:** January 29, 2026
**Status:** ✅ Production Ready

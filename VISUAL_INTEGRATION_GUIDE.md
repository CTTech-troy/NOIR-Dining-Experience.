# OpenAI Chatbot - Visual Integration Guide

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                               │
│              (FloatingChatbot React Component)                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Input: User types message → Click Send                 │  │
│  │  Output: Bot message displays with response             │  │
│  │  State: isProcessing (loading animation)                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ HTTP POST /api/openai/chat
                              │ {message, conversationHistory}
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    EXPRESS BACKEND                              │
│              (Node.js API Server on Port 5000)                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ POST /api/openai/chat (openai.Routes.js)               │  │
│  │   ↓                                                      │  │
│  │ chatWithAI() (openai.Controller.js)                    │  │
│  │   ├─ Validate request body                            │  │
│  │   ├─ Call generateAIResponse()                        │  │
│  │   └─ Return response                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ generateAIResponse() (openai.Controller.js)            │  │
│  │   ├─ Build system prompt (RESTAURANT_CONTEXT)         │  │
│  │   ├─ Include conversation history                     │  │
│  │   ├─ Add current user message                         │  │
│  │   ├─ Call fetch() to OpenAI API                       │  │
│  │   └─ Parse and return response                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ HTTPS to OpenAI API
                              │ POST /v1/chat/completions
                              │ Bearer {OPENAI_API_KEY}
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    OPENAI API (Cloud)                           │
│              (GPT-4 Language Model Processing)                  │
│                                                                 │
│  Input:                                                         │
│  ├─ System Prompt: "You are NOIR restaurant AI..."            │
│  ├─ Message History: [prev messages]                          │
│  └─ Current Message: "What are your hours?"                   │
│                                                                 │
│  Processing:                                                    │
│  └─ GPT-4 generates response based on context                 │
│                                                                 │
│  Output:                                                        │
│  └─ "We're open 11 AM to 11 PM, closed Mondays."             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ JSON Response with tokens used
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    EXPRESS BACKEND                              │
│                                                                 │
│  Parse OpenAI Response                                          │
│  ├─ Extract message content                                    │
│  ├─ Check for errors                                           │
│  └─ Return JSON to frontend                                    │
│     {                                                           │
│       "success": true,                                          │
│       "message": "We're open 11 AM to 11 PM...",              │
│       "timestamp": "2026-01-29T..."                            │
│     }                                                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ HTTP Response
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    FRONTEND UI                                  │
│                                                                 │
│  ├─ Update messages state                                      │
│  ├─ Add bot message to chat                                    │
│  ├─ Scroll to latest message                                   │
│  ├─ Stop loading animation                                     │
│  └─ Ready for next message                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Message Flow Sequence

```
1. USER TYPES & SENDS
   ┌─────────────┐
   │ "Hi, hours?"│
   └─────────────┘
          │
          ▼
2. FRONTEND PROCESSING
   ├─ Add to local messages (user type)
   ├─ Gather conversation history
   ├─ Show loading spinner
   └─ Send POST to backend
          │
          ▼
3. BACKEND VALIDATION
   ├─ Check message format
   ├─ Verify API key exists
   └─ Proceed or error
          │
          ▼
4. OPENAI REQUEST
   ├─ Build messages array
   ├─ Send to OpenAI API
   ├─ Wait for response (2-5 sec)
   └─ Check for errors
          │
          ▼
5. OPENAI PROCESSING
   ├─ Parse system context
   ├─ Review conversation
   ├─ Generate response
   └─ Return to backend
          │
          ▼
6. BACKEND RESPONSE
   ├─ Parse OpenAI response
   ├─ Log activity
   └─ Return to frontend
          │
          ▼
7. FRONTEND DISPLAY
   ├─ Stop loading spinner
   ├─ Add bot message
   ├─ Auto-scroll to new message
   └─ Ready for next input
```

## 📁 File Organization

```
resturantAI/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   │   ├── openai.Controller.js      ← NEW OpenAI logic
│   │   │   └── vapi.Controller.js        (existing)
│   │   ├── routers/
│   │   │   ├── openai.Routes.js          ← NEW Routes
│   │   │   └── vapi.Routes.js            (existing)
│   │   └── utils/
│   │       ├── logger.js                 ← NEW Logger
│   │       └── encryption.js             (existing)
│   ├── index.js                          ← MODIFIED (add routes)
│   ├── package.json                      (no changes needed)
│   ├── .env                              ← MODIFIED (add API key)
│   └── .env.example                      ← NEW Template
│
├── frontend/
│   ├── src/
│   │   └── components/
│   │       └── FloatingChatbot.jsx       ← MODIFIED (OpenAI calls)
│   └── .env                              (no changes needed)
│
└── Documentation/
    ├── OPENAI_QUICKSTART.md              ← NEW Quick setup
    ├── OPENAI_CHATBOT_SETUP.md           ← NEW Full guide
    ├── OPENAI_INTEGRATION_SUMMARY.md     ← NEW Details
    └── CODE_CHANGES_REFERENCE.md         ← NEW Code reference
```

## 🔑 Environment Variables

### Backend `.env`
```bash
# NEW - Add this
OPENAI_API_KEY=sk-proj-xxxxx...xxxxx

# EXISTING - Keep these
NODE_ENV=development
PORT=5000
VAPI_API_KEY=...
VAPI_ASSISTANT_ID=...
FIREBASE_SERVICE_ACCOUNT=...
ENCRYPTION_KEY=...
ENCRYPTION_IV=...
```

### Frontend `.env`
```bash
# Already configured - No changes needed
VITE_BACKEND_URL=https://noirdining.netlify.app/api
VITE_VAPI_API_KEY=...
VITE_VAPI_ASSISTANT_ID=...
```

## 🌐 API Endpoints

### POST `/api/openai/chat`
```
Request:
  Headers:
    Content-Type: application/json
  Body:
    {
      "message": "What's your specialty?",
      "conversationHistory": [
        {
          "type": "user",
          "text": "Hello"
        },
        {
          "type": "bot",
          "text": "Hi! How can I help?"
        }
      ]
    }

Response:
  {
    "success": true,
    "message": "Our specialty is contemporary French cuisine...",
    "timestamp": "2026-01-29T10:30:00.000Z"
  }
```

### GET `/api/openai/health`
```
Request:
  No body needed

Response:
  {
    "configured": true,
    "apiKey": "✅ Loaded",
    "apiWorking": true,
    "apiStatus": "✅ Connected",
    "timestamp": "2026-01-29T10:30:00.000Z"
  }
```

## 🎮 UI Components

### Chat Button (FloatingChatbot)
```
┌────────────────────────────────┐
│  NOIR AI Chat Window           │X│
├────────────────────────────────┤
│  Chat, call, voice             │
├────────────────────────────────┤
│                                │
│  Bot: Hello! Welcome to NOIR   │
│                                │
│  User: What are your hours?    │
│                                │
│  Bot: We're open 11AM-11PM...  │
│                                │
│                                │
├────────────────────────────────┤
│ [🎤] [📞] [🎤 Speaking] [💬]  │
├────────────────────────────────┤
│ [Message input...]      [Send] │
└────────────────────────────────┘
```

## 🔐 Security Flow

```
User Secrets              Backend Secrets
┌──────────────┐         ┌──────────────────┐
│ API Request  │────────→│ Validate Request │
└──────────────┘         └──────────────────┘
                                │
                                ▼
                         ┌──────────────────┐
                         │ Check API Key    │
                         │ (from .env only) │
                         └──────────────────┘
                                │
                                ▼
                         ┌──────────────────┐
                         │ Call OpenAI API  │
                         │ (Key never seen  │
                         │  by frontend)    │
                         └──────────────────┘
                                │
                                ▼
                         ┌──────────────────┐
                         │ Return Response  │
                         │ (No key included)│
                         └──────────────────┘
                                │
                                ▼
┌──────────────┐         ┌──────────────────┐
│ Display Text │←────────│ Parse & Log      │
└──────────────┘         └──────────────────┘
```

## 💰 Cost Calculator

```
Pricing (as of Jan 2026):

GPT-4 (Current):
  Input:  $0.03 per 1K tokens
  Output: $0.06 per 1K tokens
  
Typical conversation:
  1 message ≈ 100 tokens
  Cost per message ≈ $0.01-$0.05

Monthly estimate:
  100 users × 10 messages × $0.03
  = $30/month

Cost optimization:
  • Switch to GPT-3.5-turbo ($0.0005-$0.0015/K)
  • Set max_tokens to 300 (shorter responses)
  • Implement caching for common questions
```

## ✅ Health Check Flow

```
curl https://noirdining.netlify.app/api/openai/health

                        ▼
                        
    Is OPENAI_API_KEY loaded?
         Yes ─┬─ No
            ╱ ╲
           /   \
          ▼     ▼
        Yes   "❌ Missing"
         │
         ▼
    Can connect to OpenAI?
         │
      ┌──┴──┐
      │     │
     Yes   No
      │     │
      ▼     ▼
    ✅    "❌ Failed"
   Connected
```

## 🎯 Testing Checklist

```
□ Backend running
  - Port 5000
  - /health endpoint responds
  
□ OpenAI API key
  - Added to backend/.env
  - Starts with "sk-proj-"
  
□ Frontend running
  - Port 5173
  - Chat button visible
  
□ Chat functionality
  - Can type message
  - Can send message
  - Loading spinner shows
  - Bot responds
  - Response matches context
  
□ Error handling
  - Invalid key → error message
  - Network error → error message
  - Graceful fallback responses
  
□ Conversation context
  - History maintained
  - Previous messages included
  - Context improves responses
```

---

**Visual Guide Complete!** 🎉

Use this guide as a reference when:
- Setting up the integration
- Debugging issues
- Understanding the data flow
- Explaining to team members

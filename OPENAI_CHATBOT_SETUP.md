# OpenAI Chatbot Configuration Guide

## Overview
The NOIR restaurant chatbot is now integrated with OpenAI's GPT-4 API to provide intelligent, context-aware responses based on the restaurant scope.

## Features
- ✅ **Restaurant-Scoped Responses**: Answers questions about menu, reservations, hours, location, and special events
- ✅ **Conversation History**: Maintains context across multiple messages
- ✅ **Text Chat**: Send and receive messages with OpenAI-powered AI
- ✅ **Voice Integration**: Compatible with VAPI for voice calls
- ✅ **Error Handling**: Graceful error messages and fallback responses

## Architecture

### Backend Setup
```
backend/
├── src/
│   ├── controller/
│   │   ├── openai.Controller.js      (NEW - OpenAI API integration)
│   │   └── vapi.Controller.js        (Existing - Voice calls)
│   ├── routers/
│   │   ├── openai.Routes.js          (NEW - OpenAI endpoints)
│   │   └── vapi.Routes.js            (Existing - VAPI routes)
│   └── utils/
│       ├── logger.js                 (NEW - Backend logging)
│       └── encryption.js             (Existing - Encryption)
├── index.js                          (Updated - Added OpenAI routes)
├── package.json                      (Update needed)
└── .env                              (Add OPENAI_API_KEY)
```

### Frontend Setup
```
frontend/src/components/
├── FloatingChatbot.jsx               (Updated - OpenAI integration)
└── ... (other components)
```

## Setup Instructions

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign in or create an account
3. Go to API keys section
4. Create a new secret key
5. Copy the key (you won't see it again!)

### 2. Configure Backend Environment

**File**: `backend/.env`

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

Replace `sk-proj-your-actual-api-key-here` with your actual OpenAI API key from step 1.

### 3. Install Dependencies (if needed)

The backend uses native `fetch` for API calls, so no additional packages are required. The code is compatible with Node.js 18+.

If you need to upgrade dependencies:

```bash
cd backend
npm install
```

Current backend dependencies already include Express, CORS, and other required packages.

### 4. Start the Backend

```bash
cd backend
npm start
# or for development with hot reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### 5. Configure Frontend

**File**: `frontend/.env`

```bash
# Backend URL (update if your backend runs on a different port)
VITE_BACKEND_URL=http://localhost:5000/api

# Other existing configurations...
VITE_VAPI_API_KEY=...
VITE_VAPI_ASSISTANT_ID=...
```

### 6. Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Chat with OpenAI

**POST** `/api/openai/chat`

Send a message to OpenAI and get a restaurant-scoped response.

**Request Body**:
```json
{
  "message": "What are your best appetizers?",
  "conversationHistory": [
    {
      "type": "user",
      "text": "Hello"
    },
    {
      "type": "bot",
      "text": "Hello! Welcome to NOIR..."
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Our best appetizers include...",
  "timestamp": "2026-01-29T10:30:00.000Z"
}
```

### Check OpenAI Health

**GET** `/api/openai/health`

Check if OpenAI API is properly configured and accessible.

**Response**:
```json
{
  "configured": true,
  "apiKey": "✅ Loaded",
  "apiWorking": true,
  "apiStatus": "✅ Connected",
  "timestamp": "2026-01-29T10:30:00.000Z"
}
```

## Restaurant Context

The chatbot uses the following context:

```
You are NOIR, an AI assistant for an upscale restaurant. You help customers with:
- Menu inquiries and recommendations
- Reservation bookings (dates, times, party size)
- Restaurant location and hours
- Special events and promotions
- Dietary preferences and allergies
- Payment information and methods

When responding:
1. Be professional and elegant (match NOIR's luxury brand)
2. Provide specific menu items when asked
3. Guide through the reservation process
4. Answer questions about pricing, location, and hours
5. Suggest dishes based on dietary needs
6. Be concise but helpful

Restaurant Details:
- Name: NOIR
- Cuisine: Fine Dining
- Atmosphere: Upscale, elegant
- Hours: 11 AM - 11 PM, Closed Mondays
- Specialty: Contemporary French cuisine with modern twists
```

You can customize this context in `backend/src/controller/openai.Controller.js` - look for the `RESTAURANT_CONTEXT` variable.

## Features in FloatingChatbot

### Text Chat
1. Click the chat button in the bottom-right corner
2. Type your question or message
3. Press Enter or click Send
4. The chatbot will respond with OpenAI-powered answers

### Voice Calls
- Click the phone icon to start a voice call
- The VAPI integration handles voice communication
- OpenAI powers the AI responses during voice calls

### Message Display
- **User messages**: Gold background on the right
- **Bot messages**: Dark background with gold border on the left
- **System messages**: Italic text with status info
- **Loading state**: Animated dots while waiting for response

## Troubleshooting

### Issue: "OpenAI API key not configured"
**Solution**: Check that `OPENAI_API_KEY` is set in `backend/.env` file.

### Issue: 401 Unauthorized from OpenAI
**Solution**: Verify your API key is correct. The key must start with `sk-proj-`.

### Issue: "Failed to process chat message"
**Solution**: 
1. Check backend is running: `http://localhost:5000/health`
2. Verify OpenAI API is working: `http://localhost:5000/api/openai/health`
3. Check browser console (F12) for error details
4. Ensure backend and frontend are on correct URLs

### Issue: Chat messages not appearing
**Solution**: 
1. Open browser DevTools (F12)
2. Check Network tab for failed requests
3. Check Console for error messages
4. Ensure `VITE_BACKEND_URL` is correctly set in frontend `.env`

## Testing the Integration

### Test via Postman or cURL

```bash
curl -X POST http://localhost:5000/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is your cuisine type?",
    "conversationHistory": []
  }'
```

### Test Health Check

```bash
curl http://localhost:5000/api/openai/health
```

## Cost Considerations

- OpenAI charges per token used
- GPT-4 is more expensive than GPT-3.5-turbo
- Monitor your usage on [OpenAI Platform](https://platform.openai.com/account/usage/overview)
- You can set usage limits to prevent unexpected charges

To use a cheaper model, update `backend/src/controller/openai.Controller.js`:

```javascript
// Change from:
model: "gpt-4",

// To:
model: "gpt-3.5-turbo",
```

## Customization

### Update Restaurant Context

Edit `backend/src/controller/openai.Controller.js`:

```javascript
const RESTAURANT_CONTEXT = `
You are NOIR, an AI assistant...
[Customize this with your specific restaurant details]
`;
```

### Adjust AI Behavior

Modify parameters in the same file:

```javascript
body: JSON.stringify({
  model: "gpt-4",
  messages: messages,
  temperature: 0.7,      // 0 = factual, 1 = creative
  max_tokens: 500,       // Response length limit
  top_p: 0.9            // Diversity of responses
})
```

## Security Notes

- Never commit your `.env` file with real API keys
- Use environment variables for sensitive data
- The backend validates all incoming messages
- API keys are not exposed to the frontend
- All communication uses HTTPS in production

## Next Steps

1. ✅ Set up OpenAI API key
2. ✅ Configure backend `.env`
3. ✅ Start backend and frontend
4. ✅ Test the chatbot in the UI
5. ✅ Customize restaurant context as needed
6. ✅ Monitor API usage and costs

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs: `npm run dev` output
3. Check frontend console (F12 → Console tab)
4. Visit [OpenAI Documentation](https://platform.openai.com/docs)

# 🤖 NOIR Restaurant - OpenAI Chatbot Integration

## ✨ What's New

Your NOIR restaurant chatbot now features **AI-powered responses using OpenAI GPT-4**, configured to respond based on restaurant scope (menu, reservations, hours, location, etc.).

### Features
✅ **Intelligent Responses** - GPT-4 powered conversational AI
✅ **Restaurant Context** - All responses focused on NOIR's scope
✅ **Conversation Memory** - Maintains context across messages
✅ **Professional UI** - Beautiful chat interface with loading states
✅ **Voice Compatible** - Works alongside VAPI voice calls
✅ **Secure** - API keys kept safe on backend

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Get OpenAI API Key
- Go to: https://platform.openai.com
- Create account or sign in
- Click "API keys" → "Create new secret key"
- Copy the key (starts with `sk-proj-`)

### 2️⃣ Add Key to Backend
Open `backend/.env` and add:
```bash
OPENAI_API_KEY=sk-proj-paste-your-key-here
```

### 3️⃣ Start Backend
```bash
cd backend
npm start
```
✅ Should show: `📍 Port: 5000`

### 4️⃣ Start Frontend
```bash
cd frontend
npm run dev
```
✅ Should show: `Local: http://localhost:5173`

### 5️⃣ Test It!
1. Open http://localhost:5173 in browser
2. Click chat button (bottom-right, gold circle)
3. Type: `What are your hours?`
4. AI responds: `We're open 11 AM - 11 PM, closed Mondays`

## 📚 Documentation

Comprehensive guides are included:

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **[OPENAI_QUICKSTART.md](./OPENAI_QUICKSTART.md)** | 5-minute setup | 3 min |
| **[OPENAI_CHATBOT_SETUP.md](./OPENAI_CHATBOT_SETUP.md)** | Complete configuration | 15 min |
| **[VISUAL_INTEGRATION_GUIDE.md](./VISUAL_INTEGRATION_GUIDE.md)** | Architecture & diagrams | 10 min |
| **[CODE_CHANGES_REFERENCE.md](./CODE_CHANGES_REFERENCE.md)** | Code modifications | 8 min |
| **[OPENAI_INTEGRATION_SUMMARY.md](./OPENAI_INTEGRATION_SUMMARY.md)** | Implementation details | 12 min |

## 🏗️ What Was Added

### Backend (Node.js Express)
```
✅ backend/src/controller/openai.Controller.js  - OpenAI API integration
✅ backend/src/routers/openai.Routes.js         - API endpoints
✅ backend/src/utils/logger.js                  - Logging utility
✅ backend/.env.example                         - Environment template
```

### Frontend (React)
```
✅ frontend/src/components/FloatingChatbot.jsx  - Updated with OpenAI calls
```

### Documentation
```
✅ OPENAI_CHATBOT_SETUP.md            - Detailed setup guide
✅ OPENAI_QUICKSTART.md               - Quick start guide
✅ OPENAI_INTEGRATION_SUMMARY.md      - Implementation overview
✅ CODE_CHANGES_REFERENCE.md          - Specific code changes
✅ VISUAL_INTEGRATION_GUIDE.md        - Architecture diagrams
✅ README_OPENAI_SETUP.md             - This file
```

## 🔧 Configuration

### Environment Variables

**Backend** (`backend/.env`):
```bash
# REQUIRED - Add your OpenAI API key
OPENAI_API_KEY=sk-proj-your-key-here

# Already configured - Don't change
NODE_ENV=development
PORT=5000
VAPI_API_KEY=...
VAPI_ASSISTANT_ID=...
```

**Frontend** (`frontend/.env`):
```bash
# Already configured - Don't change
VITE_BACKEND_URL=http://localhost:5000/api
VITE_VAPI_API_KEY=...
VITE_VAPI_ASSISTANT_ID=...
```

## 📡 API Endpoints

### Chat Endpoint
```bash
POST /api/openai/chat

Request:
{
  "message": "Do you have vegetarian options?",
  "conversationHistory": []  // Optional, for context
}

Response:
{
  "success": true,
  "message": "Yes! We offer several vegetarian dishes...",
  "timestamp": "2026-01-29T..."
}
```

### Health Check
```bash
GET /api/openai/health

Response:
{
  "configured": true,
  "apiKey": "✅ Loaded",
  "apiWorking": true,
  "apiStatus": "✅ Connected"
}
```

## 💬 Chat Features

### Text Chat
- Type messages naturally
- Get AI responses in real-time
- View conversation history
- Emoji support

### Context-Aware Responses
The chatbot knows about:
- Menu items and cuisine style
- Reservation system
- Restaurant hours (11 AM - 11 PM, closed Mondays)
- Location and contact
- Dietary accommodations
- Special events and promotions

### Conversation Memory
- Maintains context across messages
- References previous statements
- Improves response quality

## 🎯 Chatbot Scope

The AI is configured to discuss only restaurant-related topics:

✅ **Can Help With**
- Menu questions and recommendations
- Reservation inquiries
- Hours and location
- Dietary restrictions
- Special events
- Payment methods

⛔ **Won't Discuss**
- Unrelated topics (politics, weather, etc.)
- Personal information
- Inappropriate content

## 🔐 Security

✅ **API Key Protection**
- Stored only in backend `.env`
- Never exposed to frontend
- Never logged or cached

✅ **Request Validation**
- Input sanitization
- Error handling
- Rate limiting recommended

✅ **Data Privacy**
- Messages not stored by default
- Conversation history only in session

## 💰 Costs

### Pricing
- **GPT-4**: ~$0.01-0.05 per message
- **GPT-3.5-turbo**: ~$0.001-0.002 per message (cheaper)

### Free Trial
- $5 free credits from OpenAI
- Enough for ~500 messages

### Monitor Usage
- Track on: https://platform.openai.com/account/usage/overview
- Set usage limits to prevent surprises

### Save Money
To use cheaper model, edit `backend/src/controller/openai.Controller.js`:
```javascript
model: "gpt-3.5-turbo"  // Instead of "gpt-4"
```

## 🧪 Testing

### Via Browser
1. Open http://localhost:5173
2. Click chat button
3. Try these questions:
   - "What are your hours?"
   - "Do you have vegetarian options?"
   - "How do I make a reservation?"
   - "What's your specialty?"

### Via Command Line (cURL)
```bash
# Chat request
curl -X POST http://localhost:5000/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What do you recommend?",
    "conversationHistory": []
  }'

# Health check
curl http://localhost:5000/api/openai/health
```

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| **API key not working** | Check it starts with `sk-proj-` and is in `backend/.env` |
| **Backend won't start** | Ensure Node.js 18+ is installed: `node --version` |
| **Frontend shows error** | Check `VITE_BACKEND_URL` is correct in `frontend/.env` |
| **No response from chatbot** | Check browser console (F12) for errors, verify backend running |
| **Slow responses** | Normal 2-5 second delay. OpenAI API latency varies |

For more troubleshooting, see: **[OPENAI_CHATBOT_SETUP.md](./OPENAI_CHATBOT_SETUP.md#troubleshooting)**

## 🚀 Deployment

When deploying to production:

1. **Environment Variables**
   ```bash
   # Set on deployment platform (Render, Vercel, etc.)
   OPENAI_API_KEY=sk-proj-your-key
   VITE_BACKEND_URL=https://your-backend-domain.com/api
   ```

2. **HTTPS Only**
   - All communication must be encrypted
   - API keys transmitted securely

3. **Rate Limiting**
   - Add middleware to prevent abuse
   - Limit requests per IP/user

4. **Monitoring**
   - Track API usage and costs
   - Monitor error rates
   - Set up alerts

## 📊 Architecture Overview

```
User (Browser)
    ↓
FloatingChatbot Component (React)
    ↓
POST /api/openai/chat (Express)
    ↓
openai.Controller.js
    ↓
OpenAI API (GPT-4 Cloud)
    ↓
Response back to UI
    ↓
Display in Chat
```

## 🛠️ Development

### Code Structure
```
backend/
├── index.js                    # Express app setup
├── src/
│   ├── controller/
│   │   ├── openai.Controller.js
│   │   └── vapi.Controller.js
│   ├── routers/
│   │   ├── openai.Routes.js
│   │   └── vapi.Routes.js
│   └── utils/
│       ├── logger.js
│       └── encryption.js
└── .env                        # Environment variables
```

### Key Files
- **openai.Controller.js**: Main OpenAI integration
- **openai.Routes.js**: API endpoint definitions
- **FloatingChatbot.jsx**: Chat UI component

### Customization
- Edit `RESTAURANT_CONTEXT` in `openai.Controller.js` to change AI behavior
- Adjust `temperature`, `max_tokens`, `top_p` for response style
- Switch model to `gpt-3.5-turbo` for cost savings

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend `.env` has `OPENAI_API_KEY`
- [ ] Backend starts without errors
- [ ] Frontend `.env` has correct `VITE_BACKEND_URL`
- [ ] Frontend loads successfully
- [ ] Chat button visible in UI
- [ ] Can type and send messages
- [ ] Receiving AI responses
- [ ] Responses mention restaurant
- [ ] Loading spinner shows while waiting
- [ ] No errors in browser console (F12)

## 📞 Getting Help

1. **Quick Issues**: Check [OPENAI_QUICKSTART.md](./OPENAI_QUICKSTART.md)
2. **Setup Questions**: Read [OPENAI_CHATBOT_SETUP.md](./OPENAI_CHATBOT_SETUP.md)
3. **Technical Details**: See [VISUAL_INTEGRATION_GUIDE.md](./VISUAL_INTEGRATION_GUIDE.md)
4. **Code Changes**: Review [CODE_CHANGES_REFERENCE.md](./CODE_CHANGES_REFERENCE.md)
5. **Browser Console**: Press F12 to see detailed error messages

## 🎓 Next Steps

1. ✅ Get OpenAI API key
2. ✅ Configure backend
3. ✅ Start both services
4. ✅ Test the chatbot
5. ➡️ Customize restaurant context
6. ➡️ Deploy to production
7. ➡️ Monitor usage and costs

## 📈 Future Enhancements

Possible additions:
- [ ] User authentication and chat history
- [ ] Persistent database storage
- [ ] Multi-language support
- [ ] Real-time analytics
- [ ] A/B testing different prompts
- [ ] Integration with restaurant database
- [ ] Booking confirmation automation

## 📄 License & Credits

This integration maintains all existing project licenses and credits.

---

## 🎉 You're All Set!

Your NOIR restaurant chatbot is now powered by OpenAI GPT-4 and ready to provide intelligent, context-aware customer service.

**Questions?** Check the documentation files above.

**Ready to go?** Start with: [OPENAI_QUICKSTART.md](./OPENAI_QUICKSTART.md)

---

**Last Updated**: January 29, 2026
**Status**: ✅ Ready for Production

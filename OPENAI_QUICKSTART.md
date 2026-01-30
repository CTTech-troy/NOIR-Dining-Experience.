# OpenAI Chatbot - Quick Start

## ⚡ 5-Minute Setup

### Step 1: Get Your API Key (2 minutes)
1. Go to https://platform.openai.com
2. Click "API keys" in the sidebar
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-`)

### Step 2: Add API Key to Backend (1 minute)
Open `backend/.env` and add:
```bash
OPENAI_API_KEY=sk-proj-YOUR-KEY-HERE
```

### Step 3: Start the Backend (1 minute)
```bash
cd backend
npm start
```

You should see: `📍 Port: 5000` and `✅ Environment: development`

### Step 4: Start the Frontend (1 minute)
In a new terminal:
```bash
cd frontend
npm run dev
```

You should see: `Local: http://localhost:5173`

### Step 5: Test It! 
1. Open http://localhost:5173
2. Click the chat button (bottom-right corner)
3. Type: "What are your hours?"
4. The chatbot responds with restaurant info!

## 🔧 Configuration Files

### Backend - `backend/.env`
```bash
# REQUIRED - Add your OpenAI API key
OPENAI_API_KEY=sk-proj-your-key-here

# Already configured
NODE_ENV=development
PORT=5000
VAPI_API_KEY=...
```

### Frontend - `frontend/.env`
```bash
# Should already be set
VITE_BACKEND_URL=http://localhost:5000/api
VITE_VAPI_API_KEY=...
VITE_VAPI_ASSISTANT_ID=...
```

## 📝 API Endpoints

### Chat Endpoint
```bash
POST http://localhost:5000/api/openai/chat

Request:
{
  "message": "What's your best dish?",
  "conversationHistory": []
}

Response:
{
  "success": true,
  "message": "Our specialty is...",
  "timestamp": "2026-01-29..."
}
```

### Health Check
```bash
GET http://localhost:5000/api/openai/health
```

## 🎯 What the Chatbot Can Do

✅ Answer menu questions
✅ Help with reservations
✅ Provide restaurant hours & location
✅ Suggest dishes by preference
✅ Handle dietary restrictions
✅ Remember conversation context

## 🐛 Quick Troubleshooting

**"Chatbot not responding?"**
- Check: Is backend running? (http://localhost:5000/health)
- Check: Is API key in `.env`?
- Check: Open DevTools (F12) → Console for errors

**"401 Unauthorized?"**
- Your API key is wrong or expired
- Get a new one from platform.openai.com

**"Backend won't start?"**
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install` in backend folder

## 💰 Cost Management

- Free tier: $5 free credits monthly
- Pricing: ~$0.005 per 1000 tokens
- Monitor usage: https://platform.openai.com/account/usage/overview

**To save money**, change GPT-4 to GPT-3.5-turbo in `backend/src/controller/openai.Controller.js`:
```javascript
model: "gpt-3.5-turbo",  // Cheaper option
```

## 📚 Full Documentation

See `OPENAI_CHATBOT_SETUP.md` for:
- Detailed setup instructions
- API documentation
- Restaurant context customization
- Advanced configuration
- Security best practices

## ✅ Success Checklist

- [ ] OpenAI API key obtained
- [ ] API key added to `backend/.env`
- [ ] Backend running (npm start)
- [ ] Frontend running (npm run dev)
- [ ] Chat button visible in UI
- [ ] Can type and send messages
- [ ] Receiving AI responses
- [ ] Responses match restaurant scope

## 🎉 You're Ready!

Your NOIR restaurant chatbot with OpenAI is now live and ready to help customers!

# VAPI Voice Chat Troubleshooting Guide

## 🔴 Issue: Can't Hear the Assistant or Microphone Not Recording

Follow these steps in order to identify the problem:

---

## **Step 1: Check Browser Console Logs** 🖥️

1. Open Developer Tools: **F12**
2. Go to **Console** tab
3. Click the phone button to start a call
4. **Look for these messages:**

### ✅ **Good Signs (Things Should Work):**
```
✅ Microphone access GRANTED
✅ Vapi SDK loaded from window.vapiSDK
🚀 Vapi SDK ready for voice calls
✅ Vapi call initiated - SDK will handle mic & audio automatically
📢 Waiting for assistant to start speaking (First Message Mode)...
📞 Call started - Listening for assistant to speak...
🎧 Remote audio received: remote-audio
🔊 Assistant audio playing!
🎤 User: [your voice transcribed here]
🤖 Assistant: [assistant response here]
```

### ❌ **Error Signs (Need to Fix):**
```
❌ Microphone access DENIED
❌ VAPI_API_KEY: MISSING
❌ VAPI_ASSISTANT_ID: MISSING
❌ Audio playback failed
❓ No "Call started" message
```

---

## **Step 2: Verify Microphone Permissions** 🎤

If you see: `❌ Microphone access DENIED`

### **Chrome:**
1. Click the **lock icon** in the address bar
2. Find **"Microphone"**
3. Change to **"Allow"**
4. Refresh the page
5. Click phone button again

### **Firefox:**
1. Address bar → **lock icon**
2. Find **"Permissions"** 
3. **Allow** microphone access
4. Refresh and retry

### **Safari (Mac):**
1. **System Preferences → Security & Privacy → Microphone**
2. Check your browser is listed and **enabled**

---

## **Step 3: Check VAPI Assistant Configuration** 🤖

If you see: `📢 Waiting for assistant to start speaking...` but **nothing happens**

This means the **Assistant isn't configured to speak first**.

### **Fix in Vapi Dashboard:**

1. Go to [https://dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Select your **Assistant**
3. Find **"First Message Mode"** (or **"Start Speaking"**)
4. Set to: **"Assistant Speaks First"**
5. Save changes
6. Refresh your website and try again

**Why this matters:**
- If set to "User Speaks First" → Assistant waits silently for you to talk
- If set to "Assistant Speaks First" → Assistant greets you immediately

---

## **Step 4: Verify Environment Variables** 🔐

If you see: `❌ VAPI_API_KEY: MISSING` or `❌ VAPI_ASSISTANT_ID: MISSING`

### **Check `.env` file** (in `/frontend` folder):
```env
VITE_VAPI_API_KEY=a2309292-69cb-4252-b5df-296318a5d96b
VITE_VAPI_ASSISTANT_ID=ca7135d1-c774-4ef4-9081-86713bf13ec8
```

1. Copy these values from [Vapi Dashboard](https://dashboard.vapi.ai)
2. Update `.env` file
3. **Restart dev server:** `npm run dev` in `/frontend`
4. Refresh browser (Ctrl+Shift+R to clear cache)

---

## **Step 5: Audio Output Device Check** 🔊

If you see:
```
🎧 Remote audio received: remote-audio
❌ Audio playback failed: NotAllowedError
```

### **Check:**
1. **Volume is not muted** - Check your PC/Mac volume
2. **Browser volume not muted** - Chrome tab might be muted (speaker icon in tab)
3. **Audio output device** - Right-click speaker icon in taskbar:
   - Ensure correct speaker/headphones selected
   - Test volume in another application

### **Browser Autoplay Policy:**
Chrome blocks autoplay unless there's **user interaction first**. 
- ✅ Our code handles this (call starts from button click)
- If still blocked, try: **Settings → Privacy → Site Settings → Sound → Allow**

---

## **Step 6: Check Call Statistics** 📊

After call ends, look for:
```
📊 Call Statistics:
  - Duration: 15.3s
  - Messages: 5
```

- **Duration 0s or very short** = Call dropped or didn't connect
- **Messages 0** = Nothing was transcribed
- **Duration >5s + Messages >2** = ✅ Working!

---

## **Step 7: Test Microphone Directly** 🎙️

If microphone access is denied, test it outside the browser:

**Windows:**
1. Settings → Sound → Recording tab
2. Speak into mic
3. Green bar should move

**Mac:**
1. System Preferences → Sound → Input
2. Speak into mic
3. Volume meter should move

If **no movement**, microphone is broken/disconnected.

---

## **Console Messages Reference** 📋

| Message | Meaning | Action |
|---------|---------|--------|
| `✅ Microphone access GRANTED` | Browser can use mic | ✅ Good |
| `❌ Microphone access DENIED` | Browser blocked mic | Allow in browser settings |
| `❌ NotAllowedError` | Permission denied in system | Check OS microphone settings |
| `❌ NotFoundError` | No mic device found | Check hardware connection |
| `📞 Call started` | VAPI SDK connected | ✅ Wait for assistant to speak |
| `🎤 User: [text]` | Your voice recognized | ✅ Good |
| `🤖 Assistant: [text]` | Assistant responded | ✅ Working! |
| `🎧 Remote audio received` | Audio stream incoming | ✅ Check speaker |
| `❌ Audio playback failed` | Can't play sound | Unmute/check audio output |
| `❓ Unknown message type` | Unexpected message | Report to support |

---

## **Quick Fix Checklist** ✅

- [ ] Browser console shows `✅ Microphone access GRANTED`
- [ ] Environment variables loaded (`✅ Vapi API Key` in console)
- [ ] Vapi Assistant set to "Assistant Speaks First"
- [ ] Speaker not muted (system volume + browser volume)
- [ ] Microphone works in other apps (Discord, recording app)
- [ ] No `NotAllowedError` in console
- [ ] Call shows `📞 Call started` message

---

## **Still Not Working? Debug Steps** 🔧

1. **Open Console (F12)** and scroll up to see ALL messages
2. **Copy the error messages** from console
3. **Check these files:**
   - `/frontend/.env` - Has VAPI credentials?
   - `/backend/.env` - Backend not needed for voice calls
   - `/frontend/src/components/FloatingChatbot.jsx` - SDK initialized?

4. **Test the Vapi SDK directly:**
```javascript
// In browser console, paste this:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log("✅ Microphone works"))
  .catch(err => console.error("❌ Microphone error:", err.name));
```

5. **Restart everything:**
   - Kill dev server (Ctrl+C in terminal)
   - Delete `/frontend/node_modules`
   - `npm install` 
   - `npm run dev`
   - Refresh browser (Ctrl+Shift+R)

---

## **Still Stuck?** 📞

If you've followed all steps and it's still not working:

1. **Take a screenshot** of browser console showing all logs
2. **Note which step failed** (microphone, credentials, first message, etc.)
3. **Check Vapi status page** - https://status.vapi.ai
4. **Contact Vapi support** with error messages

---

## **Expected Behavior When Working** ✅

1. Click phone button
2. Browser asks "Allow microphone?" → **Click Allow**
3. Hear a greeting from assistant
4. Speak naturally
5. Assistant responds
6. See transcripts in chat
7. Click phone button to end call

**That's it!** 🎉

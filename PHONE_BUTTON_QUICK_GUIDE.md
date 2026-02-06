# Quick Reference: Using the Phone Button

## Overview
The Phone button (📞) in the NOIR chatbot now uses **Dograh.ai Active Agents** for voice calls instead of VAPI.

---

## How to Make a Voice Call

### Step 1: Open the Chat
- Click the **chat bubble** icon (💬) in bottom-right corner
- Chat window opens

### Step 2: Click the Phone Button
- Look for the **Phone button** (📞) in the chat header
- Click it

### Step 3: Enter Phone Number
- Browser will prompt: **"Enter phone number to call"**
- Type a phone number:
  - Format: `+1-555-123-4567` ✅
  - Or: `+1 (555) 123-4567` ✅
  - Or: `+15551234567` ✅
  - Don't forget the country code (+1 for US)

### Step 4: Start the Call
- Click **OK** button
- Chat will show: **"📞 Connecting call to +1-555-123-4567..."**
- Wait for connection (3-5 seconds)

### Step 5: Call is Connected
- Phone button changes to **"Hang Up"** state
- Chat shows: **"📞 Calling +1-555-123-4567"**
- Recipient's phone starts ringing
- AI agent will speak when they answer

### Step 6: During the Call
- **Voice bars animate** to show activity
- Chat displays conversation status
- Press **Hang Up** button anytime to end

### Step 7: After the Call
- Chat shows: **"✅ Call ended. Duration: XXs"**
- Transcript is saved automatically
- Phone button returns to normal

---

## Visual Guide

```
┌─────────────────────────────────┐
│  NOIR Chatbot                   │
├─────────────────────────────────┤
│ ◀  ─  ✕  💬  📞  🎤             │  ← Chat header
│                                 │
│ Bot: How can I help?            │
│                                 │
│ Me: I want to make a call       │
│                                 │
│ Bot: I'll connect you now...    │
│                                 │
│ [Animated voice bars 🎵]        │  ← Shows during call
│                                 │
│ [Input field]               [📤]│
└─────────────────────────────────┘

Click 📞 to start/end voice call
```

---

## Phone Button States

| State | Icon | Color | Meaning |
|-------|------|-------|---------|
| **Idle** | 📞 | Gold border | Ready to call |
| **Connecting** | 📞 | Gold solid | Call initiating |
| **Connected** | 📞 | Gold solid | Call active |
| **In Call** | 🎤 | Gold solid | Speaking now |
| **Failed** | 📞 | Red | Call failed |
| **Disabled** | 📞 | Gray | Text mode active |

---

## Example Scenarios

### Scenario 1: Call a Customer
```
1. Click 📞 button
2. Prompt appears
3. Enter: +1-555-123-4567
4. Click OK
5. Chat shows: "Calling +1-555-123-4567..."
6. Dograh.ai agent calls the number
7. When answered, agent greets them
8. Customer can ask about reservations
9. Click Hang Up when done
10. Transcript saved
```

### Scenario 2: Check Call Status
```
1. During call, check browser console (F12)
2. Look for 🎤 emoji logs
3. Shows: Call ID, phone, status
4. After call: Duration and transcript items shown
```

### Scenario 3: Make Multiple Calls
```
1. Hang up first call ✅
2. Button returns to normal state ✅
3. Click 📞 again to make new call ✅
4. Each call gets unique ID ✅
5. All transcripts saved ✅
```

---

## What the AI Agent Does

When the call connects, Dograh.ai's agent will:

✅ **Greet the customer professionally**
```
"Hello! Thank you for calling NOIR restaurant. 
How can I help you today?"
```

✅ **Understand customer requests** like:
- "I want to book a table"
- "What's your menu?"
- "Do you have a table for 4 tonight?"

✅ **Provide information**:
- Restaurant hours
- Available dates/times
- Table capacity
- Menu details

✅ **Take reservations** (if configured):
- Customer name
- Date and time
- Party size
- Dietary requirements

✅ **Respond naturally** to any question

---

## Troubleshooting

### Problem: Button doesn't respond
**Solution**: 
- Refresh the page
- Check backend is running
- Look at browser console for errors

### Problem: "Microphone required" error
**Solution**:
- This is for VAPI (old system)
- Dograh.ai doesn't need microphone
- No error should appear

### Problem: Phone number rejected
**Solution**:
- Include country code: `+1` for USA
- Format: `+1-555-123-4567`
- No special characters except hyphens/parentheses

### Problem: Can't hear anything
**Solution**:
- Check system volume
- Ensure speakers aren't muted
- Test speaker in OS settings
- Try different phone number

### Problem: Call hangs up immediately
**Solution**:
- Check Dograh.ai agent is active
- Verify credentials in `.env`
- Check backend logs (F12 console)
- Try again in 30 seconds

### Problem: No transcript showing
**Solution**:
- Backend automatically saves transcripts
- Check browser console for call ID
- Transcripts visible in Dograh.ai dashboard

---

## Console Logs to Look For

Open browser Developer Tools: **F12** → **Console**

```javascript
// Successful call initiation
🎤 Initiating voice call with Dograh.ai Active Agents...
✅ Dograh.ai call initiated successfully
📞 Call ID: call_1234567890_ABC123XYZ
📱 Target: +1-555-123-4567
⏳ Status: initiating

// Call connected
✅ Call connected - Waiting for answer...

// Call ended
🔴 Ending Dograh.ai call: call_1234567890_ABC123XYZ
✅ Dograh.ai call ended successfully
✅ Call ended successfully
```

If you see **red ❌** errors, something went wrong.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F12` | Open browser console (see logs) |
| `Esc` | Close phone number prompt |
| `Enter` | Submit phone number |
| `Ctrl+L` | Clear console logs |

---

## Phone Number Formatting

### Valid Formats ✅
```
+1-555-123-4567
+1 (555) 123-4567
+15551234567
+44-20-7946-0958 (UK)
+91-11-4096-1111 (India)
+33-1-42-68-53-00 (France)
```

### Invalid Formats ❌
```
555-1234 (missing country code)
1-555-1234 (missing +)
001-555-1234 (wrong format)
(555) 123-4567 (no country code)
```

---

## Technical Details

### Backend API Call
```javascript
// What happens when you click Phone button:
POST /api/dograh/initiate-call
{
  phoneNumber: "+1-555-123-4567",
  context: {
    userName: "Customer",
    restaurantName: "NOIR",
    message: "Thank you for choosing NOIR"
  }
}
```

### Response
```javascript
{
  success: true,
  callId: "call_1234567890_ABC123XYZ",
  phoneNumber: "+1-555-123-4567",
  status: "initiating"
}
```

### After Call
```javascript
POST /api/dograh/end-call
{
  callId: "call_1234567890_ABC123XYZ",
  transcript: [
    { speaker: "agent", text: "Hello, thank you..." },
    { speaker: "customer", text: "I'd like..." }
  ],
  duration: 245
}
```

---

## Quick Tips

🎯 **Best Practices**:
- ✅ Use full country code (+1 for US)
- ✅ Test with different numbers
- ✅ Check browser console during calls
- ✅ Allow 3-5 seconds for connection
- ✅ Speak clearly during calls
- ✅ Review transcripts after calls

⚠️ **Things to Avoid**:
- ❌ Don't use spaces in phone numbers
- ❌ Don't click button multiple times
- ❌ Don't share API keys
- ❌ Don't use invalid phone numbers
- ❌ Don't close browser during call

---

## Getting Help

If something goes wrong:

1. **Check Console**: F12 → Console tab
2. **Look for 🎤 emoji**: Indicates Dograh.ai logs
3. **Check for ❌ red errors**: Shows what failed
4. **Note the Call ID**: Use for debugging
5. **Check Backend**: `curl https://noirdining.netlify.app/api/dograh/agent-status`

---

## Feature Comparison

| Feature | VAPI (Old) | Dograh.ai (New) |
|---------|-----------|-----------------|
| Browser microphone | Required | Not needed |
| Call initiation | Client-side | Server-side |
| Agent management | External | Built-in |
| Transcription | Optional | Automatic |
| Call recording | Optional | Automatic |
| Outbound calls | Limited | Full support |
| Inbound calls | Yes | Yes |
| Cost | Per SDK | Per minute |

---

## Advanced: Custom Integration

For developers wanting to add custom behavior:

```javascript
// In FloatingChatbot.jsx

// Make a call with custom context
const makeCall = async (phoneNumber, reservationId) => {
  const response = await fetch('/api/dograh/initiate-call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneNumber: phoneNumber,
      context: {
        reservationId: reservationId,
        customerName: 'John Doe',
        reservationDetails: 'Feb 5, 7pm, 4 guests'
      }
    })
  });
  
  const data = await response.json();
  console.log('Call ID:', data.callId);
};
```

---

## Version Info

- **System**: NOIR Restaurant Chatbot
- **Voice Provider**: Dograh.ai Active Agents (v1.0)
- **Updated**: January 29, 2026
- **Status**: ✅ Production Ready

---

**Questions?** Check the full guide: `DOGRAH_SETUP_GUIDE.md`

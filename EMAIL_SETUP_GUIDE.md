# 📧 Email Configuration Setup Guide

## Overview
The restaurant reservation system now sends beautifully designed HTML confirmation emails when:
- A reservation is successfully created
- A payment is processed
- A reservation is cancelled

## Setting Up SMTP Email

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password (remove spaces)

3. **Update .env file**
   ```
   SMTP_SERVICE=gmail
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx
   SMTP_FROM=noreply@noir-restaurant.com
   ```

### Option 2: Outlook/Hotmail

```env
SMTP_SERVICE=outlook
SMTP_HOST=smtp.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@noir-restaurant.com
```

### Option 3: SendGrid

1. Create account at https://sendgrid.com
2. Get your API key from dashboard

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key
SMTP_FROM=noreply@noir-restaurant.com
```

### Option 4: Mailgun

1. Create account at https://www.mailgun.com
2. Get SMTP credentials from dashboard

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.com
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM=noreply@noir-restaurant.com
```

## Testing Email Configuration

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Check Logs for Email Service
Look for logs like:
```
✅ Email transporter initialized
   Service: gmail
   From: noreply@noir-restaurant.com
```

### 3. Make a Test Reservation
1. Open frontend (http://localhost:5173)
2. Book a reservation with your email
3. Check your email inbox for confirmation

### Email Contents

#### Reservation Confirmation Email Includes:
- ✅ Reservation details (date, time, party size)
- 📋 Table number and location
- 💰 Pricing breakdown
- 🎫 Unique reservation ID
- 📌 Important information & dress code
- 🏢 Restaurant contact details
- 🔗 Link to view reservation online

#### Payment Confirmation Email Includes:
- All reservation details
- ✅ Payment confirmation with transaction ID
- 💳 Masked card number (for card payments)
- 🏦 Bank transfer status (if applicable)
- ⏳ Payment verification timeline

## File Structure

```
backend/src/
├── controller/
│   ├── email.Controller.js       ← Email service (NEW)
│   ├── booking.Controller.js     ← Updated with email sending
│   └── payment.Controller.js     ← Updated with email sending
└── utils/
    └── logger.js
```

## Email Flow

```
User Books Reservation
         ↓
Reservation Created
         ↓
sendReservationConfirmation()
         ↓
HTML Email Generated
         ↓
SMTP Server Sends Email
         ↓
User Receives Email ✅
```

## Frontend Integration

### Customer Experience Flow:

1. **Chat Booking**
   - User provides: name, date, time, party size
   - AI confirms availability

2. **Receipt Modal Opens**
   - Shows reservation details
   - ✨ **NEW: Email input field** with validation
   - Shows pricing breakdown

3. **Payment Selection**
   - Credit/Debit Card
   - CashApp
   - Bank Transfer
   - Pay at Venue

4. **Payment Processing**
   - If email provided → Email confirmation sent
   - Shows transaction details

5. **User's Inbox**
   - Receives beautifully designed HTML email
   - Contains all booking details
   - Can reference later for arrival

## Email Template Features

- 🎨 Professional gold & dark theme (matches NOIR branding)
- 📱 Fully responsive (mobile-friendly)
- 🔒 Secure (no sensitive data exposed)
- ⚡ Fast loading (optimized HTML/CSS)
- 🌐 Cross-client compatibility (Gmail, Outlook, Apple Mail, etc.)

## Troubleshooting

### Email Not Sending?

1. **Check Backend Logs**
   ```
   ❌ Email service not available
   ⚠️  SMTP credentials not configured
   ```
   → Add SMTP_USER and SMTP_PASSWORD to .env

2. **Check SMTP Credentials**
   - Gmail: Verify you created App Password (not regular password)
   - Ensure no typos in credentials

3. **Check Firewall/Antivirus**
   - SMTP port 587 might be blocked
   - Try port 465 (secure): set `SMTP_SECURE=true`, `SMTP_PORT=465`

4. **Check User Email**
   - Ensure valid email format in receipt form
   - Check spam folder

5. **Enable Less Secure Apps (Gmail)**
   - If App Password doesn't work, try:
   - https://myaccount.google.com/lesssecureapps

## Production Considerations

### For Production Deployment:

1. **Use Environment Variables**
   - Never commit .env to git
   - Use .env.example for template

2. **Use Managed Email Service**
   - SendGrid, Mailgun, AWS SES, or similar
   - More reliable than personal email accounts
   - Better deliverability rates

3. **Add Email Templates to Database**
   - Store templates in database
   - Allow admin customization
   - Track email sending stats

4. **Implement Email Verification**
   - Send verification link
   - Confirm email before booking

5. **Add Unsubscribe Link**
   - Required by email regulations
   - Include in footer (already in template)

6. **Monitor Delivery**
   - Track bounces
   - Monitor spam complaints
   - Maintain sender reputation

## API Endpoints Using Email

### Reservation Creation
```
POST /api/booking/create-reservation
{
  "customerName": "John Doe",
  "numGuests": 4,
  "date": "2026-02-05",
  "time": "19:00",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```
→ Sends confirmation email if email provided

### Payment Processing
```
POST /api/payment/process-card
{
  "reservationId": "RES-123456",
  "email": "john@example.com",
  "cardDetails": {...},
  "amount": 155
}
```
→ Sends payment confirmation email if email provided

## Example Email in Inbox

Subject: 🎉 Reservation Confirmed - NOIR Restaurant | ID: RES-1704022147-ABC123XYZ

From: noreply@noir-restaurant.com

Content:
```
[NOIR Logo with Gold Gradient Header]

Hello John,

✅ Your reservation at NOIR has been confirmed!

📅 Date: February 5th, 2026
⏰ Time: 7:00 PM
👥 Party Size: 4 Guests
📍 Location: Window Area
📋 Status: Confirmed

YOUR RESERVATION ID
RES-1704022147-ABC123XYZ
Please mention this ID upon arrival

Your Reserved Table
Table #1
🪟 Window View

[Payment Status + Restaurant Info + Instructions]

We look forward to your visit!

© 2026 NOIR Fine Dining
```

## Next Steps

1. ✅ Configure SMTP credentials in .env
2. ✅ Restart backend server
3. ✅ Test with a booking
4. ✅ Check email inbox
5. ✅ Customize email templates if needed (in email.Controller.js)
6. ✅ Set up custom domain (SMTP_FROM) in production

---

**For more help**: Check backend logs with `npm run dev` and look for email-related messages.

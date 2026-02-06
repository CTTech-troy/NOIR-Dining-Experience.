# 🍽️ NOIR - Premium Dining Experience

A sophisticated, modern restaurant web application built with React and Tailwind CSS. NOIR delivers an elegant digital experience for fine dining reservations, menu browsing, and customer engagement through AI-powered chat support.

![React](https://img.shields.io/badge/React-18.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-38B2AC)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-FF1493)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🎯 Core Features
- **Elegant Hero Section** - Eye-catching landing page with premium aesthetic
- **Dynamic Menu Browsing** - Full menu display with categories and detailed items
- **Smart Reservations** - Date picker with:
  - Disabled past dates validation
  - Time slot selection (17:00 - 23:00)
  - Guest count management
  - Reservation details collection
  
- **Shopping Cart System** - Add/remove items with quantity management
- **Payment Processing** - Secure payment method modal with card validation
- **Order Confirmation** - Payment success confirmation screen

### 🤖 AI Assistant
- **Floating Chatbot** - Responsive AI assistant available on all pages
  - Real-time text chat
  - Voice call capability
  - Microphone input for hands-free operation
  - Text-to-speech output
  - Bounce animation for engagement
  - Mobile-optimized interface

### 🎨 Design & UX
- **Premium Color Scheme** - Gold and dark theme (customizable)
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Smooth Animations** - Framer Motion animations throughout
- **Modern UI Components** - Custom buttons, modals, and inputs
- **Accessibility** - Semantic HTML and keyboard navigation support

### 📱 Device Support
- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktops (1024px+)
- ✅ Ultra-wide displays (1920px+)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **JavaScript (ES6+)** - Programming language

### Development Tools
- **ESLint** - Code linting
- **Git** - Version control
- **npm** - Package manager

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Clone Repository
```bash
git clone https://github.com/CTTech-troy/NOIR-Dining-Experience.git
cd resturantAI/frontend
```

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Navigate to `https://noirdining.netlify.app` to view the application.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Hero.jsx                    # Landing hero section
│   │   ├── MenuSection.jsx             # Menu display
│   │   ├── MenuItem.jsx                # Individual menu item
│   │   ├── BookingCalendar.jsx         # Reservation date & time picker
│   │   ├── Cart.jsx                    # Shopping cart modal
│   │   ├── PaymentMethodModal.jsx      # Payment form
│   │   ├── ReservationDetailsModal.jsx # Booking details form
│   │   ├── ReservationPaymentModal.jsx # Reservation payment options
│   │   ├── PaymentConfirmation.jsx     # Success confirmation
│   │   ├── FullMenuPage.jsx            # Full menu view
│   │   ├── FloatingChatbot.jsx         # AI assistant
│   │   └── ui/
│   │       └── Button.jsx              # Reusable button component
│   ├── App.jsx                         # Main app component
│   ├── main.jsx                        # Entry point
│   └── index.css                       # Global styles & theme
├── public/                             # Static assets
├── index.html                          # HTML template
├── package.json                        # Dependencies
├── vite.config.js                      # Vite configuration
├── tailwind.config.js                  # Tailwind configuration
└── eslint.config.js                    # ESLint configuration
```

---

## 🎨 Customization

### Color Theme
Edit `tailwind.config.js` to customize colors:
```javascript
colors: {
  gold: {
    DEFAULT: '#D4AF37',
    // ... other shades
  },
  dark: {
    DEFAULT: '#0a0a0a',
    // ... other shades
  }
}
```

### Fonts
Modify `index.css` to change typography:
```css
--font-sans: 'Inter', sans-serif;
--font-serif: 'Playfair Display', serif;
```

### Time Slots
Adjust available booking times in `BookingCalendar.jsx`:
```javascript
const timeSlots = [
  '17:00', '17:30', '18:00', // Customize as needed
];
```

---

## 🚀 Features in Detail

### 1. Reservation System
- **Smart Date Selection**: Past dates are disabled, only future dates can be booked
- **Time Selection**: 30-minute intervals from 17:00 to 22:30
- **Guest Management**: Configure guest count (1-8 guests)
- **Personal Details**: Collect guest names and contact information

### 2. Shopping & Payment
- **Dynamic Cart**: Add items with quantity management
- **Price Calculation**: Real-time total calculation
- **Payment Methods**: Integrated payment form with card validation
- **Order Confirmation**: Success screen with booking details

### 3. AI Chatbot
- **24/7 Availability**: Always-on customer support
- **Multi-Modal**: Chat, voice call, and voice input options
- **Responsive**: Adapts to all screen sizes with bounce animation
- **Smart Responses**: Context-aware replies (ready for AI API integration)

### 4. Responsive Design
- **Mobile First**: Optimized for small screens
- **Flexible Layouts**: CSS Grid and Flexbox for adaptive UI
- **Touch Friendly**: Large tap targets on mobile devices
- **Performance**: Optimized images and lazy loading ready

---

## 🔧 Configuration

### Vite Configuration
The project uses Vite for fast development and optimized builds. Configuration is in `vite.config.js`.

### Tailwind CSS
Utility-first CSS framework configured in `tailwind.config.js` with custom theme extensions for gold and dark colors.

### ESLint
Code quality is maintained with ESLint. Rules are configured in `eslint.config.js`.

---

## 📝 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

---

## 🔐 Security Considerations

- Input validation on all forms
- Payment form never stores actual card data
- CORS-ready for backend integration
- Responsive to modern web security standards

---

## 🚧 Future Enhancements

- [ ] Backend API integration (Node.js/Express)
- [ ] Database implementation (MongoDB/PostgreSQL)
- [ ] Real AI chatbot integration (OpenAI/Anthropic)
- [ ] Voice call implementation (Twilio/WebRTC)
- [ ] User authentication & profiles
- [ ] Reservation management dashboard
- [ ] Admin panel for menu management
- [ ] Email confirmations
- [ ] Reviews and ratings system
- [ ] Loyalty program
- [ ] Multi-language support
- [ ] Dark/Light mode toggle

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Contact & Support

For questions or support, please reach out to:
- **Email**: support@noir-dining.com
- **Phone**: (555) 123-4567
- **Website**: www.noir-dining.com

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)
- [Vite](https://vitejs.dev)

---

**Built with ❤️ by the NOIR Team**

*Elevating the dining experience through elegant design and modern technology.*

---

### 🎯 Project Status
- ✅ Frontend: Complete
- ⏳ Backend: In Development
- ⏳ AI Integration: Planned
- ⏳ Mobile App: Planned

**Last Updated**: January 26, 2026


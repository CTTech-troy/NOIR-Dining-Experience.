import React, { useState } from 'react'
import { ShoppingBag, Menu as MenuIcon } from 'lucide-react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Hero from './components/Hero'
import AboutSection from './components/AboutSection'
import MenuSection from './components/MenuSection'
import MenuPage from './components/MenuPage'
import ReviewsSection from './components/ReviewsSection'
import  ChefSection  from './components/ChefSection'
import BookingCalendar from './components/BookingCalendar'
import GallerySection from './components/GallerySection'
import Footer from './components/Footer'
import Cart from './components/Cart'
import PaymentConfirmation from './components/PaymentConfirmation'
import ReservationDetailsModal from './components/ReservationDetailsModal'
import PaymentMethodModal from './components/PaymentMethodModal'
import ReservationPaymentModal from './components/ReservationPaymentModal'
import FullMenuPage from './components/FullMenuPage'
import FloatingChatbot from './components/FloatingChatbot'
export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false)
  // Modal States
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false)
  const [isReservationPaymentOpen, setIsReservationPaymentOpen] =
    useState(false)
  const [selectedReservationDate, setSelectedReservationDate] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''))
    return sum + price * item.quantity
  }, 0)
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i,
        )
      }
      return [
        ...prev,
        {
          ...item,
          quantity: 1,
        },
      ]
    })
    setIsCartOpen(true)
  }
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }
  // Cart Checkout Flow
  const handleCheckoutStart = () => {
    setIsCartOpen(false)
    setIsPaymentMethodOpen(true)
  }
  const handlePaymentComplete = () => {
    setIsPaymentMethodOpen(false)
    setTimeout(() => {
      setIsPaymentSuccess(true)
      setCartItems([])
    }, 500)
  }
  // Reservation Flow
  const handleDateSelect = (date) => {
    setSelectedReservationDate(date)
    setIsReservationModalOpen(true)
  }
  const handleReservationDetailsComplete = (details) => {
    setIsReservationModalOpen(false)
    setIsReservationPaymentOpen(true)
  }
  const handleReservationPaymentSelect = (option) => {
    setIsReservationPaymentOpen(false)
    if (option === 'now') {
      // If paying now, show payment method modal
      setIsPaymentMethodOpen(true)
    } else {
      // If paying later, go straight to success
      setTimeout(() => {
        setIsPaymentSuccess(true)
      }, 500)
    }
  }
  return (
    <div className="bg-black min-h-screen text-white selection:bg-gold-400 selection:text-black">
      {/* Film Grain Overlay */}
      <div className="film-grain" />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold-400 origin-left z-[100]"
        style={{
          scaleX,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="text-2xl font-serif font-bold tracking-tighter">
          NOIR
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:text-gold-400 transition-colors"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-400 text-black text-[10px] flex items-center justify-center rounded-full font-bold">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
          <button className="p-2 hover:text-gold-400 transition-colors md:hidden">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentPage === 'home' && (
          <>
            <Hero />
            <AboutSection />
            <ChefSection />
            <MenuSection
              addToCart={addToCart}
              onViewFullMenu={() => setIsFullMenuOpen(true)}
            />
            <ReviewsSection />
            <BookingCalendar onBook={handleDateSelect} />
            <GallerySection />
          </>
        )}

        {currentPage === 'menu' && <MenuPage addToCart={addToCart} />}

        {currentPage === 'about' && <AboutSection />}

        {currentPage === 'reservations' && <BookingCalendar onBook={handleDateSelect} />}

        <Footer />
      </main>

      {/* Overlays */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onCheckout={handleCheckoutStart}
      />

      <FullMenuPage
        isOpen={isFullMenuOpen}
        onClose={() => setIsFullMenuOpen(false)}
        onAddToCart={addToCart}
      />

      <ReservationDetailsModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        onComplete={handleReservationDetailsComplete}
        selectedDate={selectedReservationDate}
      />

      <ReservationPaymentModal
        isOpen={isReservationPaymentOpen}
        onClose={() => setIsReservationPaymentOpen(false)}
        onSelectOption={handleReservationPaymentSelect}
      />

      <PaymentMethodModal
        isOpen={isPaymentMethodOpen}
        onClose={() => setIsPaymentMethodOpen(false)}
        onComplete={handlePaymentComplete}
        totalAmount={cartItems.length > 0 ? `$${cartTotal}` : undefined}
      />

      <PaymentConfirmation
        isOpen={isPaymentSuccess}
        onClose={() => setIsPaymentSuccess(false)}
      />

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  )
}

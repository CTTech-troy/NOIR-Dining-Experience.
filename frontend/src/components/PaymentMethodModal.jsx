import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Calendar, Lock } from 'lucide-react';
import  Button  from './ui/Button';

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onComplete,
  totalAmount
}) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 1500);
  };
  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };
  // Format expiry date (MM/YY)
  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiry(value);
    }
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" />


          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="w-full max-w-md bg-zinc-900 border border-gold-400/20 shadow-2xl relative overflow-hidden">

              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-50" />

              {/* Header */}
              <div className="p-8 pb-0 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-serif text-white mb-2">
                    Secure Payment
                  </h2>
                  {totalAmount &&
                <p className="text-gold-400 font-serif text-xl">
                      {totalAmount}
                    </p>
                }
                </div>
                <button
                onClick={onClose}
                className="text-white/30 hover:text-white transition-colors p-2 -mr-2 -mt-2">

                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Card Number */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50 font-sans">
                    Card Number
                  </label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-gold-400 transition-colors" />
                    <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-white/5 border border-white/10 px-12 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400 transition-colors"
                    required />

                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50 font-sans">
                      Expiry
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-gold-400 transition-colors" />
                      <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full bg-white/5 border border-white/10 px-12 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400 transition-colors"
                      required />

                    </div>
                  </div>

                  {/* CVV */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50 font-sans">
                      CVV
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-gold-400 transition-colors" />
                      <input
                      type="text"
                      value={cvv}
                      onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                      }
                      placeholder="123"
                      className="w-full bg-white/5 border border-white/10 px-12 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400 transition-colors"
                      required />

                    </div>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50 font-sans">
                    Cardholder Name
                  </label>
                  <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="FULL NAME"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400 transition-colors uppercase"
                  required />

                </div>

                <Button
                type="submit"
                className="w-full mt-4"
                disabled={isProcessing}>

                  {isProcessing ? 'Processing...' : 'Pay & Confirm Order'}
                </Button>

                <div className="flex justify-center items-center gap-2 text-white/30 text-xs">
                  <Lock className="w-3 h-3" />
                  <span>Encrypted & Secure Payment</span>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Store } from 'lucide-react';
import  Button  from './ui/Button';

export default function ReservationPaymentModal({
  isOpen,
  onClose,
  onSelectOption
}) {
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
            className="w-full max-w-lg bg-zinc-900 border border-gold-400/20 shadow-2xl relative overflow-hidden">

              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-50" />

              {/* Header */}
              <div className="p-8 pb-0 flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-serif text-white mb-2">
                    Payment Preference
                  </h2>
                  <p className="text-white/60 font-sans text-sm">
                    How would you like to secure your reservation?
                  </p>
                </div>
                <button
                onClick={onClose}
                className="text-white/30 hover:text-white transition-colors p-2 -mr-2 -mt-2">

                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Options */}
              <div className="p-8 grid gap-4">
                {/* Pay Now Option */}
                <motion.button
                whileHover={{
                  scale: 1.02,
                  borderColor: 'rgba(212, 175, 55, 0.5)'
                }}
                whileTap={{
                  scale: 0.98
                }}
                onClick={() => onSelectOption('now')}
                className="group relative flex items-start gap-4 p-6 bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all duration-300">

                  <div className="p-3 bg-black border border-white/10 rounded-sm group-hover:border-gold-400/50 transition-colors">
                    <CreditCard className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-white mb-1 group-hover:text-gold-400 transition-colors">
                      Pay Deposit Now
                    </h3>
                    <p className="text-sm text-white/50">
                      Secure your table immediately with a $50 deposit. Fully
                      refundable up to 24h before.
                    </p>
                  </div>
                </motion.button>

                {/* Pay Later Option */}
                <motion.button
                whileHover={{
                  scale: 1.02,
                  borderColor: 'rgba(212, 175, 55, 0.5)'
                }}
                whileTap={{
                  scale: 0.98
                }}
                onClick={() => onSelectOption('later')}
                className="group relative flex items-start gap-4 p-6 bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all duration-300">

                  <div className="p-3 bg-black border border-white/10 rounded-sm group-hover:border-gold-400/50 transition-colors">
                    <Store className="w-6 h-6 text-white/70" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-white mb-1 group-hover:text-gold-400 transition-colors">
                      Pay at Restaurant
                    </h3>
                    <p className="text-sm text-white/50">
                      No deposit required. Payment will be collected after your
                      dining experience.
                    </p>
                  </div>
                </motion.button>
              </div>

              <div className="px-8 pb-8 text-center">
                <p className="text-xs text-white/30">
                  By proceeding, you agree to our cancellation policy and terms
                  of service.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}
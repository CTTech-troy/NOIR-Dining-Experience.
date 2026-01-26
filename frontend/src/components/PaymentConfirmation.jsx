import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import  Button  from './ui/Button';

export default function PaymentConfirmation({
  isOpen,
  onClose
}) {
  return (
    <AnimatePresence>
      {isOpen &&
      <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden">
          {/* Expanding Circle Background */}
          <motion.div
          initial={{
            scale: 0,
            borderRadius: '100%'
          }}
          animate={{
            scale: 3,
            borderRadius: '0%'
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="absolute inset-0 bg-gold-400" />


          {/* Content */}
          <motion.div
          className="relative z-10 text-center p-8"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 0.6,
            duration: 0.5
          }}>

            <motion.div
            initial={{
              scale: 0,
              rotate: -180
            }}
            animate={{
              scale: 1,
              rotate: 0
            }}
            transition={{
              delay: 0.8,
              type: 'spring',
              stiffness: 200
            }}
            className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-8">

              <Check className="w-12 h-12 text-gold-400" />
            </motion.div>

            <motion.h2
            initial={{
              y: 20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            transition={{
              delay: 1
            }}
            className="text-5xl md:text-7xl font-serif text-black mb-6">

              Confirmed
            </motion.h2>

            <motion.p
            initial={{
              y: 20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            transition={{
              delay: 1.2
            }}
            className="text-black/70 text-lg max-w-md mx-auto mb-12 font-sans">

              Your table has been reserved. We look forward to welcoming you to
              an evening of elegance.
            </motion.p>

            <motion.div
            initial={{
              y: 20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            transition={{
              delay: 1.4
            }}>

              <button
              onClick={onClose}
              className="px-8 py-3 border border-black text-black uppercase tracking-widest text-sm hover:bg-black hover:text-gold-400 transition-colors duration-300">

                Return to Home
              </button>
            </motion.div>
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import  Button  from './ui/Button';

export default function Cart({
  isOpen,
  onClose,
  items,
  onRemove,
  onCheckout
}) {
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + price * item.quantity;
  }, 0);
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />


          {/* Drawer */}
          <motion.div
          initial={{
            x: '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 300
          }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-900/90 backdrop-blur-xl border-l border-gold-400/10 z-50 flex flex-col shadow-2xl">

            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-serif text-white">Your Selection</h2>
              <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white transition-colors">

                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {items.length === 0 ?
            <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
                  <ShoppingBag className="w-12 h-12" />
                  <p className="font-serif text-lg">Your cart is empty</p>
                </div> :

            items.map((item) =>
            <motion.div
              layout
              key={item.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              className="flex gap-4 bg-white/5 p-4 rounded-sm border border-white/5">

                    <div
                className="w-20 h-20 bg-cover bg-center flex-shrink-0"
                style={{
                  backgroundImage: `url(${item.image})`
                }} />

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-white">{item.title}</h3>
                        <span className="text-gold-400">{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-white/50 uppercase tracking-wider">
                          Qty: {item.quantity}
                        </span>
                        <button
                    onClick={() => onRemove(item.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors">

                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
            )
            }
            </div>

            {/* Footer */}
            {items.length > 0 &&
          <div className="p-8 border-t border-white/5 bg-black/20">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/60 font-sans">Total</span>
                  <span className="text-2xl font-serif text-gold-400">
                    ${total}
                  </span>
                </div>
                <Button className="w-full" onClick={onCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
          }
          </motion.div>
        </>
      }
    </AnimatePresence>);

}
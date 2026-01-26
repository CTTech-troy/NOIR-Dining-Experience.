import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, User, Calendar } from 'lucide-react';
import Button from './ui/Button';

export default function ReservationDetailsModal({
  isOpen,
  onClose,
  onComplete,
  selectedDate
}) {
  const [guestCount, setGuestCount] = useState(2);
  const [primaryName, setPrimaryName] = useState('');
  const [guestNames, setGuestNames] = useState(['']);
  const [errors, setErrors] = useState({});

  // Adjust guest array when count changes
  useEffect(() => {
    setGuestNames((prev) => {
      const newCount = guestCount - 1;
      if (newCount <= 0) return [];
      const newNames = [...prev];
      if (newNames.length > newCount) return newNames.slice(0, newCount);
      while (newNames.length < newCount) newNames.push('');
      return newNames;
    });
  }, [guestCount]);

  const handleGuestNameChange = (index, value) => {
    const newNames = [...guestNames];
    newNames[index] = value;
    setGuestNames(newNames);

    if (errors[`guest_${index}`]) {
      setErrors((prev) => ({
        ...prev,
        [`guest_${index}`]: false
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    let isValid = true;

    if (!primaryName.trim()) {
      newErrors.primary = true;
      isValid = false;
    }

    guestNames.forEach((name, index) => {
      if (!name.trim()) {
        newErrors[`guest_${index}`] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid && selectedDate) {
      onComplete({
        date: `${selectedDate.month} ${selectedDate.day}, ${selectedDate.year}`,
        primaryName,
        guestCount,
        guestNames
      });
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
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
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
                    Finalize Reservation
                  </h2>
                  {selectedDate &&
                <div className="flex items-center gap-2 text-gold-400 font-sans text-sm tracking-wider uppercase">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {selectedDate.month} {selectedDate.day},{' '}
                        {selectedDate.year}
                      </span>
                    </div>
                }
                </div>
                <button
                onClick={onClose}
                className="text-white/30 hover:text-white transition-colors p-2 -mr-2 -mt-2">

                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Guest Count Selector */}
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-white/50 font-sans">
                    Party Size
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) =>
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestCount(num)}
                    className={`
                          w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-sm border transition-all duration-300 font-serif text-lg
                          ${guestCount === num ? 'bg-gold-400 border-gold-400 text-black' : 'border-white/10 text-white/50 hover:border-gold-400/50 hover:text-white'}
                        `}>

                        {num}
                      </button>
                  )}
                  </div>
                </div>

                {/* Primary Guest */}
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-white/50 font-sans flex justify-between">
                    <span>Primary Guest</span>
                    {errors.primary &&
                  <span className="text-red-400 normal-case tracking-normal">
                        Required
                      </span>
                  }
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-gold-400 transition-colors" />
                    <input
                    type="text"
                    value={primaryName}
                    onChange={(e) => {
                      setPrimaryName(e.target.value);
                      if (errors.primary)
                      setErrors((prev) => ({
                        ...prev,
                        primary: false
                      }));
                    }}
                    placeholder="Your full name"
                    className={`
                        w-full bg-white/5 border px-12 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400 transition-colors
                        ${errors.primary ? 'border-red-400/50' : 'border-white/10'}
                      `} />

                  </div>
                </div>

                {/* Additional Guests */}
                {guestCount > 1 &&
              <div className="space-y-4">
                    <label className="text-xs uppercase tracking-widest text-white/50 font-sans block">
                      Guest Names
                    </label>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {guestNames.map((name, index) =>
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      x: -10
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    transition={{
                      delay: index * 0.05
                    }}
                    className="relative group">

                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-gold-400 transition-colors" />
                          <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                      handleGuestNameChange(index, e.target.value)
                      }
                      placeholder={`Guest ${index + 2} Name`}
                      className={`
                              w-full bg-white/5 border px-12 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400 transition-colors
                              ${errors[`guest_${index}`] ? 'border-red-400/50' : 'border-white/10'}
                            `} />

                        </motion.div>
                  )}
                    </div>
                  </div>
              }

                {/* Actions */}
                <div className="pt-4 flex gap-4">
                  <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors uppercase tracking-widest text-xs">

                    Cancel
                  </button>
                  <Button type="submit" className="flex-[2]">
                    Complete Reservation
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}
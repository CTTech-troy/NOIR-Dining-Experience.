import React, { useState, Component } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import  Button  from './ui/Button';

export default function BookingCalendar({ onBook }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const days = Array.from(
    {
      length: daysInMonth
    },
    (_, i) => i + 1
  );
  const padding = Array.from(
    {
      length: firstDay
    },
    (_, i) => i
  );
  const monthName = currentMonth.toLocaleString('default', {
    month: 'long'
  });
  const year = currentMonth.getFullYear();
  const handleBookClick = () => {
    if (selectedDate && onBook) {
      onBook({
        day: selectedDate,
        month: monthName,
        year: year
      });
    }
  };
  return (
    <section
      id="reservations"
      className="py-32 px-4 md:px-8 bg-black relative overflow-hidden">

      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-gold-900/10 to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.span
            initial={{
              opacity: 0
            }}
            whileInView={{
              opacity: 1
            }}
            className="text-gold-400 uppercase tracking-[0.3em] text-sm mb-4 block">

            Reservations
          </motion.span>
          <motion.h2
            initial={{
              opacity: 0,
              y: 30
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8
            }}
            className="text-4xl md:text-6xl font-serif text-white mb-8">

            Secure Your <br />
            <span className="italic text-gold-400">Experience</span>
          </motion.h2>
          <p className="text-white/60 font-sans max-w-md mx-auto lg:mx-0 mb-12 leading-relaxed">
            Join us for an unforgettable evening of culinary excellence. We
            recommend booking at least two weeks in advance for weekend
            seatings.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <div className="flex items-center gap-3 text-white/80 border border-white/10 px-6 py-4 rounded-sm">
              <Clock className="w-5 h-5 text-gold-400" />
              <span>17:00 - 23:00</span>
            </div>
            <div className="flex items-center gap-3 text-white/80 border border-white/10 px-6 py-4 rounded-sm">
              <Users className="w-5 h-5 text-gold-400" />
              <span>Max 8 Guests</span>
            </div>
          </div>
        </div>

        {/* Calendar Component */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          whileInView={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 0.8
          }}
          className="w-full max-w-md bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8">

          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-8">
            <button className="p-2 hover:text-gold-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif text-white">
              {monthName} <span className="text-gold-400">{year}</span>
            </h3>
            <button className="p-2 hover:text-gold-400 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 mb-8">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) =>
            <div key={day} className="text-center text-xs text-white/40 mb-2">
                {day}
              </div>
            )}

            {padding.map((i) =>
            <div key={`pad-${i}`} />
            )}

            {days.map((day) =>
            <motion.button
              key={day}
              whileHover={{
                scale: 1.1
              }}
              whileTap={{
                scale: 0.95
              }}
              onClick={() => setSelectedDate(day)}
              className={`
                  relative h-10 w-10 flex items-center justify-center text-sm font-medium transition-colors duration-300
                  ${selectedDate === day ? 'text-black' : 'text-white hover:text-gold-400'}
                `}>

                {selectedDate === day &&
              <motion.div
                layoutId="selectedDay"
                className="absolute inset-0 bg-gold-400 rounded-full"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }} />

              }
                <span className="relative z-10">{day}</span>
              </motion.button>
            )}
          </div>

          <Button
            className="w-full"
            disabled={!selectedDate}
            onClick={handleBookClick}>

            {selectedDate ?
            `Book for ${monthName} ${selectedDate}` :
            'Select a Date'}
          </Button>
        </motion.div>
      </div>
    </section>);

}
import React, { useState, Component } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import  Button  from './ui/Button';

export default function BookingCalendar({ onBook }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
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

  // Available time slots
  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ];

  // Check if date is in the past
  const isDatePassed = (day) => {
    const checkDate = new Date(year, currentMonth.getMonth(), day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleBookClick = () => {
    if (selectedDate && selectedTime && onBook) {
      onBook({
        day: selectedDate,
        month: monthName,
        year: year,
        time: selectedTime
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
        </div>        {/* Calendar Component */}
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
            <button 
              onClick={handlePrevMonth}
              className="p-2 hover:text-gold-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif text-white">
              {monthName} <span className="text-gold-400">{year}</span>
            </h3>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:text-gold-400 transition-colors">
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

            {days.map((day) => {
              const isPassed = isDatePassed(day);
              return (
                <motion.button
                  key={day}
                  whileHover={!isPassed ? { scale: 1.1 } : {}}
                  whileTap={!isPassed ? { scale: 0.95 } : {}}
                  onClick={() => !isPassed && setSelectedDate(day)}
                  disabled={isPassed}
                  className={`
                    relative h-10 w-10 flex items-center justify-center text-sm font-medium transition-colors duration-300
                    ${isPassed ? 'text-white/20 cursor-not-allowed' : ''}
                    ${selectedDate === day && !isPassed ? 'text-black' : !isPassed ? 'text-white hover:text-gold-400' : ''}
                  `}>

                  {selectedDate === day && !isPassed &&
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
              );
            })}
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6">
              <label className="block text-sm font-semibold text-gold-400 mb-3">
                Select Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <motion.button
                    key={time}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      py-2 rounded text-xs font-medium transition-colors
                      ${selectedTime === time
                        ? 'bg-gold-400 text-black'
                        : 'bg-dark-200 text-white border border-gold-400/20 hover:border-gold-400'
                      }
                    `}>
                    {time}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <Button
            className="w-full"
            disabled={!selectedDate || !selectedTime}
            onClick={handleBookClick}>

            {selectedDate && selectedTime
              ? `Book ${monthName} ${selectedDate} at ${selectedTime}`
              : selectedDate
              ? 'Select Time'
              : 'Select a Date'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import  Button  from './ui/Button';
import { ChevronDown } from 'lucide-react';
export default function Hero() {
  const { scrollY } = useScroll();
  // Parallax effects
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Video Placeholder with Parallax */}
      <motion.div
        style={{
          y,
          scale
        }}
        className="absolute inset-0 z-0">

        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10" />

        {/* Simulated Video Background */}
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
            'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            filter: 'brightness(0.6) contrast(1.1)'
          }} />

      </motion.div>

      {/* Content */}
      <motion.div
        style={{
          opacity
        }}
        className="relative z-20 text-center px-4 max-w-4xl mx-auto">

        <motion.span
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: 'easeOut'
          }}
          className="block text-gold-400 text-sm md:text-base tracking-[0.3em] uppercase mb-6 font-sans">

          Est. 1924
        </motion.span>

        <motion.h1
          initial={{
            opacity: 0,
            y: 30
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 1.2,
            delay: 0.8,
            ease: 'easeOut'
          }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight">

          Culinary <span className="italic text-gold-400">Artistry</span> <br />
          & Timeless <span className="italic text-gold-400">Elegance</span>
        </motion.h1>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 1,
            delay: 1.2,
            ease: 'easeOut'
          }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center">

          <Button
            variant="primary"
            size="lg"
            onClick={() =>
            document.getElementById('reservations')?.scrollIntoView({
              behavior: 'smooth'
            })
            }>

            Book a Table
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
            document.getElementById('menu')?.scrollIntoView({
              behavior: 'smooth'
            })
            }>

            View Menu
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          delay: 2,
          duration: 1
        }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center gap-2">

        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{
            y: [0, 10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}>

          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>);

}
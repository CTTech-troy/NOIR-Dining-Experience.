import React from 'react'
import { motion } from 'framer-motion'
export default function AboutSection() {
  return (
    <section className="py-32 px-6 relative z-10 bg-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <div className="absolute inset-0 bg-gold-400/10 mix-blend-overlay z-10" />
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Chef plating a dish"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />

              {/* Decorative Frame */}
              <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/20 z-20 pointer-events-none" />
            </div>

            {/* Floating Caption */}
            <div className="absolute -bottom-8 -right-8 bg-zinc-900 p-6 border border-gold-400/20 max-w-xs hidden md:block z-30">
              <p className="text-gold-400 font-serif italic text-lg mb-2">
                "Cooking is an art of adjustment."
              </p>
              <p className="text-white/60 text-xs uppercase tracking-widest">
                — Chef Marcus Dubois
              </p>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="space-y-8"
          >
            <div>
              <span className="text-gold-400 uppercase tracking-[0.3em] text-sm mb-4 block">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                Culinary Cinema <br />
                <span className="italic text-white/50">Since 2019</span>
              </h2>
              <div className="w-24 h-[1px] bg-gold-400 mb-8" />
            </div>

            <div className="space-y-6 text-white/70 font-sans leading-relaxed">
              <p>
                Founded in the heart of the Downtown District, NOIR was born
                from a desire to merge the atmospheric tension of film noir with
                the precision of fine dining. Our space is designed to transport
                you to a bygone era of elegance, mystery, and shadow.
              </p>
              <p>
                Executive Chef Marcus Dubois, trained in the rigorous kitchens
                of Lyon and the innovative sushi counters of Tokyo, brings a
                unique "Contemporary French with Japanese Influence" approach to
                our menu. Each dish is a scene, each flavor a plot twist.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <h4 className="text-white font-serif text-lg mb-2">
                  Dress Code
                </h4>
                <p className="text-white/50 text-sm">
                  Smart Casual / Business Casual. <br />
                  Jackets recommended for gentlemen.
                </p>
              </div>
              <div>
                <h4 className="text-white font-serif text-lg mb-2">Cuisine</h4>
                <p className="text-white/50 text-sm">
                  Contemporary French <br />
                  Japanese Influences
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

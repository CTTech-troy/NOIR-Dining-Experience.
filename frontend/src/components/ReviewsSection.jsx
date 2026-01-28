import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
const REVIEWS = [
  {
    id: 1,
    name: 'Eleanor Vance',
    date: 'October 2023',
    rating: 5,
    text: 'An absolute masterpiece of atmosphere and flavor. The Wagyu Tartare was a revelation, and the service was impeccable. Felt like I was dining in a movie scene.',
  },
  {
    id: 2,
    name: 'James Sterling',
    date: 'November 2023',
    rating: 5,
    text: "NOIR isn't just a restaurant; it's an experience. The attention to detail in the lighting, the music, and the plating is unmatched in the city.",
  },
  {
    id: 3,
    name: 'Sarah Chen',
    date: 'December 2023',
    rating: 5,
    text: 'Perfect for a romantic evening. The private dining room offered the intimacy we were looking for, and the wine pairing was expertly curated.',
  },
]
const PRESS_LOGOS = [
  {
    name: 'Michelin Guide',
    label: 'MICHELIN',
  },
  {
    name: 'The New York Times',
    label: 'The New York Times',
  },
  {
    name: 'Food & Wine',
    label: 'FOOD & WINE',
  },
  {
    name: 'Eater',
    label: 'EATER',
  },
]
export default function ReviewsSection() {
  return (
    <section className="py-32 px-6 relative z-10 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="text-center mb-20"
        >
          <span className="text-gold-400 uppercase tracking-[0.3em] text-sm mb-4 block">
            Acclaim
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Guest Experiences
          </h2>
          <div className="w-24 h-[1px] bg-gold-400 mx-auto" />
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
              }}
              className="bg-black/40 border border-white/5 p-8 relative group hover:border-gold-400/30 transition-colors"
            >
              <Quote className="absolute top-8 right-8 w-8 h-8 text-white/5 group-hover:text-gold-400/10 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-gold-400 fill-gold-400"
                  />
                ))}
              </div>

              <p className="text-white/80 font-serif italic text-lg mb-8 leading-relaxed">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gold-400 font-serif font-bold">
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="text-white font-sans text-sm font-bold">
                    {review.name}
                  </h4>
                  <p className="text-white/40 text-xs">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Press Section */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.4,
          }}
          className="border-t border-white/5 pt-16"
        >
          <p className="text-center text-white/30 uppercase tracking-widest text-xs mb-12">
            Featured In
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {PRESS_LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="text-white font-serif text-xl md:text-2xl font-bold tracking-tight hover:text-gold-400 transition-colors cursor-default"
              >
                {logo.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

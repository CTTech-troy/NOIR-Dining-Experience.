import React from 'react'
import { motion } from 'framer-motion'
import { Award, Utensils, Globe } from 'lucide-react'

export default function ChefProfile() {
  return (
    <section className="py-32 px-6 relative z-10 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto">
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
            The Visionary
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Executive Chef
          </h2>
          <div className="w-24 h-[1px] bg-gold-400 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Chef Image */}
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-transparent rounded-lg" />
            <img
              src="https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Executive Chef"
              className="w-full rounded-lg shadow-2xl relative z-10"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold-400/10 rounded-lg blur-2xl" />
          </motion.div>

          {/* Chef Bio */}
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-3xl font-serif text-white mb-2">
                Chef Marcel Beaumont
              </h3>
              <p className="text-gold-400 font-semibold uppercase tracking-widest text-sm">
                Michelin Star Chef
              </p>
            </div>

            <p className="text-white/80 leading-relaxed text-lg">
              With over 25 years of culinary excellence across the finest restaurants of Europe and America, Chef Beaumont brings an unparalleled passion for innovation and tradition to every plate. His meticulous approach to ingredient selection and technique has earned him global recognition.
            </p>

            <p className="text-white/70 leading-relaxed">
              Chef Beaumont's philosophy centers on creating memorable dining experiences that engage all the senses. At NOIR, he curates a seasonal menu that celebrates the finest ingredients sourced from sustainable suppliers worldwide, transforming them into edible art.
            </p>

            {/* Achievements */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-start gap-4">
                <Award className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Michelin Recognition</h4>
                  <p className="text-white/60 text-sm">
                    Two-star Michelin chef with recognition from leading culinary institutions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Utensils className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Culinary Expertise</h4>
                  <p className="text-white/60 text-sm">
                    Mastery in French cuisine with influences from Japanese precision cooking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Globe className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Global Experience</h4>
                  <p className="text-white/60 text-sm">
                    Trained under acclaimed chefs in Paris, Tokyo, and New York
                  </p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <motion.div
              whileHover={{ borderColor: 'rgba(212, 175, 55, 0.5)' }}
              className="mt-8 pl-6 border-l-2 border-gold-400/30 transition-colors"
            >
              <p className="text-white/80 italic text-lg font-serif">
                "Cooking is not about following recipes—it's about understanding the soul of ingredients and translating passion into every bite."
              </p>
              <p className="text-gold-400 font-semibold mt-3">— Chef Marcel Beaumont</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Chef's Specialties */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.2,
          }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-black/40 border border-white/5 p-8 rounded-lg hover:border-gold-400/30 transition-colors">
            <h4 className="text-xl font-serif text-gold-400 mb-3">French Classics</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Time-honored techniques reimagined with contemporary sensibilities, honoring the traditions that built modern cuisine.
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 p-8 rounded-lg hover:border-gold-400/30 transition-colors">
            <h4 className="text-xl font-serif text-gold-400 mb-3">Seasonal Innovation</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Menus that evolve with the seasons, celebrating the peak of ingredient quality and creating entirely new culinary experiences.
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 p-8 rounded-lg hover:border-gold-400/30 transition-colors">
            <h4 className="text-xl font-serif text-gold-400 mb-3">Precision Techniques</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Japanese-inspired precision combined with European artistry creates a harmonious balance of flavor, texture, and visual perfection.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

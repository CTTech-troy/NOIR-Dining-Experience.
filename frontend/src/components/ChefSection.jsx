import React from 'react'
import { motion } from 'framer-motion'
import { Award, Star } from 'lucide-react'
const ACHIEVEMENTS = [
  {
    year: '2026',
    title: 'Michelin Star',
    description: 'First star awarded',
  },
  {
    year: '2025',
    title: 'James Beard Nominee',
    description: 'Best Chef: Northeast',
  },
  {
    year: '2024',
    title: 'Food & Wine',
    description: 'Best New Restaurant',
  },
]
export default function ChefSection() {
  return (
    <section className="py-32 px-6 relative z-10 bg-zinc-900/30 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
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
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-20"
        >
          <span className="text-gold-400 uppercase tracking-[0.3em] text-sm mb-4 block">
            The Visionary
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">
            Executive Chef
          </h2>
          <div className="w-24 h-[1px] bg-gold-400 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Chef Portrait */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            className="lg:col-span-5 relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src="https://i.pinimg.com/736x/42/ef/52/42ef523b9b048323b3a0837b1bc673a4.jpg"
                  alt="Chef Marcus Dubois"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Name Card Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-2">
                  Marcus Dubois
                </h3>
                <p className="text-gold-400 uppercase tracking-widest text-xs">
                  Executive Chef & Founder
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-gold-400/50" />
              <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-gold-400/50" />
            </div>
          </motion.div>

          {/* Chef Bio & Details */}
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
              duration: 0.8,
              delay: 0.2,
            }}
            className="lg:col-span-7 space-y-10"
          >
            {/* Quote */}
            <div className="border-l-2 border-gold-400 pl-8">
              <p className="text-2xl md:text-3xl font-serif text-white/90 italic leading-relaxed">
                "Every plate tells a story. My role is to be the
                narrator—guiding flavors through tension, release, and
                resolution."
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-6 text-white/70 font-sans leading-relaxed">
              <p>
                Born in Marseille and raised between the bustling markets of
                Provence and his grandmother's kitchen, Marcus Dubois discovered
                his calling at age twelve. His journey took him through the
                legendary kitchens of{' '}
                <span className="text-white">Paul Bocuse in Lyon</span>, where
                he mastered the foundations of French classical cuisine.
              </p>
              <p>
                A transformative three-year apprenticeship in Tokyo under{' '}
                <span className="text-white">Master Jiro Tanaka</span>{' '}
                introduced him to the philosophy of{' '}
                <span className="text-gold-400 italic">kodawari</span>—the
                relentless pursuit of perfection in craft. This fusion of French
                technique and Japanese precision became his signature.
              </p>
              <p>
                In 2019, Marcus opened NOIR with a singular vision: to create a
                dining experience that mirrors the emotional depth of cinema.
                Each tasting menu is structured like a film—with an opening act,
                rising tension, climax, and denouement.
              </p>
            </div>

            {/* Achievements */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-gold-400" />
                <h4 className="text-gold-400 uppercase tracking-widest text-xs font-bold">
                  Recognition
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ACHIEVEMENTS.map((achievement, index) => (
                  <motion.div
                    key={index}
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
                      delay: 0.4 + index * 0.1,
                    }}
                    className="bg-black/30 border border-white/5 p-6 group hover:border-gold-400/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-gold-400" />
                      <span className="text-gold-400 font-serif text-sm">
                        {achievement.year}
                      </span>
                    </div>
                    <h5 className="text-white font-serif text-lg mb-1">
                      {achievement.title}
                    </h5>
                    <p className="text-white/50 text-sm">
                      {achievement.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Philosophy */}
            <div className="bg-black/40 border border-gold-400/20 p-8">
              <h4 className="text-white font-serif text-xl mb-4">
                Culinary Philosophy
              </h4>
              <p className="text-white/60 font-sans text-sm leading-relaxed">
                Chef Dubois approaches each dish as a scene in a larger
                narrative. His cooking philosophy centers on three principles:{' '}
                <span className="text-white">respect for ingredients</span>,{' '}
                <span className="text-white">precision in technique</span>, and{' '}
                <span className="text-white">emotion in presentation</span>.
                Every element on the plate serves a purpose—nothing is
                decorative without meaning.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

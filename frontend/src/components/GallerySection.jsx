import React from 'react'
import { motion } from 'framer-motion'
const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    caption: 'The Onyx Bar',
    size: 'large',
  },
  {
    src: 'https://i.pinimg.com/736x/e1/2c/b5/e12cb5bf6722cc47bfcf54562f777160.jpg',
    caption: 'Main Dining Room',
    size: 'small',
  },
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    caption: "Chef's Table",
    size: 'small',
  },
  {
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    caption: 'Private Wine Cellar',
    size: 'large',
  },
  {
    src: 'https://i.pinimg.com/736x/ae/12/ed/ae12ed4d101f7aa90bcbf106665390f8.jpg',
    caption: 'Lounge Area',
    size: 'small',
  },
  {
    src: 'https://i.pinimg.com/736x/eb/97/b0/eb97b09b6466962613dcb74e6b710ee8.jpg',
    caption: 'Exterior Entrance',
    size: 'small',
  },
  {
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    caption: 'Exterior Entrance',
    size: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    caption: 'Exterior Entrance',
    size: 'small',
  },
  {
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    caption: 'Exterior Entrance',
    size: 'small',
  },
]
export default function GallerySection() {
  return (
    <section className="py-32 px-6 relative z-10 bg-black">
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
            Atmosphere
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Inside NOIR
          </h2>
          <div className="w-24 h-[1px] bg-gold-400 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
          {IMAGES.map((image, index) => (
            <motion.div
              key={index}
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
                delay: index * 0.1,
                duration: 0.6,
              }}
              className={`relative group overflow-hidden cursor-pointer ${image.size === 'large' ? 'md:col-span-2 md:row-span-2' : image.size === 'wide' ? 'md:col-span-2' : ''}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
              <img
                src={image.src}
                alt={image.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />

              {/* Overlay Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-end p-8">
                <p className="text-white font-serif text-xl italic">
                  {image.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

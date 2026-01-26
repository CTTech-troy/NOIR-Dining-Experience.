import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function MenuItem({
  title,
  price,
  description,
  image,
  ingredients,
  onAdd
}) {
  return (
    <motion.div
      className="group relative h-[400px] w-full overflow-hidden bg-dark-100 cursor-pointer"
      whileHover="hover"
      initial="initial">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
        style={{
          backgroundImage: `url(${image})`
        }} />


      {/* Dark Overlay - becomes darker on hover */}
      <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/70" />

      {/* Content Container */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-serif text-white group-hover:text-gold-400 transition-colors duration-300">
            {title}
          </h3>
          <span className="text-gold-400 font-serif text-xl italic">
            {price}
          </span>
        </div>

        {/* Bottom Content */}
        <div className="relative">
          {/* Default State: Description */}
          <motion.div
            variants={{
              initial: {
                opacity: 1,
                y: 0
              },
              hover: {
                opacity: 0,
                y: -20
              }
            }}
            transition={{
              duration: 0.4
            }}
            className="absolute bottom-0 left-0 w-full">

            <p className="text-white/80 font-sans text-sm leading-relaxed border-l-2 border-gold-400/50 pl-4">
              {description}
            </p>
          </motion.div>

          {/* Hover State: Ingredients & Add Button */}
          <motion.div
            variants={{
              initial: {
                opacity: 0,
                y: 20
              },
              hover: {
                opacity: 1,
                y: 0
              }
            }}
            transition={{
              duration: 0.5,
              delay: 0.1
            }}
            className="w-full">

            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-gold-400 mb-2 block">
                Ingredients
              </span>
              <p className="text-white/90 font-serif italic text-lg leading-relaxed">
                {ingredients.join(', ')}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-white hover:text-gold-400 transition-colors group/btn">

              <span className="w-8 h-[1px] bg-white/50 group-hover/btn:bg-gold-400 transition-colors" />
              Add to Order
              <Plus className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>);

}
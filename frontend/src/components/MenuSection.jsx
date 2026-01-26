import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import  MenuItem  from './MenuItem';
import { ChevronRight } from 'lucide-react';

const MENU_ITEMS = [
{
  id: 1,
  title: 'Wagyu Tartare',
  price: '$42',
  description:
  'Hand-cut A5 Wagyu beef seasoned with truffle oil and quail egg.',
  ingredients: [
  'A5 Wagyu',
  'Black Truffle',
  'Quail Egg',
  'Shallots',
  'Capers'],

  image:
  'https://images.unsplash.com/photo-1544025162-d76690b609aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
},
{
  id: 2,
  title: 'Pan-Seared Scallops',
  price: '$38',
  description: 'Diver scallops served with cauliflower purée and caviar.',
  ingredients: [
  'Hokkaido Scallops',
  'Cauliflower',
  'Osetra Caviar',
  'Lemon Butter'],

  image:
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
},
{
  id: 3,
  title: 'Lobster Thermidor',
  price: '$85',
  description: 'Whole Maine lobster with cognac cream sauce and gruyère.',
  ingredients: [
  'Maine Lobster',
  'Cognac',
  'Gruyère',
  'Dijon Mustard',
  'Tarragon'],

  image:
  'https://images.unsplash.com/photo-1553603227-2358a3a6d2b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
},
{
  id: 4,
  title: 'Truffle Risotto',
  price: '$45',
  description:
  'Arborio rice slow-cooked with wild mushrooms and fresh black truffle.',
  ingredients: [
  'Arborio Rice',
  'Wild Mushrooms',
  'Black Truffle',
  'Parmigiano Reggiano'],

  image:
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
},
{
  id: 5,
  title: 'Duck Confit',
  price: '$52',
  description:
  'Slow-cooked duck leg with cherry reduction and roasted root vegetables.',
  ingredients: ['Duck Leg', 'Cherries', 'Red Wine', 'Parsnips', 'Thyme'],
  image:
  'https://images.unsplash.com/photo-1518492104633-130d0cc84637?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
},
{
  id: 6,
  title: 'Chocolate Soufflé',
  price: '$24',
  description:
  'Dark chocolate soufflé with gold leaf and vanilla bean crème anglaise.',
  ingredients: [
  '70% Dark Chocolate',
  'Gold Leaf',
  'Vanilla Bean',
  'Free-range Eggs'],

  image:
  'https://images.unsplash.com/photo-1579372786545-d24232daf58c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
}];

export default function MenuSection({ addToCart, onViewFullMenu }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  return (
    <section
      id="menu"
      ref={ref}
      className="py-32 px-4 md:px-8 relative z-10 bg-dark-100">

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 50
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.8
          }}
          className="text-center mb-20">

          <span className="text-gold-400 uppercase tracking-[0.3em] text-sm mb-4 block">
            Our Selection
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
            Seasonal Menu
          </h2>
          <div className="w-24 h-[1px] bg-gold-400 mx-auto" />
        </motion.div>

        <motion.div
          style={{
            y
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {MENU_ITEMS.map((item, index) =>
          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              y: 50
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true,
              margin: '-50px'
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.1
            }}>

              <MenuItem {...item} onAdd={() => addToCart(item)} />
            </motion.div>
          )}
        </motion.div>

        {/* View Full Menu Button */}
        <motion.div
          initial={{
            opacity: 0
          }}
          whileInView={{
            opacity: 1
          }}
          transition={{
            delay: 0.8
          }}
          className="flex justify-center mt-16">

          <motion.button
            onClick={onViewFullMenu}
            whileHover={{
              scale: 1.05
            }}
            whileTap={{
              scale: 0.95
            }}
            className="group relative px-12 py-4 border border-gold-400/30 text-white hover:border-gold-400 transition-all duration-300 overflow-hidden">

            {/* Background effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gold-400/10"
              initial={{
                x: '-100%'
              }}
              whileHover={{
                x: 0
              }}
              transition={{
                duration: 0.3
              }} />


            <span className="relative flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-sans">
              View Full Menu
              <ChevronRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>);

}
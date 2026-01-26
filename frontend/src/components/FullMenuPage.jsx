import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

const MENU_CATEGORIES = [
{
  name: 'Appetizers',
  items: [
  {
    id: 1,
    title: 'Wagyu Tartare',
    price: '$42',
    description:
    'Hand-cut A5 Wagyu beef seasoned with truffle oil and quail egg.',
    ingredients: 'A5 Wagyu, Black Truffle, Quail Egg, Shallots, Capers'
  },
  {
    id: 2,
    title: 'Pan-Seared Scallops',
    price: '$38',
    description: 'Diver scallops served with cauliflower purée and caviar.',
    ingredients:
    'Hokkaido Scallops, Cauliflower, Osetra Caviar, Lemon Butter'
  },
  {
    id: 8,
    title: 'Oysters Rockefeller',
    price: '$32',
    description:
    'Fresh oysters baked with spinach, herbs, and parmesan crust.',
    ingredients:
    'Blue Point Oysters, Spinach, Pernod, Parmesan, Breadcrumbs'
  },
  {
    id: 10,
    title: 'Tuna Crudo',
    price: '$36',
    description: 'Yellowfin tuna with citrus, jalapeño, and microgreens.',
    ingredients: 'Yellowfin Tuna, Yuzu, Jalapeño, Microgreens, Sesame Oil'
  },
  {
    id: 11,
    title: 'Foie Gras Terrine',
    price: '$48',
    description: 'Silky foie gras with fig compote and toasted brioche.',
    ingredients: 'Foie Gras, Figs, Port Wine, Brioche, Sea Salt'
  }]

},
{
  name: 'Main Courses',
  items: [
  {
    id: 3,
    title: 'Lobster Thermidor',
    price: '$85',
    description: 'Whole Maine lobster with cognac cream sauce and gruyère.',
    ingredients: 'Maine Lobster, Cognac, Gruyère, Dijon Mustard, Tarragon'
  },
  {
    id: 4,
    title: 'Truffle Risotto',
    price: '$45',
    description:
    'Arborio rice slow-cooked with wild mushrooms and fresh black truffle.',
    ingredients:
    'Arborio Rice, Wild Mushrooms, Black Truffle, Parmigiano Reggiano'
  },
  {
    id: 5,
    title: 'Duck Confit',
    price: '$52',
    description:
    'Slow-cooked duck leg with cherry reduction and roasted root vegetables.',
    ingredients: 'Duck Leg, Cherries, Red Wine, Parsnips, Thyme'
  },
  {
    id: 7,
    title: 'Beef Wellington',
    price: '$95',
    description:
    'Prime beef tenderloin wrapped in puff pastry with mushroom duxelles.',
    ingredients:
    'Beef Tenderloin, Puff Pastry, Foie Gras, Wild Mushrooms, Madeira Sauce'
  },
  {
    id: 9,
    title: 'Lamb Rack',
    price: '$68',
    description:
    'Herb-crusted New Zealand lamb with rosemary jus and garlic confit.',
    ingredients: 'Lamb Rack, Rosemary, Garlic Confit, Dijon, Breadcrumbs'
  }]

},
{
  name: 'Desserts',
  items: [
  {
    id: 6,
    title: 'Chocolate Soufflé',
    price: '$24',
    description:
    'Dark chocolate soufflé with gold leaf and vanilla bean crème anglaise.',
    ingredients:
    '70% Dark Chocolate, Gold Leaf, Vanilla Bean, Free-range Eggs'
  },
  {
    id: 12,
    title: 'Crème Brûlée',
    price: '$18',
    description:
    'Classic vanilla custard with caramelized sugar and fresh berries.',
    ingredients:
    'Vanilla Bean, Heavy Cream, Egg Yolks, Demerara Sugar, Berries'
  }]

}];

export default function FullMenuPage({
  isOpen,
  onClose,
  onAddToCart
}) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[80]" />


          {/* Full Menu Container */}
          <motion.div
          initial={{
            opacity: 0,
            y: 100
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: 100
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="fixed inset-0 z-[90] flex flex-col">

            {/* Header */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-gold-400/20">
              <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 flex justify-between items-center">
                <div>
                  <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
                    Complete Menu
                  </h1>
                  <p className="text-white/50 font-sans text-sm">
                    Curated seasonal selections
                  </p>
                </div>
                <button
                onClick={onClose}
                className="p-3 text-white/50 hover:text-white hover:bg-white/5 transition-all rounded-sm">

                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-6xl mx-auto px-6 md:px-8 py-16">
                {MENU_CATEGORIES.map((category, categoryIndex) =>
              <motion.section
                key={category.name}
                initial={{
                  opacity: 0,
                  y: 30
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: categoryIndex * 0.1,
                  duration: 0.6
                }}
                className="mb-20 last:mb-0">

                    {/* Category Header */}
                    <div className="mb-12">
                      <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">
                        {category.name}
                      </h2>
                      <div className="w-16 h-[2px] bg-gold-400" />
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-8">
                      {category.items.map((item, itemIndex) =>
                  <motion.div
                    key={item.id}
                    initial={{
                      opacity: 0,
                      x: -20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    transition={{
                      delay: categoryIndex * 0.1 + itemIndex * 0.05,
                      duration: 0.5
                    }}
                    className="group relative">

                          <div className="flex items-start justify-between gap-8 pb-8 border-b border-white/5">
                            {/* Item Info */}
                            <div className="flex-1">
                              <div className="flex items-baseline gap-4 mb-3">
                                <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-gold-400 transition-colors">
                                  {item.title}
                                </h3>
                                <div className="flex-1 border-b border-dotted border-white/10 mb-1" />
                                <span className="text-gold-400 font-serif text-xl">
                                  {item.price}
                                </span>
                              </div>
                              <p className="text-white/60 font-sans text-sm mb-3 leading-relaxed">
                                {item.description}
                              </p>
                              <p className="text-white/40 font-sans text-xs italic">
                                {item.ingredients}
                              </p>
                            </div>

                            {/* Add Button */}
                            <button
                        onClick={() => {
                          onAddToCart(item);
                        }}
                        className="flex-shrink-0 px-6 py-2 border border-white/10 text-white hover:border-gold-400 hover:text-gold-400 transition-all text-xs uppercase tracking-widest group/btn">

                              <span className="flex items-center gap-2">
                                Add
                                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                              </span>
                            </button>
                          </div>
                        </motion.div>
                  )}
                    </div>
                  </motion.section>
              )}
              </div>
            </div>

            {/* Footer Note */}
            <div className="sticky bottom-0 bg-black/80 backdrop-blur-xl border-t border-white/5 py-6">
              <p className="text-center text-white/30 text-xs font-sans">
                All dishes are prepared fresh to order. Please inform your
                server of any dietary restrictions.
              </p>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}
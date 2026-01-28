import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Wine, Info } from 'lucide-react'

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
        ingredients: 'A5 Wagyu, Black Truffle, Quail Egg, Shallots, Capers',
        image:
          'https://images.unsplash.com/photo-1544025162-d76690b609aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 2,
        title: 'Pan-Seared Scallops',
        price: '$38',
        description: 'Diver scallops served with cauliflower purée and caviar.',
        ingredients:
          'Hokkaido Scallops, Cauliflower, Osetra Caviar, Lemon Butter',
        image:
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 8,
        title: 'Oysters Rockefeller',
        price: '$32',
        description:
          'Fresh oysters baked with spinach, herbs, and parmesan crust.',
        ingredients:
          'Blue Point Oysters, Spinach, Pernod, Parmesan, Breadcrumbs',
        image:
          'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 10,
        title: 'Tuna Crudo',
        price: '$36',
        description: 'Yellowfin tuna with citrus, jalapeño, and microgreens.',
        ingredients: 'Yellowfin Tuna, Yuzu, Jalapeño, Microgreens, Sesame Oil',
        image:
          'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 11,
        title: 'Foie Gras Terrine',
        price: '$48',
        description: 'Silky foie gras with fig compote and toasted brioche.',
        ingredients: 'Foie Gras, Figs, Port Wine, Brioche, Sea Salt',
        image:
          'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
    ],
  },
  {
    name: 'Main Courses',
    items: [
      {
        id: 3,
        title: 'Lobster Thermidor',
        price: '$85',
        description: 'Whole Maine lobster with cognac cream sauce and gruyère.',
        ingredients: 'Maine Lobster, Cognac, Gruyère, Dijon Mustard, Tarragon',
        image:
          'https://images.unsplash.com/photo-1553603227-2358a3a6d2b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 4,
        title: 'Truffle Risotto',
        price: '$45',
        description:
          'Arborio rice slow-cooked with wild mushrooms and fresh black truffle.',
        ingredients:
          'Arborio Rice, Wild Mushrooms, Black Truffle, Parmigiano Reggiano',
        image:
          'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 5,
        title: 'Duck Confit',
        price: '$52',
        description:
          'Slow-cooked duck leg with cherry reduction and roasted root vegetables.',
        ingredients: 'Duck Leg, Cherries, Red Wine, Parsnips, Thyme',
        image:
          'https://images.unsplash.com/photo-1518492104633-130d0cc84637?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 7,
        title: 'Beef Wellington',
        price: '$95',
        description:
          'Prime beef tenderloin wrapped in puff pastry with mushroom duxelles.',
        ingredients:
          'Beef Tenderloin, Puff Pastry, Foie Gras, Wild Mushrooms, Madeira Sauce',
        image:
          'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 9,
        title: 'Lamb Rack',
        price: '$68',
        description:
          'Herb-crusted New Zealand lamb with rosemary jus and garlic confit.',
        ingredients: 'Lamb Rack, Rosemary, Garlic Confit, Dijon, Breadcrumbs',
        image:
          'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
    ],
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
          '70% Dark Chocolate, Gold Leaf, Vanilla Bean, Free-range Eggs',
        image:
          'https://images.unsplash.com/photo-1579372786545-d24232daf58c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 12,
        title: 'Crème Brûlée',
        price: '$18',
        description:
          'Classic vanilla custard with caramelized sugar and fresh berries.',
        ingredients:
          'Vanilla Bean, Heavy Cream, Egg Yolks, Demerara Sugar, Berries',
        image:
          'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
    ],
  },
  {
    name: 'Beverages',
    items: [
      {
        id: 13,
        title: 'The Noir Martini',
        price: '$22',
        description:
          'Our signature cocktail with activated charcoal, gin, and dry vermouth.',
        ingredients:
          'Botanical Gin, Dry Vermouth, Activated Charcoal, Lemon Twist',
        image:
          'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 14,
        title: 'Smoked Old Fashioned',
        price: '$24',
        description:
          'Bourbon whiskey infused with hickory smoke and maple bitters.',
        ingredients:
          'Kentucky Bourbon, Maple Bitters, Hickory Smoke, Orange Peel',
        image:
          'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 15,
        title: 'Château Margaux 2015',
        price: '$450',
        description:
          'A premier grand cru classé from Bordeaux, France. Bottle only.',
        ingredients: 'Cabernet Sauvignon, Merlot, Petit Verdot, Cabernet Franc',
        image:
          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 16,
        title: 'Vintage Champagne',
        price: '$180',
        description:
          'Dom Pérignon Vintage 2012. Notes of white flowers and stone fruit.',
        ingredients: 'Chardonnay, Pinot Noir',
        image:
          'https://images.unsplash.com/photo-1598155523122-3842334d6c10?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      },
    ],
  },
]
const MENU_NOTES = [
  'All prices are per person | Service charge not included',
  'Our chef can accommodate vegetarian, vegan, and dietary restrictions with advance notice',
  'Wine pairings available starting from $65 per person',
  'Tasting menu experiences available upon request',
  'Menu items may vary based on seasonal availability',
  'Please inform our staff of any allergies',
]
export default function FullMenuPage({
  isOpen,
  onClose,
  onAddToCart,
}) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[80]"
          />
          {/* Full Menu Container */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] flex flex-col"
          >
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
                  className="p-3 text-white/50 hover:text-white hover:bg-white/5 transition-all rounded-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-6xl mx-auto px-6 md:px-8 py-16">
                {/* Menu Categories */}
                {MENU_CATEGORIES.map((category, categoryIndex) => (
                  <motion.section
                    key={category.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
                    className="mb-20"
                  >
                    {/* Category Header */}
                    <div className="mb-12">
                      <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">
                        {category.name}
                      </h2>
                      <div className="w-16 h-[2px] bg-gold-400" />
                    </div>
                    {/* Menu Items */}
                    <div className="space-y-8">
                      {category.items.map((item, itemIndex) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: categoryIndex * 0.1 + itemIndex * 0.05,
                            duration: 0.5,
                          }}
                          className="group relative"
                        >
                          <div className="flex flex-col md:flex-row items-start gap-8 pb-8 border-b border-white/5">
                            {/* Item Image */}
                            <div className="w-full md:w-32 h-32 flex-shrink-0 overflow-hidden rounded-sm bg-white/5">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            {/* Item Info */}
                            <div className="flex-1 w-full">
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
                              onClick={() => onAddToCart(item)}
                              className="flex-shrink-0 px-6 py-2 border border-white/10 text-white hover:border-gold-400 hover:text-gold-400 transition-all text-xs uppercase tracking-widest group/btn mt-4 md:mt-0"
                            >
                              <span className="flex items-center gap-2">
                                Add
                                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                ))}
                {/* Menu Notes Section */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mb-20 pt-8 border-t border-gold-400/20"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Info className="w-5 h-5 text-gold-400" />
                    <h2 className="text-2xl font-serif text-white">Menu Notes</h2>
                  </div>
                  
                  <ul className="space-y-4">
                    {MENU_NOTES.map((note, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="flex items-start gap-4 text-white/70 font-sans text-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                        <span>{note}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.section>
                {/* Wine Program Section */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="mb-20 bg-zinc-900/50 border border-white/5 p-8 md:p-12"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Wine className="w-6 h-6 text-gold-400" />
                    <h2 className="text-3xl font-serif text-white">Wine Program</h2>
                  </div>
                  
                  <p className="text-white/70 font-sans leading-relaxed mb-10 max-w-3xl">
                    Our award-winning sommelier has curated an extensive wine collection featuring over 400 selections from regions around the world. Expert recommendations and pairings are available for every dish.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Wine Pairing Options */}
                    <div>
                      <h3 className="text-gold-400 uppercase tracking-widest text-xs font-bold mb-6">
                        Wine Pairing Options
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-center justify-between pb-3 border-b border-white/5">
                          <span className="text-white font-serif">Sommelier's Selection</span>
                          <span className="text-gold-400 font-serif">$65/person</span>
                        </li>
                        <li className="flex items-center justify-between pb-3 border-b border-white/5">
                          <span className="text-white font-serif">Premium Pairing</span>
                          <span className="text-gold-400 font-serif">$95/person</span>
                        </li>
                        <li className="flex items-center justify-between pb-3 border-b border-white/5">
                          <span className="text-white font-serif">À la Carte</span>
                          <span className="text-white/50 font-sans text-sm italic">wine list available</span>
                        </li>
                      </ul>
                    </div>
                    {/* Private Wine Selection */}
                    <div>
                      <h3 className="text-gold-400 uppercase tracking-widest text-xs font-bold mb-6">
                        Private Wine Selection
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-4 text-white/70 font-sans text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                          <span>Corkage fee waived for selections from our list</span>
                        </li>
                        <li className="flex items-start gap-4 text-white/70 font-sans text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                          <span>Special requests accommodated in advance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.section>
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
      )}
    </AnimatePresence>
  )
}
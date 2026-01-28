import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Wine, ChefHat, Clock, Utensils, Cake, Martini, ShoppingBag } from 'lucide-react'

const FULL_MENU = {
  starters: [
    {
      name: 'Amuse-Bouche Selection',
      price: 'Complimentary',
      description: 'Chef\'s seasonal selection of bite-sized creations to awaken the palate',
      image: 'https://i.pinimg.com/736x/0e/e2/e5/0ee2e5145bf9741a744873a2423cd9d4.jpg'
    },
    {
      name: 'Wagyu Tartare',
      price: '$42',
      description: 'Hand-cut A5 Wagyu beef, truffle oil, quail egg, shallots, capers',
      image: 'https://i.pinimg.com/736x/28/32/85/283285a4051423e8e93ce48ad2ff3bfe.jpg'
    },
    {
      name: 'Pan-Seared Foie Gras',
      price: '$48',
      description: 'Hudson Valley foie gras, brioche croutons, cherry gastrique, micro greens',
      image: 'https://i.pinimg.com/736x/a4/45/79/a445798a6e3e724d41c47fb40f91f86e.jpg'
    },
    {
      name: 'Oyster Trio',
      price: '$38',
      description: 'Three varieties from the finest oyster beds, mignonette, champagne vinegar',
      image: 'https://i.pinimg.com/736x/68/49/4c/68494c5d5766d37e5f458c7a4f22f726.jpg'
    },
    {
      name: 'Burrata & Heirloom Tomato',
      price: '$22',
      description: 'Creamy burrata, heirloom tomatoes, aged balsamic, basil oil, sea salt',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Lobster Bisque',
      price: '$26',
      description: 'Silky Maine lobster bisque, crispy bacon, truffle foam',
      image: 'https://i.pinimg.com/736x/74/4c/b1/744cb1dd548cf968adb9f348c7637aee.jpg'
    },
    {
      name: 'Seared Scallops',
      price: '$38',
      description: 'Hokkaido scallops, cauliflower purée, ossetra caviar, brown butter',
      image: 'https://i.pinimg.com/736x/b6/a1/da/b6a1dadf70f1d714940af2d5834b4520.jpg'
    }
  ],
  mains: [
    {
      name: 'Pan-Seared Diver Scallops',
      price: '$52',
      description: 'Hokkaido diver scallops, saffron risotto, asparagus, beurre blanc',
      image: 'https://i.pinimg.com/736x/4b/e6/f8/4be6f8018edb4902864ec3fbcde9c4a5.jpg'
    },
    {
      name: 'Lobster Thermidor',
      price: '$85',
      description: 'Whole Maine lobster, cognac cream sauce, gruyère, tarragon, pommes anna',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Dry-Aged Ribeye',
      price: '$78',
      description: '28-day dry-aged ribeye, roasted bone marrow, wild mushrooms, béarnaise',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Filet Mignon',
      price: '$72',
      description: 'Prime beef tenderloin, truffle mashed potatoes, roasted vegetables, demi-glace',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Rack of Lamb',
      price: '$65',
      description: 'Herb-crusted lamb, rosemary jus, flageolet beans, gratin dauphinois',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Dover Sole Meunière',
      price: '$62',
      description: 'Whole Dover sole, brown butter, capers, lemon, haricots verts',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Duck Breast',
      price: '$58',
      description: 'Magret de canard, cherry gastrique, duck leg confit, seasonal vegetables',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Venison Wellington',
      price: '$82',
      description: 'Scottish venison, mushroom duxelles, puff pastry, red wine reduction',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Branzino en Croûte de Sel',
      price: '$56',
      description: 'Sea bream baked in sea salt crust, fennel, heirloom potatoes',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  desserts: [
    {
      name: 'Grand Marnier Soufflé',
      price: '$18',
      description: '20-minute preparation. Light and airy soufflé with Grand Marnier liqueur, Grand Marnier sauce',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Chocolate Torte',
      price: '$16',
      description: 'Rich dark chocolate cake, raspberry coulis, whipped cream, gold leaf',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Crème Brûlée',
      price: '$14',
      description: 'Vanilla bean crème brûlée, caramelized sugar crust, fresh berries',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Lemon Tart',
      price: '$15',
      description: 'Shortcrust pastry, tart lemon curd, Italian meringue, candied lemon',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Panna Cotta',
      price: '$13',
      description: 'Silky panna cotta, berry coulis, pistachio crumble, edible flowers',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Cheese Course',
      price: '$22',
      description: 'Artisanal selection of French and international cheeses, fresh fruits, crackers',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Chocolate Mousse',
      price: '$14',
      description: 'Valrhona chocolate mousse, hazelnut praline, cocoa nibs, gold dust',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  drinks: [
    {
      name: 'Champagne & Sparkling',
      items: [
        'Champagne Billecart-Salmon Brut - $95/glass',
        'Krug Clos d\'Ambonnay - $125/glass',
        'Dom Pérignon 2012 - $145/glass',
        'Laurent-Perrier Ultra Brut - $85/glass'
      ]
    },
    {
      name: 'White Wine',
      items: [
        'Chablis Grand Cru - William Fèvre - $65/glass',
        'Puligny-Montrachet - $95/glass',
        'Condrieu - Yalumba - $75/glass',
        'Sancerre - Alphonse Mellot - $55/glass'
      ]
    },
    {
      name: 'Red Wine',
      items: [
        'Pauillac - Château Lynch-Bages - $85/glass',
        'Barolo - Gaja Barbaresco - $105/glass',
        'Super Tuscan - Tignanello - $95/glass',
        'Napa Valley Cabernet - Opus One - $115/glass'
      ]
    },
    {
      name: 'Cocktails',
      items: [
        'Classic Martini - $18',
        'Old Fashioned - $16',
        'Champagne Cocktail - $20',
        'Negroni - $17',
        'Manhattan - $18'
      ]
    }
  ]
}

export default function MenuPage({ addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('starters')

  const categories = [
    { id: 'starters', label: 'Starters', icon: Utensils },
    { id: 'mains', label: 'Main Courses', icon: Wine },
    { id: 'desserts', label: 'Desserts', icon: Cake },
    { id: 'drinks', label: 'Beverages', icon: Martini }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="relative h-72 overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10" />
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
              filter: 'brightness(0.5) contrast(1.1)'
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6"
        >
          <ChefHat className="w-16 h-16 text-gold-400 mb-4" />
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-white/70">A culinary journey crafted with passion and precision</p>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Menu Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-white/70 text-lg leading-relaxed">
            Our menu is a reflection of the season, showcasing the finest ingredients
            sourced from local farmers, international suppliers, and sustainable fisheries.
          </p>
          <div className="flex items-center justify-center gap-2 text-gold-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>Dining experience: 2.5 - 3 hours | Wine pairings available</span>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold uppercase text-sm tracking-widest transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gold-400 text-black'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {category.label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          key={selectedCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {selectedCategory !== 'drinks' ? (
            FULL_MENU[selectedCategory].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="border-b border-white/10 pb-12 last:border-b-0 group"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Image */}
                  {item.image && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="md:col-span-1 overflow-hidden rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition-opacity duration-300"
                      />
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className={item.image ? 'md:col-span-2' : 'md:col-span-3'} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-2xl font-serif text-white mb-2">{item.name}</h3>
                      </div>
                      <span className="text-gold-400 font-semibold whitespace-nowrap text-lg">{item.price}</span>
                    </div>
                    
                    <p className="text-white/70 text-sm leading-relaxed mb-4 flex-1">{item.description}</p>
                    
                    {/* Add to Cart Button */}
                    {item.price !== 'Complimentary' && addToCart && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToCart({
                          id: item.name,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          description: item.description
                        })}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-black font-bold rounded-lg transition-all duration-300 border border-gold-300 shadow-lg hover:shadow-gold-400/50 uppercase tracking-wide text-sm"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            FULL_MENU.drinks.map((section, sectionIndex) => (
              <motion.div key={sectionIndex} variants={itemVariants} className="space-y-4">
                <h3 className="text-2xl font-serif text-gold-400 mb-6 flex items-center gap-2">
                  <Wine className="w-6 h-6" />
                  {section.name}
                </h3>
                <div className="space-y-3 ml-4 border-l-2 border-gold-400/30 pl-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center">
                      <span className="text-white/80">{item.split(' - ')[0]}</span>
                      <span className="text-gold-400 font-semibold">{item.split(' - ')[1]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Notes Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 space-y-4"
        >
          <h3 className="text-xl font-serif text-gold-400">Menu Notes</h3>
          <div className="space-y-2 text-white/70 text-sm">
            <p>• All prices are per person | Service charge not included</p>
            <p>• Our chef can accommodate vegetarian, vegan, and dietary restrictions with advance notice</p>
            <p>• Wine pairings available starting from $65 per person</p>
            <p>• Tasting menu experiences available upon request</p>
            <p>• Menu items may vary based on seasonal availability</p>
            <p>• Please inform our staff of any allergies</p>
          </div>
        </motion.section>

        {/* Wine Program */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-gold-400/10 to-transparent rounded-lg p-8 border border-gold-400/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <Wine className="w-6 h-6 text-gold-400" />
            <h3 className="text-2xl font-serif text-gold-400">Wine Program</h3>
          </div>
          <p className="text-white/80 mb-4">
            Our award-winning sommelier has curated an extensive wine collection featuring over 400 selections
            from regions around the world. Expert recommendations and pairings are available for every dish.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white font-semibold mb-2">Wine Pairing Options:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Sommelier's Selection - $65/person</li>
                <li>• Premium Pairing - $95/person</li>
                <li>• À la Carte wine list available</li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Private Wine Selection:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Corkage fee waived for selections from our list</li>
                <li>• Special requests accommodated in advance</li>
              </ul>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react'
export default function Footer() {
  return (
<footer className="bg-zinc-900 border-t border-gold-400/20 pt-20 pb-10 px-6 relative z-10">
<div className="absolute top-0 left-0 w-full h-[2px] 
    bg-gradient-to-r from-transparent via-gold-400 to-transparent">
  </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold tracking-tighter text-white">
              NOIR
            </h2>
            <p className="text-white/60 font-sans text-sm leading-relaxed max-w-xs">
              An immersive dining experience where culinary excellence meets
              cinematic elegance.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-white/5 rounded-full text-white/60 hover:text-gold-400 hover:bg-white/10 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 rounded-full text-white/60 hover:text-gold-400 hover:bg-white/10 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 rounded-full text-white/60 hover:text-gold-400 hover:bg-white/10 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h3 className="text-gold-400 uppercase tracking-widest text-xs font-bold">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70 hover:text-white transition-colors">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  123 Noir Street, Downtown District
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-sm">reservations@noirdining.com</span>
              </li>
            </ul>
          </div>

          {/* Hours Column */}
          <div className="space-y-6">
            <h3 className="text-gold-400 uppercase tracking-widest text-xs font-bold">
              Hours
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70">
                <Clock className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-white mb-1">Tuesday - Saturday</p>
                  <p className="text-white/50">17:00 - 23:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <div className="w-5 h-5 flex-shrink-0" /> {/* Spacer */}
                <div className="text-sm">
                  <p className="text-white mb-1">Sunday - Monday</p>
                  <p className="text-white/50">Closed for Private Events</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-6">
            <h3 className="text-gold-400 uppercase tracking-widest text-xs font-bold">
              Newsletter
            </h3>
            <p className="text-white/60 font-sans text-sm">
              Subscribe for seasonal menu updates and exclusive event
              invitations.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400 transition-colors"
              />
              <button className="w-full bg-gold-400 text-black font-serif font-bold uppercase tracking-widest text-xs py-3 hover:bg-white transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30 font-sans">
          <p>
            &copy; {new Date().getFullYear()} NOIR Dining Experience. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

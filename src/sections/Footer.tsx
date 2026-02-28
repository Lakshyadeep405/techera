import { motion } from 'framer-motion';
import {
  Code2,
  Github,
  Mail,
  Phone,
  Heart
} from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { label: 'Home', href: '#' },
    { label: 'Contests', href: '#' },
    { label: 'Leaderboard', href: '#' },
    { label: 'About', href: '#' },
  ];

  const features = [
    { label: '8+ Languages', href: '#' },
    { label: 'Live Judging', href: '#' },
    { label: 'Real-time Leaderboard', href: '#' },
    { label: 'Auto Scoring', href: '#' },
  ];

  return (
    <footer className="relative bg-black border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Code2 className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">
                DEBUGX
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/30 mb-6 max-w-sm"
            >
              Compete in live coding contests, solve algorithmic challenges,
              and climb the leaderboard. Code bold, debug harder.
            </motion.p>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3 text-white/30">
                <Mail className="w-4 h-4 text-white/50" />
                <span className="text-sm">lakshyadeep405@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/30">
                <Phone className="w-4 h-4 text-white/50" />
                <span className="text-sm">9835508134</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/30 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-3">
              {features.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/30 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-white/40 fill-current" /> by Lakshyadeep
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <motion.a
                href="https://github.com/Lakshyadeep405"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Github"
              >
                <Github className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

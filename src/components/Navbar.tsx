import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Menu, X, Sun, Moon, Lock, ArrowUpRight, ShieldCheck, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Profile, SiteSettings } from '../types';

interface NavbarProps {
  profile: Profile;
  settings: SiteSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onOpenCV?: () => void;
}

export default function Navbar({ profile, settings, onOpenAdmin, isAdminLoggedIn, onOpenCV }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'services', 'skills', 'work', 'clients', 'testimonials', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#home', id: 'home' },
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'SERVICES', href: '#services', id: 'services' },
    { label: 'WORK', href: '#work', id: 'work' },
    { label: 'CLIENTS', href: '#clients', id: 'clients' },
    { label: 'TESTIMONIALS', href: '#testimonials', id: 'testimonials' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      {/* Scroll Progress Bar at the very top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#FF3B30] origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo matching Axel Morgan reference: Name with red accent dot */}
          <a
            id="nav-logo"
            href="#home"
            className="flex items-center gap-1.5 group focus:outline-hidden"
          >
            <span className="font-extrabold text-neutral-950 dark:text-white tracking-[0.18em] text-base uppercase transition-colors">
              {profile.name || 'MD. JOBAER'}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] inline-block animate-pulse" />
          </a>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.label}
                  id={`nav-link-${item.id}`}
                  href={item.href}
                  className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-colors py-1 relative ${
                    isActive
                      ? 'text-neutral-950 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FF3B30]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>

            {/* Admin CMS Access Indicator */}
            <button
              id="nav-admin-btn"
              onClick={onOpenAdmin}
              title={isAdminLoggedIn ? 'Admin CMS (Logged In)' : 'Admin CMS Login'}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors border ${
                isAdminLoggedIn
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {isAdminLoggedIn ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>

            {/* Reference CTA Button: LET'S TALK ↗ */}
            <a
              id="nav-contact-btn"
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all shadow-xs"
            >
              <span>{settings.lets_talk_label || "LET'S TALK"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-6 py-6 space-y-4 shadow-xl"
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold tracking-widest text-neutral-800 dark:text-neutral-200 hover:text-[#FF3B30] uppercase py-1"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              {onOpenCV && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCV();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[#FF3B30] border border-red-500/30 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </button>
              )}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider"
              >
                <span>LET'S TALK</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
}

import { motion } from 'motion/react';
import { ArrowUp, Linkedin, Youtube, Mail, Phone, MapPin, Lock, ShieldCheck } from 'lucide-react';
import { Profile, SocialLink, SiteSettings } from '../types';

interface FooterProps {
  profile: Profile;
  socialLinks: SocialLink[];
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export default function Footer({ profile, socialLinks, settings, onOpenAdmin }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Clients', href: '#clients' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const serviceItems = [
    'Hardware Diagnostics & Repair',
    'Enterprise Cisco Networking',
    'Web Architecture & Development',
    'CCTV Security & Surveillance',
    'Digital Marketing & Lead Gen',
  ];

  const linkedinUrl = socialLinks.find((s) => s.platform.toLowerCase().includes('linkedin'))?.url || 'https://www.linkedin.com/in/md-jobaer-ahamed-82a382186';
  const youtubeUrl = socialLinks.find((s) => s.platform.toLowerCase().includes('youtube'))?.url || 'https://www.youtube.com/@user-ed1sz1sx4i';

  return (
    <footer className="bg-neutral-950 text-white pt-20 pb-12 border-t border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid matching reference footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-900">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-[0.18em] uppercase text-white">
                {profile.name || 'MD. JOBAER'}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-normal max-w-sm">
              IT Support Engineer specializing in enterprise Cisco networks, comprehensive PC hardware troubleshooting, CCTV infrastructure, and web solutions in Riyadh, Saudi Arabia.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-[#FF3B30] text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-[#FF3B30] text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${profile.email || 'Jidny7080@gmail.com'}`}
                aria-label="Email"
                className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-[#FF3B30] text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-400 mb-4">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-400 mb-4">
              SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              {serviceItems.map((item) => (
                <li key={item} className="py-0.5">
                  <span className="hover:text-white transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-400 mb-4">
              CONTACT
            </h4>
            <p className="text-xs text-neutral-300 font-medium">
              <a href={`mailto:${profile.email || 'Jidny7080@gmail.com'}`} className="hover:text-[#FF3B30] transition-colors">
                {profile.email || 'Jidny7080@gmail.com'}
              </a>
            </p>
            <p className="text-xs text-neutral-300 font-medium">
              <a href={`tel:${profile.phone || '0538196763'}`} className="hover:text-[#FF3B30] transition-colors">
                {profile.phone || '0538196763'}
              </a>
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-normal">
              {profile.location || 'Al Aziziyah, Riyadh, Saudi Arabia (KSA)'}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Transferable Iqama
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Back to Top, Admin Lock */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} {profile.name || 'Md. Jobaer'}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 transition-colors"
              title="Admin CMS Control Panel"
            >
              <Lock className="w-3.5 h-3.5 text-[#FF3B30]" />
              <span className="text-[11px] uppercase tracking-wider font-bold">Admin CMS</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-[11px] uppercase tracking-wider font-bold">Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

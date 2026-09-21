import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Linkedin, Youtube, ArrowUpRight } from 'lucide-react';
import { Profile, SocialLink } from '../types';
import { api } from '../services/api';

interface ContactSectionProps {
  profile: Profile;
  socialLinks: SocialLink[];
}

export default function ContactSection({ profile, socialLinks }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project_type: 'IT Infrastructure & Support',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const linkedinLink = socialLinks.find(s => s.platform.toLowerCase().includes('linkedin'))?.url || 'https://www.linkedin.com/in/md-jobaer-ahamed-82a382186';
  const youtubeLink = socialLinks.find(s => s.platform.toLowerCase().includes('youtube'))?.url || 'https://www.youtube.com/@user-ed1sz1sx4i';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.submitContact(formData);
      setSuccessMessage(res.message || 'Thank you! Your message has been received.');
      setFormData({
        name: '',
        email: '',
        project_type: 'IT Infrastructure & Support',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-[#FAFAFA] dark:bg-[#0E0E0E] border-b border-neutral-200/80 dark:border-neutral-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Marker: • CONTACT */}
        <div className="flex items-center gap-2 mb-10">
          <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
            CONTACT
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ==================================================== */}
          {/* LEFT: Heading, Direct Contacts, Availability        */}
          {/* ==================================================== */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 dark:text-white uppercase tracking-tight leading-tight mb-4">
                GET IN TOUCH & DISCUSS OPPORTUNITIES
              </h2>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 font-normal">
                Looking to hire a dedicated IT Support Engineer with a valid 9-month transferable Iqama in Riyadh, or need network engineering and system troubleshooting? Reach out directly.
              </p>

              {/* Direct Info List */}
              <div className="space-y-4 mb-8">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-sky-500 transition-all p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-sky-400/50 hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Direct Email</span>
                    <span className="font-mono font-medium">{profile.email}</span>
                  </div>
                </a>

                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-emerald-500 transition-all p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-emerald-400/50 hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Phone & WhatsApp</span>
                    <span className="font-mono font-medium">{profile.phone}</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Location Base</span>
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>

              {/* Social Channels with authentic brand colors */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 text-xs font-bold text-[#0A66C2] dark:text-blue-400 hover:bg-[#0A66C2] hover:text-white transition-all shadow-xs"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn Profile</span>
                </a>

                <a
                  href={youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-500/10 dark:bg-red-500/15 border border-red-500/30 text-xs font-bold text-[#FF0000] dark:text-red-400 hover:bg-[#FF0000] hover:text-white transition-all shadow-xs"
                >
                  <Youtube className="w-4 h-4" />
                  <span>YouTube Channel</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* ==================================================== */}
          {/* RIGHT: High-Contrast Minimalist Contact Form        */}
          {/* ==================================================== */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
              
              <h3 className="text-xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-8 font-normal">
                Submissions are delivered directly to Md. Jobaer's administrative inbox.
              </p>

              {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center gap-3 text-red-800 dark:text-red-300 text-xs font-bold">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Al-Otaibi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-medium focus:outline-hidden focus:border-[#FF3B30] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-medium focus:outline-hidden focus:border-[#FF3B30] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Inquiry Type / Opportunity
                  </label>
                  <select
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-medium focus:outline-hidden focus:border-[#FF3B30] transition-colors"
                  >
                    <option value="Full-Time IT Support Role">Full-Time IT Support Role (Riyadh)</option>
                    <option value="IT Infrastructure & Support">IT Infrastructure & Support</option>
                    <option value="Cisco Networking & Setup">Cisco Networking & Setup</option>
                    <option value="CCTV Security Installation">CCTV Security Installation</option>
                    <option value="Web Development Project">Web Development Project</option>
                    <option value="Digital Marketing & Lead Gen">Digital Marketing & Lead Gen</option>
                    <option value="General Inquiry">General Technical Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about the role, location, or technical requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-medium focus:outline-hidden focus:border-[#FF3B30] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-black uppercase tracking-[0.18em] hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Transmitting Message...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

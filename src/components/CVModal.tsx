import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Profile, Experience, Education, Certification, Skill } from '../types';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  experience?: Experience[];
  education?: Education[];
  certifications?: Certification[];
  skills?: Skill[];
}

export default function CVModal({
  isOpen,
  onClose,
  profile,
  experience = [],
  education = [],
  certifications = [],
  skills = [],
}: CVModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const cvText = `
=====================================================
CURRICULUM VITAE: ${profile.name.toUpperCase()}
${profile.professional_title.toUpperCase()}
=====================================================

CONTACT INFORMATION:
- Location: ${profile.location}
- Phone / WhatsApp: ${profile.phone}
- Email: ${profile.email}
- Iqama Status: ${profile.iqama_status}
- LinkedIn: https://www.linkedin.com/in/md-jobaer-ahamed-82a382186
- YouTube: https://www.youtube.com/@user-ed1sz1sx4i

PROFESSIONAL SUMMARY:
${profile.short_intro}

CORE COMPETENCIES & TECHNICAL SKILLS:
${skills.map((s) => `• ${s.name} (${s.category})`).join('\n')}

PROFESSIONAL EXPERIENCE:
${experience
  .map(
    (exp) => `
Position: ${exp.position}
Company: ${exp.company} | ${exp.location}
Period: ${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date}
Responsibilities:
${(exp.responsibilities || []).map((r) => `  - ${r}`).join('\n')}
`
  )
  .join('\n')}

EDUCATION:
${education
  .map(
    (edu) => `
Degree: ${edu.degree}
Institution: ${edu.institution}, ${edu.location}
Period: ${edu.start_year} - ${edu.end_year} | CGPA: ${edu.grade || 'N/A'}
`
  )
  .join('\n')}

CERTIFICATIONS:
${certifications
  .map((cert) => `• ${cert.name} - Issued by ${cert.issuer} (${cert.issue_date})`)
  .join('\n')}
    `.trim();

    navigator.clipboard.writeText(cvText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDirectDownload = () => {
    if (profile.resume_url && profile.resume_url.trim() !== '') {
      window.open(profile.resume_url, '_blank');
      return;
    }

    const cvContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${profile.name} | CV</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; padding: 32px; color: #111827; }
      h1, h2 { margin-bottom: 8px; }
      .meta { color: #4b5563; }
      ul { margin-top: 0; }
    </style>
  </head>
  <body>
    <h1>${profile.name}</h1>
    <div class="meta">${profile.professional_title}</div>
    <p>${profile.location} | ${profile.phone} | ${profile.email}</p>
    <p>${profile.short_intro}</p>
    <h2>Skills</h2>
    <ul>${skills.map((s) => `<li>${s.name} (${s.category})</li>`).join('')}</ul>
    <h2>Experience</h2>
    <ul>${experience.map((exp) => `<li>${exp.position} at ${exp.company}</li>`).join('')}</ul>
    <h2>Education</h2>
    <ul>${education.map((edu) => `<li>${edu.degree} - ${edu.institution}</li>`).join('')}</ul>
  </body>
</html>`;

    const blob = new Blob([cvContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Md_Jobaer_IT_Support_Engineer_CV.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div
        id="cv-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          id="cv-modal-content"
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-white dark:bg-[#121212] text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header Action Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-neutral-800 dark:text-neutral-200">
                Official Curriculum Vitae
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                Verified Candidate
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Copy Full CV Text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDirectDownload}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FF3B30] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                title="Download CV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-1 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Document Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 print:p-0">
            {/* Header: Candidate Info */}
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                    {profile.name}
                  </h1>
                  <p className="text-sm font-bold text-[#FF3B30] uppercase tracking-wider mt-1">
                    {profile.professional_title}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {profile.supporting_line}
                  </p>
                </div>

                <div className="sm:text-right space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                  <div className="flex items-center sm:justify-end gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FF3B30]" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-mono font-medium">{profile.phone}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-2">
                    <Mail className="w-3.5 h-3.5 text-sky-500" />
                    <span className="font-mono font-medium">{profile.email}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{profile.iqama_status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#FF3B30]">
                Professional Summary
              </h2>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
                {profile.about_description || profile.short_intro}
              </p>
            </div>

            {/* Core Competencies */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#FF3B30]">
                Core Competencies & Technical Skills
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/70 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block leading-tight">
                        {skill.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#FF3B30] flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Professional Experience</span>
              </h2>

              <div className="space-y-4">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                          {exp.position}
                        </h3>
                        <p className="text-xs font-bold text-[#FF3B30] uppercase tracking-wider">
                          {exp.company} • <span className="text-neutral-500 font-medium">{exp.location}</span>
                        </p>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 self-start sm:self-auto">
                        {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                    </div>

                    {exp.responsibilities && (
                      <ul className="mt-3 space-y-1.5">
                        {exp.responsibilities.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                            <span className="text-[#FF3B30] font-bold mt-0.5">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Certifications */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#FF3B30] flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Certifications</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 flex items-start justify-between gap-2"
                  >
                    <div>
                      <h4 className="text-xs font-black uppercase text-neutral-950 dark:text-white">
                        {cert.name}
                      </h4>
                      <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">
                        {cert.issuer} • <span className="font-mono">{cert.issue_date}</span>
                      </p>
                      {cert.description && (
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                          {cert.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Education */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#FF3B30] flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Academic Education</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        {edu.start_year} – {edu.end_year}
                      </span>
                      {edu.grade && (
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                          CGPA: {edu.grade}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black uppercase text-neutral-950 dark:text-white">
                      {edu.degree}
                    </h4>
                    <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">
                      {edu.institution}, {edu.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Notice */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>References, certificates, and academic transcripts available upon request.</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/md-jobaer-ahamed-82a382186"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#0A66C2] hover:underline inline-flex items-center gap-1"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span>•</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="font-bold text-[#FF3B30] hover:underline"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

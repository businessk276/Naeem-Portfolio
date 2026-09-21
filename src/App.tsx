import { useState, useEffect } from 'react';
import { PortfolioData, Project, YouTubeVideo } from './types';
import { api } from './services/api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import WhatIDo from './components/WhatIDo';
import FeaturedWork from './components/FeaturedWork';
import AchievementsStats from './components/AchievementsStats';
import MyProcess from './components/MyProcess';
import InsightsVideos from './components/InsightsVideos';
import ExperienceEducation from './components/ExperienceEducation';
import HobbiesActivities from './components/HobbiesActivities';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ProjectDetailModal from './components/ProjectDetailModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import CVModal from './components/CVModal';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & Active Overlays
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showCVModal, setShowCVModal] = useState(false);

  // Admin State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('mj_admin_token');
  });

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const data = await api.getPortfolio();
      setPortfolio(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to portfolio server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleOpenAdmin = () => {
    if (adminToken) {
      setShowAdminDashboard(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('mj_admin_token', token);
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('mj_admin_token');
    setShowAdminDashboard(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-3 border-neutral-300 dark:border-neutral-700 border-t-[#FF3B30] animate-spin mb-4" />
        <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
          MD. JOBAER • PORTFOLIO
        </span>
        <span className="text-[11px] text-neutral-500 mt-1 uppercase tracking-widest font-mono">
          Loading Infrastructure Systems...
        </span>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-[#FF3B30] flex items-center justify-center mx-auto mb-4 font-bold text-lg">
            !
          </div>
          <h2 className="text-base font-black uppercase tracking-wider text-neutral-950 dark:text-white mb-2">
            System Communication Error
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 font-normal leading-relaxed">
            {error || 'Unable to retrieve portfolio records. Please ensure the backend service is operational.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider hover:opacity-90"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      
      {/* Navigation Header with Top Scroll Progress */}
      <Navbar
        profile={portfolio.profile}
        settings={portfolio.settings}
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={!!adminToken}
        onOpenCV={() => setShowCVModal(true)}
      />

      {/* 1. Hero Section (Replicating exact reference design with circular image animation) */}
      <Hero
        profile={portfolio.profile}
        socialLinks={portfolio.social_links}
        onOpenAbout={() => {
          const el = document.getElementById('about');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCV={() => setShowCVModal(true)}
      />

        {/* 2. About Me (Matching exact second section of reference design) */}
        <AboutMe profile={portfolio.profile} />

        {/* 3. Services & Skills That Drive Impact (Matching 5-column services & animated progress lines) */}
        <WhatIDo
          services={portfolio.services}
          skills={portfolio.skills}
        />

        {/* 4. Featured Work (Matching 4-card layout: NORTH EDGE, BOLD BY NATURE, DISCIPLINE OVER MOTIVATION, KION) */}
        <FeaturedWork
          projects={portfolio.projects}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />

        {/* 5. Trusted By / Achievements, What Clients Say (Testimonials), and Extraordinary CTA Banner */}
        <AchievementsStats
          awards={portfolio.awards}
          testimonials={portfolio.testimonials}
        />

        {/* 6. My Process: 5-step engineering roadmap */}
        <MyProcess steps={portfolio.process_steps} />

        {/* 7. Insights & YouTube Video System */}
        <InsightsVideos
          videos={portfolio.youtube_videos || portfolio.videos || []}
          onPlayVideo={(vid) => setSelectedVideo(vid)}
        />

        {/* 8. Career & Academic Experience */}
        <ExperienceEducation
          experience={portfolio.experience}
          education={portfolio.education}
          certifications={portfolio.certifications}
        />

        {/* 9. Extra-Curricular Leadership & Hobbies */}
        <HobbiesActivities
          activities={portfolio.activities}
          hobbies={portfolio.hobbies}
        />

        {/* 10. Contact Section & Direct Transmission Form */}
        <ContactSection
          profile={portfolio.profile}
          socialLinks={portfolio.social_links}
        />

        {/* 11. Footer matching exact reference dark footer */}
        <Footer
          profile={portfolio.profile}
          socialLinks={portfolio.social_links}
          settings={portfolio.settings}
          onOpenAdmin={handleOpenAdmin}
        />

        {/* Modals */}
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}

        {selectedVideo && (
          <VideoPlayerModal
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}

        {showAdminLogin && (
          <AdminLogin
            onLoginSuccess={(token) => handleAdminLoginSuccess(token)}
            onClose={() => setShowAdminLogin(false)}
          />
        )}

        {showAdminDashboard && adminToken && (
          <AdminDashboard
            token={adminToken}
            onLogout={handleAdminLogout}
            onRefreshPublicData={fetchPortfolio}
            onCloseAdmin={() => setShowAdminDashboard(false)}
          />
        )}

        {/* Official Curriculum Vitae Modal */}
        {showCVModal && (
          <CVModal
            isOpen={showCVModal}
            onClose={() => setShowCVModal(false)}
            profile={portfolio.profile}
            experience={portfolio.experience}
            education={portfolio.education}
            certifications={portfolio.certifications}
            skills={portfolio.skills}
          />
        )}

      </div>
  );
}

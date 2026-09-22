import { useEffect, useState } from 'react';
import { PortfolioData, Project, YouTubeVideo } from './types';
import { portfolioData } from './data/portfolio';
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
import AdminPanel from './components/AdminPanel';
import { getRemotePortfolio } from './lib/portfolio';

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(portfolioData);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);
  const [showAdmin, setShowAdmin] = useState(() => window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => setShowAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    getRemotePortfolio()
      .then((remote) => {
        if (remote) setPortfolio(remote);
      })
      .catch((error) => console.warn('Using local portfolio data:', error))
      .finally(() => setIsLoadingPortfolio(false));
  }, []);

  // Modals & Active Overlays
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showCVModal, setShowCVModal] = useState(false);

  const handleOpenAdmin = () => {
    const adminUrl = `${window.location.origin}${window.location.pathname}#admin`;
    const adminWindow = window.open(adminUrl, '_blank', 'noopener,noreferrer');

    if (!adminWindow) {
      setShowAdmin(true);
    }
  };

  const handleCloseAdmin = () => {
    setShowAdmin(false);
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  if (isLoadingPortfolio) {
    return <div className="flex min-h-screen items-center justify-center bg-white text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 dark:bg-[#0A0A0A]">Loading portfolio...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      
      {/* Navigation Header with Top Scroll Progress */}
      <Navbar
        profile={portfolio.profile}
        settings={portfolio.settings}
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={false}
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

        {showAdmin && (
          <AdminPanel
            portfolio={portfolio}
            onClose={handleCloseAdmin}
            onPublished={setPortfolio}
          />
        )}

      </div>
  );
}

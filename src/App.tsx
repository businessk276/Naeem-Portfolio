import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <span className="absolute inset-0 rounded-full border-2 border-neutral-200 dark:border-neutral-700" />
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#FF3B30] border-r-orange-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, ease: 'linear', repeat: Infinity }}
            />
          </div>

          <div className="relative h-1.5 w-52 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-800/80">
            <motion.span
              className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#FF3B30] to-transparent"
              animate={{ x: ['-120%', '180%'] }}
              transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
            />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
            Loading portfolio...
          </span>
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
        isAdminLoggedIn={false}
      />

      <Hero
        profile={portfolio.profile}
        socialLinks={portfolio.social_links}
        onOpenAbout={() => {
          const el = document.getElementById('about');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
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

        {(portfolio.youtube_videos || portfolio.videos || []).length > 0 && (
        <InsightsVideos
          videos={portfolio.youtube_videos || portfolio.videos || []}
          onPlayVideo={(vid) => setSelectedVideo(vid)}
        />
        )}

        {/* 8. Career & Academic Experience */}
        <ExperienceEducation
          experience={portfolio.experience}
          education={portfolio.education}
          certifications={portfolio.certifications}
        />

        {(portfolio.activities.length > 0 || portfolio.hobbies.length > 0) && (
        <HobbiesActivities
          activities={portfolio.activities}
          hobbies={portfolio.hobbies}
        />
        )}

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

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Youtube,
  Clock,
  Wrench,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  SlidersHorizontal,
  Layers,
  Terminal,
  Cpu,
  Router,
  ShieldCheck,
} from 'lucide-react';
import { YouTubeVideo } from '../types';

interface InsightsVideosProps {
  videos: YouTubeVideo[];
  onPlayVideo: (video: YouTubeVideo) => void;
}

export default function InsightsVideos({ videos, onPlayVideo }: InsightsVideosProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    videos.length > 0 ? videos[0].id : ''
  );

  const categories = ['All', ...Array.from(new Set(videos.map((v) => v.category)))];

  const filteredVideos = activeCategory === 'All'
    ? videos
    : videos.filter((v) => v.category === activeCategory);

  const activeFeaturedVideo =
    videos.find((v) => v.id === selectedVideoId) || videos[0] || null;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cisco networking':
        return <Router className="w-4 h-4 text-[#FF3B30]" />;
      case 'hardware diagnostics':
        return <Cpu className="w-4 h-4 text-[#FF3B30]" />;
      case 'cctv & security':
        return <ShieldCheck className="w-4 h-4 text-[#FF3B30]" />;
      case 'systems administration':
        return <Terminal className="w-4 h-4 text-[#FF3B30]" />;
      default:
        return <Wrench className="w-4 h-4 text-[#FF3B30]" />;
    }
  };

  return (
    <section
      id="insights"
      className="py-20 md:py-28 bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* SECTION MARKER & TOP HEADER */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
            INSIGHTS & VIDEOS • PRACTICAL WORKING TASKS
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              TECHNICAL LABS & TUTORIALS
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-3 font-normal leading-relaxed">
              Practical demonstrations covering Cisco Packet Tracer, motherboard diagnostics, and network configurations — engineered, executed, and recorded by <strong className="font-bold text-neutral-950 dark:text-white">Md. Jobaer</strong>.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              id="youtube-channel-link"
              href="https://www.youtube.com/@user-ed1sz1sx4i"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-black uppercase tracking-wider hover:bg-[#FF3B30] dark:hover:bg-[#FF3B30] dark:hover:text-white transition-all shadow-md group"
            >
              <Youtube className="w-4 h-4 text-[#FF3B30] group-hover:text-white transition-colors" />
              <span>VISIT YOUTUBE CHANNEL</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FEATURED WORKING TASK CINEMA SHOWCASE STAGE */}
        {/* ========================================================= */}
        {activeFeaturedVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 p-6 sm:p-8 lg:p-10 rounded-3xl bg-neutral-50 dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800/90 shadow-xl relative overflow-hidden"
          >
            {/* Top Bar inside showcase */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-200/70 dark:border-neutral-800/70">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-ping" />
                  {activeFeaturedVideo.lab_badge || 'ACTIVE LAB DEMONSTRATION'}
                </span>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  WORKING TASK #{activeFeaturedVideo.sort_order}
                </span>
              </div>

              {activeFeaturedVideo.duration && (
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <Clock className="w-3.5 h-3.5 text-[#FF3B30]" />
                  <span>DURATION: {activeFeaturedVideo.duration}</span>
                </div>
              )}
            </div>

            {/* Split Content: Video Thumbnail Frame & Technical Step Documentation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: Interactive Screen Frame */}
              <div className="lg:col-span-6 xl:col-span-7">
                <div
                  className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border-2 border-neutral-800 shadow-2xl group cursor-pointer"
                  onClick={() => onPlayVideo(activeFeaturedVideo)}
                >
                  <img
                    src={activeFeaturedVideo.thumbnail_url}
                    alt={activeFeaturedVideo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent flex items-center justify-center transition-colors group-hover:bg-neutral-950/20">
                    
                    {/* Glowing Crimson Play Button */}
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-full bg-[#FF3B30]/40 blur-md group-hover:bg-[#FF3B30]/70 transition-colors" />
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110">
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Strip on Frame */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-200 border border-white/10">
                        {activeFeaturedVideo.category}
                      </span>
                    </div>
                    <span className="text-xs font-black tracking-wider uppercase bg-[#FF3B30] px-3 py-1 rounded-md shadow-md">
                      CLICK TO PLAY LAB
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Lab Specifications & Practical Execution Log */}
              <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(activeFeaturedVideo.category)}
                    <span className="text-xs font-black uppercase tracking-wider text-[#FF3B30]">
                      {activeFeaturedVideo.category}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white uppercase tracking-tight mb-3">
                    {activeFeaturedVideo.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 font-normal">
                    {activeFeaturedVideo.description}
                  </p>

                  {/* Tools & Software Used */}
                  {activeFeaturedVideo.tools_used && activeFeaturedVideo.tools_used.length > 0 && (
                    <div className="mb-6">
                      <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
                        TOOLS & HARDWARE TESTED:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeFeaturedVideo.tools_used.map((tool, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-800 text-[11px] font-bold text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Execution Steps Documented */}
                  {activeFeaturedVideo.key_steps && activeFeaturedVideo.key_steps.length > 0 && (
                    <div className="mb-6 space-y-2">
                      <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">
                        PRACTICAL EXECUTION STEPS:
                      </span>
                      {activeFeaturedVideo.key_steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3B30] shrink-0 mt-0.5" />
                          <span className="font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onPlayVideo(activeFeaturedVideo)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF3B30] text-white text-xs font-black uppercase tracking-wider hover:bg-[#E02E24] transition-all shadow-md"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>WATCH FULL LAB DEMO</span>
                  </button>

                  <a
                    href={activeFeaturedVideo.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <span>CHANNEL</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* CATEGORY FILTER TABS */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#FF3B30]" />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-950 dark:text-white">
              SELECT WORKING TASK BY DOMAIN:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ALL WORKING TASKS GRID (6 CARDS) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVideos.map((video, idx) => {
            const isSelected = video.id === selectedVideoId;

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => {
                  setSelectedVideoId(video.id);
                }}
                className={`group cursor-pointer flex flex-col rounded-2xl overflow-hidden transition-all duration-300 border ${
                  isSelected
                    ? 'bg-white dark:bg-[#161616] border-[#FF3B30] shadow-xl ring-2 ring-[#FF3B30]/30 -translate-y-1'
                    : 'bg-neutral-50 dark:bg-[#121212] border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Video Thumbnail Box */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center group-hover:bg-neutral-950/20 transition-colors">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayVideo(video);
                      }}
                      className="w-12 h-12 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform"
                      title="Play Video"
                    >
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </button>
                  </div>

                  {/* Badges Over Thumbnail */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-neutral-950/85 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono font-bold text-white uppercase tracking-wider border border-white/10">
                      {video.category}
                    </span>
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-3 right-3 bg-neutral-950/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-neutral-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FF3B30]" />
                      <span>{video.duration}</span>
                    </div>
                  )}
                </div>

                {/* Video Content Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF3B30]">
                        TASK #{video.sort_order} • {video.lab_badge || 'PRACTICAL LAB'}
                      </span>
                    </div>

                    <h3 className="text-sm font-black uppercase tracking-tight text-neutral-950 dark:text-white group-hover:text-[#FF3B30] transition-colors mb-2.5 line-clamp-2">
                      {video.title}
                    </h3>
                    
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 font-normal leading-relaxed mb-4">
                      {video.description}
                    </p>

                    {/* Tool Badges */}
                    {video.tools_used && video.tools_used.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {video.tools_used.slice(0, 3).map((t, ti) => (
                          <span
                            key={ti}
                            className="px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300"
                          >
                            {t}
                          </span>
                        ))}
                        {video.tools_used.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-neutral-200/40 dark:bg-neutral-800/60 text-[10px] font-mono text-neutral-500">
                            +{video.tools_used.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-500 text-[11px] uppercase tracking-wider">
                      Md. Jobaer Tech Series
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayVideo(video);
                      }}
                      className="text-[#FF3B30] hover:text-[#E02E24] flex items-center gap-1 font-black uppercase tracking-wider text-[11px]"
                    >
                      <span>Play Lab</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

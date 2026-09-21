import { X, ExternalLink, Clock, Wrench, CheckCircle2 } from 'lucide-react';
import { YouTubeVideo } from '../types';

interface VideoPlayerModalProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export default function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl my-auto rounded-3xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-2xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/80 text-white hover:bg-[#FF3B30] flex items-center justify-center transition-colors border border-white/10"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Embed Frame */}
        <div className="relative aspect-video w-full bg-black shrink-0">
          <iframe
            src={`https://www.youtube.com/embed/${video.video_id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Video Information & Lab Details */}
        <div className="p-6 sm:p-8 bg-neutral-900 text-white overflow-y-auto space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#FF3B30] text-white">
                  {video.category}
                </span>
                {video.duration && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-[#FF3B30]" />
                    {video.duration}
                  </span>
                )}
                {video.lab_badge && (
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    • {video.lab_badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                {video.title}
              </h3>
            </div>

            <a
              href={video.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF3B30] hover:bg-[#E02E24] text-xs font-black uppercase tracking-wider text-white transition-colors shrink-0 shadow-md"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {video.description && (
            <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
              {video.description}
            </p>
          )}

          {/* Tools & Hardware Used in this Lab */}
          {video.tools_used && video.tools_used.length > 0 && (
            <div className="pt-4 border-t border-neutral-800">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#FF3B30]" />
                EQUIPMENT & SOFTWARE USED:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {video.tools_used.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-xs font-medium text-neutral-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Lab Execution Steps */}
          {video.key_steps && video.key_steps.length > 0 && (
            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
                PRACTICAL STEPS DEMONSTRATED BY MD. JOBAER:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {video.key_steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3B30] shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

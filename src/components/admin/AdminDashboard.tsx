import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Youtube,
  Wrench,
  Layers,
  Briefcase,
  GraduationCap,
  Mail,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  ExternalLink,
  Save,
  Eye,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Key,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  PortfolioData,
  Project,
  YouTubeVideo,
  Skill,
  Service,
  Experience,
  Education,
  Certification,
  ContactMessage,
  Profile,
  SiteSettings,
} from '../../types';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onRefreshPublicData: () => void;
  onCloseAdmin: () => void;
}

type TabType =
  | 'overview'
  | 'profile'
  | 'projects'
  | 'videos'
  | 'skills'
  | 'services'
  | 'experience'
  | 'education'
  | 'messages'
  | 'settings';

export default function AdminDashboard({
  token,
  onLogout,
  onRefreshPublicData,
  onCloseAdmin,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingVideo, setEditingVideo] = useState<Partial<YouTubeVideo> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<Experience> | null>(null);
  const [editingEducation, setEditingEducation] = useState<Partial<Education> | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [allData, messagesData] = await Promise.all([
        api.getAdminAll(token),
        api.getMessages(token),
      ]);
      setData(allData);
      setMessages(messagesData);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load admin content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.profile) return;
    try {
      setSaving(true);
      await api.updateProfile(token, data.profile);
      showToast('success', 'Profile and Hero information updated successfully!');
      onRefreshPublicData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle Settings Update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.settings) return;
    try {
      setSaving(true);
      await api.updateSettings(token, data.settings);
      showToast('success', 'Site settings & SEO updated successfully!');
      onRefreshPublicData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle Image Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setSaving(true);
        const res = await api.uploadImage(token, reader.result as string, file.name);
        callback(res.url);
        showToast('success', 'Image uploaded successfully!');
      } catch (err: any) {
        showToast('error', err.message || 'Image upload failed');
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Generic Save for Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      setSaving(true);
      if (editingProject.id) {
        await api.updateEntity(token, 'projects', editingProject.id, editingProject);
        showToast('success', 'Project updated successfully');
      } else {
        await api.createEntity(token, 'projects', editingProject);
        showToast('success', 'Project created successfully');
      }
      setEditingProject(null);
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  // Generic Save for Video
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    try {
      setSaving(true);
      if (editingVideo.id) {
        await api.updateEntity(token, 'videos', editingVideo.id, editingVideo);
        showToast('success', 'YouTube video updated');
      } else {
        await api.createEntity(token, 'videos', editingVideo);
        showToast('success', 'YouTube video added');
      }
      setEditingVideo(null);
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save video');
    } finally {
      setSaving(false);
    }
  };

  // Helper for Auto-extracting YouTube ID
  const handleYouTubeUrlChange = (url: string) => {
    let videoId = '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }
    const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : (editingVideo?.thumbnail_url || '');
    setEditingVideo((prev) => ({
      ...prev,
      youtube_url: url,
      video_id: videoId || prev?.video_id || '',
      thumbnail_url: thumb,
    }));
  };

  // Delete Entity Helper
  const handleDelete = async (entity: string, id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      setSaving(true);
      await api.deleteEntity(token, entity, id);
      showToast('success', `Deleted ${name}`);
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 animate-pulse">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            Loading Admin Control Panel...
          </p>
        </div>
      </div>
    );
  }

  const unreadMessagesCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 overflow-hidden font-sans">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-white transition-all ${
            notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
            CMS
          </div>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 dark:text-white">
              Md. Jobaer Portfolio CMS
            </h1>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected to Local File Database
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCloseAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Body: Sidebar + Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col p-4 shrink-0 overflow-y-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 mb-2">
            NAVIGATION
          </span>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Hero</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4" />
                <span>Featured Projects</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {data?.projects?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'videos'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Youtube className="w-4 h-4" />
                <span>YouTube Insights</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {data?.videos?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'skills'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4" />
                <span>Skills & Matrix</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {data?.skills?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'services'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>What I Do (Services)</span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'experience'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Work Experience</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'education'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Education & Certs</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'messages'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Messages Inbox</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & SEO</span>
            </button>
          </nav>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {/* ==================================================== */}
          {/* TAB 1: OVERVIEW & STATS                              */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white">
                  Welcome, Md. Jobaer
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Manage your personal portfolio, upload new projects, embed YouTube videos, and view client inquiries.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase">Projects</span>
                    <FolderGit2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-3xl font-extrabold">{data?.projects?.length || 0}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    {data?.projects?.filter((p: any) => p.is_featured)?.length || 0} Featured
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase">YouTube Videos</span>
                    <Youtube className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-3xl font-extrabold">{data?.videos?.length || 0}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Embedded video tutorials</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase">Verified Skills</span>
                    <Wrench className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-extrabold">{data?.skills?.length || 0}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Across 6 tech categories</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase">Inbox Messages</span>
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-3xl font-extrabold">{messages.length}</p>
                  <p className="text-[10px] text-red-500 font-semibold mt-1">
                    {unreadMessagesCount} unread inquiries
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white mb-4 uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setEditingProject({
                        title: '',
                        category: 'Web Applications',
                        short_description: '',
                        full_description: '',
                        thumbnail_url: '/uploads/project_club_mgmt_1789985482555.jpg',
                        technologies: ['HTML', 'CSS', 'JavaScript'],
                        status: 'published',
                        is_featured: true,
                      });
                      setActiveTab('projects');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Project</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingVideo({
                        title: '',
                        youtube_url: '',
                        video_id: '',
                        category: 'Networking',
                        status: 'published',
                        is_featured: true,
                      });
                      setActiveTab('videos');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add YouTube Video</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('messages')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-800 text-white text-xs font-bold transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>View Inbox ({unreadMessagesCount} unread)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: PROFILE & HERO                                */}
          {/* ==================================================== */}
          {activeTab === 'profile' && data?.profile && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                  Profile & Hero Settings
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Manage your personal introduction, professional titles, contact details, and portrait photo.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
                
                {/* Photo Upload & Preview */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Hero Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <img
                      src={data.profile.profile_image}
                      alt="Preview"
                      className="w-24 h-28 object-cover rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm"
                    />
                    <div className="space-y-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Upload New Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => {
                              setData({
                                ...data,
                                profile: { ...data.profile, profile_image: url },
                              });
                            })
                          }
                        />
                      </label>
                      <p className="text-[11px] text-neutral-500">
                        Supports JPG, PNG, WebP (Ideal ratio 4:5 or 1:1)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, name: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={data.profile.professional_title}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, professional_title: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                    Supporting Line / Key Specialties
                  </label>
                  <input
                    type="text"
                    value={data.profile.supporting_line}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, supporting_line: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                    Short Bio / Summary (CV-based)
                  </label>
                  <textarea
                    rows={3}
                    value={data.profile.short_intro}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, short_intro: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.profile.email}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, email: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={data.profile.phone}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, phone: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={data.profile.location}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, location: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Iqama Status
                    </label>
                    <input
                      type="text"
                      value={data.profile.iqama_status}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, iqama_status: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                      Availability Status Text
                    </label>
                    <input
                      type="text"
                      value={data.profile.availability_status}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, availability_status: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                    Custom Resume / CV URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave empty to use built-in generated CV or enter custom PDF URL"
                    value={data.profile.resume_url || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, resume_url: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    If empty, visitors get the interactive verified digital CV modal and printable document.
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: PROJECTS CMS                                  */}
          {/* ==================================================== */}
          {activeTab === 'projects' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                    Projects & Featured Work
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Manage work showcases, upload mockups, set categories, and publish status.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingProject({
                      title: '',
                      category: 'Web Applications',
                      short_description: '',
                      full_description: '',
                      thumbnail_url: '/uploads/project_club_mgmt_1789985482555.jpg',
                      technologies: ['HTML', 'JavaScript'],
                      status: 'published',
                      is_featured: true,
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects Table */}
              <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 uppercase font-bold border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="p-4">Project</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {data?.projects?.map((proj: Project) => (
                      <tr key={proj.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={proj.thumbnail_url}
                            alt=""
                            className="w-12 h-8 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800"
                          />
                          <div>
                            <p className="font-bold text-neutral-900 dark:text-white">
                              {proj.title}
                            </p>
                            <p className="text-[11px] text-neutral-400 line-clamp-1">
                              {proj.short_description}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-neutral-600 dark:text-neutral-300">
                          {proj.category}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              proj.status === 'published'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            }`}
                          >
                            {proj.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingProject(proj)}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('projects', proj.id, proj.title)}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Edit/Create Project Modal */}
              {editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                  <div
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      <h3 className="font-extrabold text-lg">
                        {editingProject.id ? 'Edit Project' : 'New Project'}
                      </h3>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1 uppercase">Title</label>
                        <input
                          type="text"
                          required
                          value={editingProject.title || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, title: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold mb-1 uppercase">Category</label>
                          <select
                            value={editingProject.category || 'Web Applications'}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, category: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                          >
                            <option value="Web Applications">Web Applications</option>
                            <option value="Network Engineering">Network Engineering</option>
                            <option value="3D & CAD">3D & CAD</option>
                            <option value="IT Support & Security">IT Support & Security</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold mb-1 uppercase">Status</label>
                          <select
                            value={editingProject.status || 'published'}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, status: e.target.value as any })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1 uppercase">Thumbnail URL or Upload</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={editingProject.thumbnail_url || ''}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, thumbnail_url: e.target.value })
                            }
                            className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                          />
                          <label className="cursor-pointer px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 flex items-center gap-1 font-bold">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, (url) => {
                                  setEditingProject({ ...editingProject, thumbnail_url: url });
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1 uppercase">Short Description</label>
                        <input
                          type="text"
                          required
                          value={editingProject.short_description || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, short_description: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 uppercase">Full Description</label>
                        <textarea
                          rows={3}
                          value={editingProject.full_description || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, full_description: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 uppercase">
                          Technologies (comma separated)
                        </label>
                        <input
                          type="text"
                          value={editingProject.technologies?.join(', ') || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          placeholder="e.g. Cisco Packet Tracer, VLANs, OSPF"
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold mb-1 uppercase">Live URL</label>
                          <input
                            type="text"
                            value={editingProject.live_url || ''}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, live_url: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 uppercase">GitHub URL</label>
                          <input
                            type="text"
                            value={editingProject.github_url || ''}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, github_url: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 uppercase">YouTube Demo URL</label>
                          <input
                            type="text"
                            value={editingProject.youtube_url || ''}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, youtube_url: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        >
                          Save Project
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: YOUTUBE VIDEOS CMS                            */}
          {/* ==================================================== */}
          {activeTab === 'videos' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                    YouTube Video Insights
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Add YouTube URLs. Video ID and high-res thumbnails are extracted automatically.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingVideo({
                      title: '',
                      youtube_url: '',
                      video_id: '',
                      thumbnail_url: '',
                      category: 'Networking',
                      status: 'published',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Video</span>
                </button>
              </div>

              {/* Videos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.videos?.map((vid: YouTubeVideo) => (
                  <div
                    key={vid.id}
                    className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-neutral-900">
                        <img
                          src={vid.thumbnail_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                          {vid.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-xs line-clamp-2">{vid.title}</h4>
                        <p className="text-[11px] text-neutral-500 mt-1">ID: {vid.video_id}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-emerald-600">
                        {vid.status}
                      </span>
                      <div className="space-x-1">
                        <button
                          onClick={() => setEditingVideo(vid)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete('videos', vid.id, vid.title)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Video Modal */}
              {editingVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                  <div
                    className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      <h3 className="font-extrabold text-base">
                        {editingVideo.id ? 'Edit YouTube Video' : 'Add YouTube Video'}
                      </h3>
                      <button
                        onClick={() => setEditingVideo(null)}
                        className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1 uppercase">YouTube URL</label>
                        <input
                          type="text"
                          required
                          value={editingVideo.youtube_url || ''}
                          onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                        />
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Paste any normal YouTube or Shorts link
                        </p>
                      </div>

                      {editingVideo.thumbnail_url && (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black max-w-xs mx-auto">
                          <img
                            src={editingVideo.thumbnail_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block font-bold mb-1 uppercase">Title</label>
                        <input
                          type="text"
                          required
                          value={editingVideo.title || ''}
                          onChange={(e) =>
                            setEditingVideo({ ...editingVideo, title: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold mb-1 uppercase">Category</label>
                          <input
                            type="text"
                            value={editingVideo.category || 'Networking'}
                            onChange={(e) =>
                              setEditingVideo({ ...editingVideo, category: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1 uppercase">Publish Status</label>
                          <select
                            value={editingVideo.status || 'published'}
                            onChange={(e) =>
                              setEditingVideo({ ...editingVideo, status: e.target.value as any })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1 uppercase">Description</label>
                        <textarea
                          rows={2}
                          value={editingVideo.description || ''}
                          onChange={(e) =>
                            setEditingVideo({ ...editingVideo, description: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 resize-none"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingVideo(null)}
                          className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                        >
                          Save Video
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: SKILLS MATRIX                                 */}
          {/* ==================================================== */}
          {activeTab === 'skills' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                    Skills & Technical Matrix
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Manage your 24+ technical competencies and proficiency levels.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingSkill({
                      name: '',
                      category: 'IT Support & Hardware',
                      proficiency_level: 90,
                      is_active: true,
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data?.skills?.map((skill: Skill) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-xs text-neutral-900 dark:text-white">
                        {skill.name}
                      </p>
                      <p className="text-[10px] text-neutral-400">{skill.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600">
                        {skill.proficiency_level}%
                      </span>
                      <button
                        onClick={() => handleDelete('skills', skill.id, skill.name)}
                        className="p-1 text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Skill Modal */}
              {editingSkill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                  <div
                    className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="font-bold text-base">Add New Skill</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Skill Name</label>
                        <input
                          type="text"
                          value={editingSkill.name || ''}
                          onChange={(e) =>
                            setEditingSkill({ ...editingSkill, name: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Category</label>
                        <input
                          type="text"
                          value={editingSkill.category || ''}
                          onChange={(e) =>
                            setEditingSkill({ ...editingSkill, category: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">
                          Proficiency ({editingSkill.proficiency_level}%)
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={editingSkill.proficiency_level || 90}
                          onChange={(e) =>
                            setEditingSkill({
                              ...editingSkill,
                              proficiency_level: parseInt(e.target.value),
                            })
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="pt-2 flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => setEditingSkill(null)}
                        className="px-4 py-2 border rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          await api.createEntity(token, 'skills', editingSkill);
                          setEditingSkill(null);
                          await loadData();
                          onRefreshPublicData();
                        }}
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
                      >
                        Add Skill
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: SERVICES / WHAT I DO                          */}
          {/* ==================================================== */}
          {activeTab === 'services' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
              <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                What I Do (Services)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.services?.map((svc: Service) => (
                  <div
                    key={svc.id}
                    className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600">{svc.code}</span>
                      <span className="text-[11px] font-bold text-neutral-400">{svc.icon}</span>
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{svc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 7: EXPERIENCE                                    */}
          {/* ==================================================== */}
          {activeTab === 'experience' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                Work Experience (CV Records)
              </h2>
              <div className="space-y-4">
                {data?.experience?.map((exp: Experience) => (
                  <div
                    key={exp.id}
                    className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-base">{exp.position}</h3>
                        <p className="text-xs font-semibold text-blue-600">
                          {exp.company} • {exp.location}
                        </p>
                      </div>
                      <span className="text-xs text-neutral-500 font-mono">
                        {exp.start_date} – {exp.end_date}
                      </span>
                    </div>
                    <ul className="list-disc pl-5 text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 8: EDUCATION                                     */}
          {/* ==================================================== */}
          {activeTab === 'education' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                Education & Certifications
              </h2>
              <div className="space-y-4">
                {data?.education?.map((edu: Education) => (
                  <div
                    key={edu.id}
                    className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-sm">{edu.degree}</h3>
                      <p className="text-xs text-neutral-500">{edu.institution}</p>
                      <span className="text-[11px] text-blue-600 font-bold">{edu.grade}</span>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {edu.start_year} – {edu.end_year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 9: MESSAGES INBOX                                */}
          {/* ==================================================== */}
          {activeTab === 'messages' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                    Client Messages & Inquiries
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Submitted via public portfolio contact form.
                  </p>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <Mail className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm font-bold">Inbox is currently empty</p>
                  <p className="text-xs text-neutral-500">
                    New inquiries submitted from the website contact form will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-6 rounded-2xl bg-white dark:bg-neutral-900 border transition-all ${
                        !msg.is_read
                          ? 'border-blue-500 dark:border-blue-500 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              !msg.is_read ? 'bg-blue-600 animate-pulse' : 'bg-neutral-300'
                            }`}
                          />
                          <div>
                            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                              {msg.name}
                            </h3>
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              {msg.email}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {msg.project_type}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl mb-4 font-normal">
                        {msg.message}
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="space-x-2">
                          {!msg.is_read && (
                            <button
                              onClick={async () => {
                                await api.updateMessage(token, msg.id, { is_read: true });
                                await loadData();
                              }}
                              className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-bold"
                            >
                              Mark as Read
                            </button>
                          )}
                          <a
                            href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry (${msg.project_type})`}
                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold inline-block"
                          >
                            Reply via Email
                          </a>
                        </div>

                        <button
                          onClick={async () => {
                            if (!confirm('Delete this message?')) return;
                            await api.deleteMessage(token, msg.id);
                            await loadData();
                          }}
                          className="text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 10: SETTINGS & SEO                               */}
          {/* ==================================================== */}
          {activeTab === 'settings' && data?.settings && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                  Site Settings & SEO Configuration
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Configure search engine optimization, OpenGraph meta tags, and user interface preferences.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6 text-xs">
                <div>
                  <label className="block font-bold mb-1 uppercase">Website Title Tag</label>
                  <input
                    type="text"
                    value={data.settings.site_title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, site_title: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={data.settings.meta_description}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, meta_description: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase">Meta Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={data.settings.keywords}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, keywords: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enable_dark_mode"
                    checked={data.settings.enable_dark_mode}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, enable_dark_mode: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <label htmlFor="enable_dark_mode" className="font-bold uppercase text-neutral-700 dark:text-neutral-300">
                    Enable Dark / Light Mode Toggle on Public Site
                  </label>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

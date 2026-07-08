import { useState, useEffect, useCallback } from 'react';
import { FiUser, FiMoon, FiSun, FiBell, FiDownload, FiShield, FiSave, FiCheck, FiActivity, FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { fetchCompetitors } from '../services/api';

const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('agtech_theme') || 'dark');
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    marketUpdates: true,
    competitorChanges: false,
    weeklyDigest: true,
  });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saveStatus, setSaveStatus] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('agtech_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileChange = (e) => {
    setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSave = async () => {
    setSaveStatus('saving');
    try {
      await updateUserProfile({ name: profileForm.name, email: profileForm.email });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Failed to update profile', error);
      setSaveStatus(null);
    }
  };

  const handleExportData = useCallback(async () => {
    setExportStatus('exporting');
    try {
      const { data } = await fetchCompetitors();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agtech-competitors-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportStatus('done');
      setTimeout(() => setExportStatus(null), 2000);
    } catch (err) {
      console.error('Export failed', err);
      setExportStatus(null);
    }
  }, []);

  const notificationOptions = [
    { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important alerts via email' },
    { key: 'marketUpdates', label: 'Market Updates', description: 'Get notified when market data changes' },
    { key: 'competitorChanges', label: 'Competitor Changes', description: 'Alert when competitor data is modified' },
    { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary report' },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Dynamic Header */}
      <div className="mb-10 animate-slide-in-left">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 tracking-tight mb-2">
          Account Settings
        </h1>
        <p className="text-slate-400 text-lg">Manage your personal preferences, security, and application data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Overview Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <div className="glass-card p-8 text-center animate-slide-up delay-1 relative overflow-hidden group hover:shadow-emerald-500/10 transition-all duration-500">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative inline-block mb-6">
                {/* Glowing ring around avatar */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 blur-md opacity-40 group-hover:opacity-80 group-hover:animate-spin-slow transition-all duration-500"></div>
                
                {/* Avatar container */}
                <div className="relative w-28 h-28 rounded-full bg-slate-900 border-2 border-slate-700/50 flex items-center justify-center text-4xl font-bold text-white shadow-xl z-10 overflow-hidden group-hover:border-emerald-500/50 transition-colors duration-500">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                
                {/* Online status indicator */}
                <div className="absolute bottom-1 right-2 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full z-20 shadow-lg shadow-emerald-500/50 animate-pulse"></div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight group-hover:text-emerald-400 transition-colors duration-300">{user?.name}</h2>
              <p className="text-sm text-slate-400 mb-8 flex items-center justify-center gap-2">
                <FiMail className="text-emerald-500/70" /> {user?.email}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-left border-t border-slate-700/50 pt-6">
                <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1"><FiShield /> Role</div>
                  <div className="text-sm text-slate-300 font-medium">Administrator</div>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1"><FiActivity /> Status</div>
                  <div className="text-sm text-emerald-400 font-medium">Active Session</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Panels */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Profile Form */}
          <div className="glass-card p-6 md:p-8 animate-slide-up delay-2 hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 shadow-inner">
                <FiUser />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white m-0">Personal Information</h3>
                <p className="text-sm text-slate-400 m-0">Update your details across the platform.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide ml-1">Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="btn-primary min-w-[160px] py-2.5 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300"
                onClick={handleProfileSave}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : saveStatus === 'saved' ? (
                  <><FiCheck className="text-lg animate-scale-in" /> Saved Successfully!</>
                ) : (
                  <><FiSave className="text-lg group-hover:animate-bounce" /> Save Changes</>
                )}
              </button>
            </div>
          </div>

          {/* Theme Section */}
          <div className="glass-card p-6 md:p-8 animate-slide-up delay-3 hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                {theme === 'dark' ? <FiMoon /> : <FiSun />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white m-0">Interface Theme</h3>
                <p className="text-sm text-slate-400 m-0">Customize your viewing experience.</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <div>
                <div className="text-sm font-semibold text-white mb-1">Dark Mode</div>
                <div className="text-xs text-slate-400">Reduce eye strain with a darker background</div>
              </div>
              <button
                className={`toggle-switch scale-110 ${theme === 'dark' ? 'active' : ''}`}
                onClick={toggleTheme}
                role="switch"
                aria-checked={theme === 'dark'}
              >
                <div className="toggle-switch-knob" />
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="glass-card p-6 md:p-8 animate-slide-up delay-4 hover:border-amber-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 group-hover:-rotate-12">
                <FiBell />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white m-0">Notification Preferences</h3>
                <p className="text-sm text-slate-400 m-0">Control when and how you receive alerts.</p>
              </div>
            </div>

            <div className="space-y-3">
              {notificationOptions.map((opt, idx) => (
                <div key={opt.key} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all hover:translate-x-1 duration-300">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{opt.label}</div>
                    <div className="text-xs text-slate-400">{opt.description}</div>
                  </div>
                  <button
                    className={`toggle-switch ${notifications[opt.key] ? 'active' : ''}`}
                    onClick={() => handleNotificationToggle(opt.key)}
                    role="switch"
                    aria-checked={notifications[opt.key]}
                  >
                    <div className="toggle-switch-knob" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Export & Danger Zone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up delay-5">
            
            {/* Export */}
            <div className="glass-card p-6 hover:border-indigo-500/30 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-all duration-300 group-hover:-translate-y-1">
                  <FiDownload />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Export Data</h3>
                <p className="text-xs text-slate-400 mb-6 line-clamp-2">Download a complete JSON backup of all tracked competitor intelligence.</p>
              </div>
              <button
                className="w-full btn-primary bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-lg shadow-lg shadow-indigo-500/20 flex justify-center items-center gap-2"
                onClick={handleExportData}
                disabled={exportStatus === 'exporting'}
              >
                {exportStatus === 'exporting' ? 'Exporting...' : exportStatus === 'done' ? <><FiCheck /> Downloaded</> : <><FiDownload /> Download JSON</>}
              </button>
            </div>

            {/* Danger Zone */}
            <div className="glass-card p-6 border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-all duration-300 group-hover:animate-pulse">
                  <FiLock />
                </div>
                <h3 className="text-base font-bold text-rose-400 mb-1">Danger Zone</h3>
                <p className="text-xs text-rose-400/70 mb-6 line-clamp-2">Permanently delete your account and remove all personal data. Irreversible.</p>
              </div>
              <button className="w-full btn-danger py-2.5 rounded-lg flex justify-center items-center gap-2 font-bold shadow-lg shadow-rose-500/20">
                <FiShield /> Delete Account
              </button>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Settings;

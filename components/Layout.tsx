import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { logout, db } from '../config/firebase';
import { 
  X, LogOut, LayoutDashboard, Bell, BookOpen, 
  TrendingUp, Gift, ExternalLink, ChevronRight, 
  Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // [CLEANUP] Tidak perlu lagi state activeModal untuk Tutorial
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // --- LOGIKA NOTIFIKASI (TETAP SAMA) ---
  useEffect(() => {
    if (!user || !user.email) return;

    const qBroadcast = query(
        collection(db, 'admin_notification'),
        where('target', '==', 'ALL'),
        limit(5)
    );

    const qPersonal = query(
        collection(db, 'user_notifications'),
        where('userEmail', '==', user.email),
        limit(10)
    );

    const unsubscribeBroadcast = onSnapshot(qBroadcast, (snap) => {
        const broadcasts = snap.docs.map(d => ({ id: d.id, ...d.data(), type: 'BROADCAST' }));
        updateNotificationsList(broadcasts, 'BROADCAST');
    });

    const unsubscribePersonal = onSnapshot(qPersonal, (snap) => {
        const personals = snap.docs.map(d => ({ id: d.id, ...d.data(), type: 'PERSONAL' }));
        updateNotificationsList(personals, 'PERSONAL');
    });

    return () => {
        unsubscribeBroadcast();
        unsubscribePersonal();
    };
  }, [user]);

  const [rawBroadcasts, setRawBroadcasts] = useState<any[]>([]);
  const [rawPersonals, setRawPersonals] = useState<any[]>([]);

  const updateNotificationsList = (newData: any[], type: 'BROADCAST' | 'PERSONAL') => {
      if (type === 'BROADCAST') setRawBroadcasts(newData);
      if (type === 'PERSONAL') setRawPersonals(newData);
  };

  useEffect(() => {
      const combined = [...rawBroadcasts, ...rawPersonals].sort((a, b) => {
          const tA = a.createdAt?.seconds || 0;
          const tB = b.createdAt?.seconds || 0;
          return tB - tA; 
      });
      setNotifications(combined);
  }, [rawBroadcasts, rawPersonals]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Komponen Navigasi Kecil
  const NavItem = ({ icon: Icon, label, onClick, isActive, colorClass }: { icon: any, label: string, onClick: () => void, isActive?: boolean, colorClass?: string }) => {
    return (
      <button 
        onClick={() => {
          onClick();
          setIsSidebarOpen(false); 
        }}
        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium group relative overflow-hidden
          ${isActive 
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-300' 
            : 'text-slate-500 hover:bg-slate-50'
          }`}
      >
        <div className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : colorClass || 'text-slate-400 group-hover:text-indigo-500'}`}>
          <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className="relative z-10 tracking-wide text-sm">{label}</span>
        {!isActive && <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-slate-300" />}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-slate-100 z-50
        transition-transform duration-300 ease-out flex flex-col shadow-xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">
          {/* Header Logo */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 transform hover:rotate-6 transition-transform duration-300">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-lg leading-tight tracking-tight">Geuwat</h1>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Learning</p>
              </div>
            </div>
           <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close sidebar"
            title="Close sidebar" 
          >
            <X size={24} />
          </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 space-y-2 overflow-y-auto px-1 custom-scrollbar">
             <NavItem 
                icon={LayoutDashboard} 
                label="Dashboard" 
                onClick={() => navigate('/dashboard')} 
                isActive={location.pathname === '/dashboard'} 
             />
             
             <div className="pt-6 pb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-5 mb-3">Activities</p>
                <div className="space-y-1">
                  <NavItem 
                      icon={TrendingUp} 
                      label="Progress" 
                      onClick={() => navigate('/progress')} 
                      isActive={location.pathname === '/progress'}
                      colorClass="text-emerald-500"
                  />
                  <NavItem 
                      icon={Gift} 
                      label="Rewards" 
                      onClick={() => navigate('/reward')} 
                      isActive={location.pathname === '/reward'}
                      colorClass="text-amber-500"
                  />
                  {/* [UPDATED] Tutorial sekarang pindah halaman, bukan setModal */}
                  <NavItem 
                      icon={BookOpen} 
                      label="Tutorial" 
                      onClick={() => navigate('/tutorial')} 
                      isActive={location.pathname === '/tutorial'}
                      colorClass="text-blue-500"
                  />
                </div>
             </div>
          </div>

          {/* User Footer */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <div 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer group"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                  {user?.displayName?.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-700">{user?.displayName}</p>
                <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-wide flex items-center gap-1">
                   {user?.role === 'user' ? 'Student' : 'Admin'} 
                   <Settings size={10} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 py-3 rounded-xl transition-all duration-300 text-sm font-bold group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform"/>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen relative bg-slate-50/50">
        
        {/* HEADER */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-30 px-6 py-4 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight hidden md:block">
              {title}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotification(!showNotification)}
                className={`relative p-2.5 rounded-full transition-all duration-200 ${showNotification ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              >
                 <Bell size={22} />
                 {notifications.length > 0 && (
                     <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                 )}
              </button>

              {/* Notification Dropdown */}
              {showNotification && (
                <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Notifications</h4>
                      <button 
                          onClick={() => setShowNotification(false)} 
                          className="text-slate-400 hover:text-slate-600"
                          aria-label="Close Notifications"
                          title="Tutup"
                        >
                          <X size={16}/>
                        </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                           <Bell size={32} className="mb-2 opacity-20" />
                           <p className="text-xs">No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${notif.type === 'PERSONAL' ? 'bg-indigo-50/30' : ''}`}>
                            <div className="flex gap-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'PERSONAL' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                  {notif.type === 'PERSONAL' ? <Gift size={14} /> : <Bell size={14} />}
                               </div>
                               <div>
                                  <h5 className="font-bold text-slate-800 text-sm leading-tight mb-1">{notif.title}</h5>
                                  <p className="text-xs text-slate-500 leading-relaxed">{notif.message || notif.desc}</p>
                                  {notif.link && (
                                    <a href={notif.link} className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 mt-2 hover:underline">
                                        View Details <ExternalLink size={10} />
                                    </a>
                                  )}
                               </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>

      {/* [CLEANUP] Tidak ada lagi area Modal di sini, Layout jadi bersih! */}

    </div>
  );
};

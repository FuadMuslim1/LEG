
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { logout, db } from '../config/firebase';
import { 
  Menu, X, LogOut, LayoutDashboard, Bell, BookOpen, 
  TrendingUp, Gift, ExternalLink, ChevronRight, Coins, Smartphone,
  HelpCircle, ArrowLeft, Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  title: string;
}

// Modern Modal Component
const Modal: React.FC<{ title: string, onClose: () => void, children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 transform transition-all border border-white/20">
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <h3 className="font-bold text-xl text-slate-800 tracking-tight">{title}</h3>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 hover:rotate-90 transition-all duration-300 text-slate-500">
          <X size={18} />
        </button>
      </div>
      <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- GLOBAL STATE FOR MODALS ---
  const [activeModal, setActiveModal] = useState<'NONE' | 'PROGRESS' | 'REWARD' | 'TUTORIAL'>('NONE');
  const [showNotification, setShowNotification] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  // Tutorial Detail State
  const [viewingTutorial, setViewingTutorial] = useState<any | null>(null);

  // Trigger untuk update progress bar saat local storage berubah
  const [progressUpdateTrigger, setProgressUpdateTrigger] = useState(0);

  // --- REALTIME NOTIFICATIONS STATE ---
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleStorageUpdate = () => {
        setProgressUpdateTrigger(prev => prev + 1);
    };
    window.addEventListener('storage_update_pronunciation', handleStorageUpdate);
    return () => window.removeEventListener('storage_update_pronunciation', handleStorageUpdate);
  }, []);

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
          return tB - tA; // Newest first
      });
      setNotifications(combined);
  }, [rawBroadcasts, rawPersonals]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const tutorialItems = [
    { 
        id: 1,
        title: 'Cara Melihat Progress', 
        desc: 'Klik menu "View Progress" lalu pilih level bahasa inggris Anda (A1-C2).',
        steps: [
            'Buka Sidebar (Menu kiri).',
            'Klik menu "View Progress" (icon grafik).',
            'Pilih Level Bahasa Inggris Anda.',
            'Lihat grafik kemajuan belajar Anda.'
        ]
    },
    { 
        id: 2,
        title: 'Cara Mengklaim Reward', 
        desc: 'Kumpulkan poin dari latihan soal dan tukarkan di menu "Reward".',
        steps: [
            'Pastikan Anda sudah login dan memiliki poin.',
            'Buka menu "Rewards" di sidebar.',
            'Lihat total poin Anda.',
            'Hubungi admin jika poin belum masuk.'
        ]
    },
  ];

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  
  const getProgressData = (level: string) => {
    const base = level.charCodeAt(1); 
    
    let pronValue = (base * 2) % 100; 

    if (level === 'A1') {
      const savedPron = localStorage.getItem('geuwat_local_progress_pronunciation');
      if (savedPron) {
        const scores = JSON.parse(savedPron);
        const values = Object.values(scores) as number[];
        if (values.length > 0) {
          const sum = values.reduce((a, b) => a + b, 0);
          pronValue = Math.round(sum / 4); 
        } else {
          pronValue = 0;
        }
      } else {
        pronValue = 0;
      }
    }

    return [
      { subject: 'Pronunciation', value: pronValue, isLocal: level === 'A1' },
      { subject: 'Vocabulary', value: (base * 3) % 100 },
      { subject: 'Grammar', value: (base * 4) % 100 },
      { subject: 'Speaking', value: (base * 5) % 100 },
    ];
  };

  const formatNumber = (num?: number) => {
    return num ? new Intl.NumberFormat('id-ID').format(num) : '0';
  };

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

  const closeModals = () => {
      setActiveModal('NONE');
      setViewingTutorial(null);
      setSelectedLevel(null);
  }

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
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors">
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
                      onClick={() => setActiveModal('PROGRESS')} 
                      colorClass="text-emerald-500"
                  />
                  <NavItem 
                      icon={Gift} 
                      label="Rewards" 
                      onClick={() => setActiveModal('REWARD')} 
                      colorClass="text-amber-500"
                  />
                  <NavItem 
                      icon={BookOpen} 
                      label="Tutorial" 
                      onClick={() => setActiveModal('TUTORIAL')} 
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
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-xl transition-colors">
              <Menu size={24} />
            </button>
             {/* Breadcrumb / Title */}
            <h2 className="text-lg font-bold text-slate-800 tracking-tight hidden md:block">
              {title}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Balance Chip - Udah Angel tutupin ya A biar jadi rahasia kita berdua :p */}
            {/* 
            {user?.role === 'user' && (
              <div className="hidden md:flex items-center gap-2 bg-slate-100/80 px-4 py-2 rounded-full border border-slate-200">
                <Coins size={16} className="text-amber-500" />
                <span className="text-xs font-bold text-slate-700">{formatNumber(user.balance)} pts</span>
              </div>
            )}
            */}

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
                      <button onClick={() => setShowNotification(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
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

      {/* MODALS RENDERED HERE (UNCHANGED) */}
      {/* ... (Progress, Reward, Tutorial modals are the same as previous) ... */}
      {activeModal === 'PROGRESS' && (
        <Modal title="Your Learning Progress" onClose={closeModals}>
          {!selectedLevel ? (
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-6">Select your English level to view detailed statistics:</p>
              <div className="grid grid-cols-2 gap-3">
                {levels.map(lvl => (
                  <button 
                    key={lvl} 
                    onClick={() => setSelectedLevel(lvl)}
                    className="p-5 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 font-bold text-slate-600 transition-all duration-200 text-xl shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-8 duration-300">
               <button onClick={() => setSelectedLevel(null)} className="mb-6 text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                 <ArrowLeft size={14} /> Change Level
               </button>
               
               <div className="flex items-center justify-between mb-8 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white shadow-lg shadow-emerald-200">
                 <div>
                    <p className="text-xs opacity-80 uppercase font-bold tracking-wider mb-1">Current Level</p>
                    <h4 className="font-bold text-3xl">{selectedLevel}</h4>
                 </div>
                 <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <TrendingUp size={28} className="text-white" />
                 </div>
               </div>
               
               <div className="space-y-5">
                 {getProgressData(selectedLevel).map((stat) => (
                   <div key={stat.subject}>
                     <div className="flex justify-between text-sm mb-2">
                       <span className="font-bold text-slate-700 flex items-center gap-2">
                         {stat.subject}
                         {stat.isLocal && (
                            <span className="bg-slate-100 p-0.5 rounded text-slate-400" title="Saved on this device">
                                <Smartphone size={10} />
                            </span>
                         )}
                       </span>
                       <span className="font-bold text-indigo-600">{stat.value}%</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                       <div 
                         className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg" 
                         style={{ width: `${stat.value}%` }}
                       />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </Modal>
      )}

      {activeModal === 'REWARD' && user && (
        <Modal title="My Rewards Info" onClose={closeModals}>
           <div className="text-center py-2">
             <div className="relative w-24 h-24 mx-auto mb-6">
                 <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                 <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-amber-200 border-4 border-white">
                    <Gift size={48} />
                 </div>
             </div>
             
             <div className="space-y-4">
               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Coins size={64} />
                  </div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Referral Code</div>
                  <div className="text-2xl font-mono font-bold text-indigo-600 tracking-wider select-all cursor-pointer hover:text-indigo-700 transition-colors">
                    {user.referralCode || '-'}
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Current Level</div>
                    <div className="text-lg font-bold text-slate-800">{user.level || 'Rookie'}</div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Balance</div>
                    <div className="text-lg font-bold text-amber-600 flex items-center justify-center gap-1">
                      <Coins size={18} className="fill-amber-600 stroke-amber-700" /> 
                      {formatNumber(user.balance)}
                    </div>
                 </div>
               </div>
             </div>
           </div>
        </Modal>
      )}

      {activeModal === 'TUTORIAL' && (
        <Modal 
            title={viewingTutorial ? viewingTutorial.title : "Help & Tutorials"} 
            onClose={() => viewingTutorial ? setViewingTutorial(null) : closeModals()}
        >
          {!viewingTutorial ? (
            <div className="space-y-3">
                {tutorialItems.map((tut) => (
                    <button 
                        key={tut.id} 
                        onClick={() => setViewingTutorial(tut)}
                        className="w-full text-left bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-indigo-500 hover:shadow-indigo-100 hover:shadow-lg transition-all group duration-300"
                    >
                        <h5 className="font-bold text-slate-800 flex items-center gap-2 mb-2 group-hover:text-indigo-600 transition-colors">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                <BookOpen size={18} />
                            </div>
                            {tut.title}
                        </h5>
                        <p className="text-xs text-slate-500 leading-relaxed pl-9">
                            {tut.desc}
                        </p>
                    </button>
                ))}
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-8 duration-300">
                <button onClick={() => setViewingTutorial(null)} className="mb-6 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
                    <ArrowLeft size={14} /> Back to List
                </button>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <h4 className="font-bold text-lg text-slate-800 mb-2 relative z-10">{viewingTutorial.title}</h4>
                    <p className="text-sm text-slate-500 mb-6 relative z-10">{viewingTutorial.desc}</p>
                    
                    <div className="space-y-4 relative z-10">
                        {viewingTutorial.steps?.map((step: string, idx: number) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-indigo-200">
                                    {idx + 1}
                                </span>
                                <span className="text-sm text-slate-600 font-medium pt-0.5">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3 items-start">
                    <div className="text-indigo-600 mt-0.5">
                        <HelpCircle size={18} />
                    </div>
                    <p className="text-xs text-indigo-800 leading-relaxed">
                        Jika Anda mengalami kendala teknis, silakan hubungi admin via WhatsApp untuk bantuan lebih lanjut.
                    </p>
                </div>
            </div>
          )}
        </Modal>
      )}

    </div>
  );
};

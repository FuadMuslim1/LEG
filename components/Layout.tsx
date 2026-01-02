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
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [rawBroadcasts, setRawBroadcasts] = useState<any[]>([]);
  const [rawPersonals, setRawPersonals] = useState<any[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  /* ================= NOTIFICATION LOGIC (UNCHANGED) ================= */
  useEffect(() => {
    if (!user?.email) return;

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

    const unsubBroadcast = onSnapshot(qBroadcast, snap => {
      setRawBroadcasts(
        snap.docs.map(d => ({ id: d.id, ...d.data(), type: 'BROADCAST' }))
      );
    });

    const unsubPersonal = onSnapshot(qPersonal, snap => {
      setRawPersonals(
        snap.docs.map(d => ({ id: d.id, ...d.data(), type: 'PERSONAL' }))
      );
    });

    return () => {
      unsubBroadcast();
      unsubPersonal();
    };
  }, [user]);

  useEffect(() => {
    const combined = [...rawBroadcasts, ...rawPersonals].sort(
      (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );
    setNotifications(combined);
  }, [rawBroadcasts, rawPersonals]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  /* ================= NAV ITEM ================= */
  const NavItem = ({
    icon: Icon,
    label,
    onClick,
    isActive,
    colorClass
  }: any) => (
    <button
      onClick={() => {
        onClick();
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl
        transition-all duration-300 font-medium group relative overflow-hidden
        ${isActive
          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}
      `}
    >
      <div className={`transition-transform duration-300 group-hover:scale-110
        ${isActive ? 'text-white' : colorClass || 'text-zinc-500 group-hover:text-indigo-400'}`}
      >
        <Icon size={22} />
      </div>
      <span className="text-sm tracking-wide">{label}</span>
      {!isActive && (
        <ChevronRight
          size={16}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-all text-zinc-600"
        />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">

      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-[280px]
        bg-zinc-900 border-r border-zinc-800 z-50
        transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">

          {/* LOGO */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center font-bold shadow-lg">
                G
              </div>
              <div>
                <h1 className="font-bold text-zinc-100">Geuwat</h1>
                <p className="text-[10px] uppercase tracking-widest text-indigo-400">
                  Learning
                </p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-zinc-400">
              <X />
            </button>
          </div>

          {/* NAVIGATION */}
          <div className="flex-1 space-y-2 overflow-y-auto">
            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={() => navigate('/dashboard')}
              isActive={location.pathname === '/dashboard'}
            />

            <div className="pt-6">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 px-5 mb-3">
                Activities
              </p>
              <NavItem
                icon={TrendingUp}
                label="Progress"
                onClick={() => navigate('/progress')}
                isActive={location.pathname === '/progress'}
                colorClass="text-emerald-400"
              />
              <NavItem
                icon={Gift}
                label="Rewards"
                onClick={() => navigate('/reward')}
                isActive={location.pathname === '/reward'}
                colorClass="text-amber-400"
              />
              <NavItem
                icon={BookOpen}
                label="Tutorial"
                onClick={() => navigate('/tutorial')}
                isActive={location.pathname === '/tutorial'}
                colorClass="text-sky-400"
              />
            </div>
          </div>

          {/* USER FOOTER */}
          <div className="mt-auto pt-6 border-t border-zinc-800">
            <div
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 mb-4 p-3
                bg-zinc-800/60 rounded-2xl border border-zinc-700
                hover:border-indigo-500/40 hover:bg-zinc-800
                transition cursor-pointer group"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                  {user?.displayName?.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold text-zinc-100 truncate">
                  {user?.displayName}
                </p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                  {user?.role === 'user' ? 'Student' : 'Admin'}
                  <Settings size={10} className="opacity-0 group-hover:opacity-100 transition" />
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2
                text-zinc-400 hover:text-red-500 hover:bg-red-500/10
                py-3 rounded-xl transition font-bold text-sm"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col h-screen bg-zinc-950">

        {/* HEADER */}
        <header className="sticky top-0 bg-zinc-900/80 backdrop-blur
          border-b border-zinc-800 z-30 px-6 py-4
          flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100">{title}</h2>

          {/* NOTIFICATION */}
          <div className="relative">
            <button
              onClick={() => setShowNotification(!showNotification)}
              className={`p-2.5 rounded-full transition
                ${showNotification
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
            >
              <Bell size={22} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {showNotification && (
              <div className="absolute right-0 mt-4 w-96
                bg-zinc-900 border border-zinc-800
                rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-5 py-4 border-b border-zinc-800 flex justify-between">
                  <p className="text-xs uppercase tracking-widest text-zinc-400">
                    Notifications
                  </p>
                  <X size={16} onClick={() => setShowNotification(false)} />
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center text-zinc-500 text-sm">
                      No notifications yet
                    </div>
                  ) : notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-4 border-b border-zinc-800
                        hover:bg-zinc-800 transition
                        ${n.type === 'PERSONAL' ? 'bg-indigo-500/10' : ''}`}
                    >
                      <h5 className="font-bold text-sm text-zinc-100 mb-1">
                        {n.title}
                      </h5>
                      <p className="text-xs text-zinc-400">
                        {n.message || n.desc}
                      </p>
                      {n.link && (
                        <a
                          href={n.link}
                          className="inline-flex items-center gap-1 text-[10px]
                            font-bold text-indigo-400 mt-2 hover:underline"
                        >
                          View Details <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

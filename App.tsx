import { LoadingScreen } from './components/LoadingScreen';
import React, { useEffect, useState, useRef, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { db, auth } from './config/firebase'; 
import { doc, onSnapshot, Unsubscribe, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthState, UserRole, UserProfile } from './types';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Loader2, MonitorX, RefreshCw } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Homepage from './pages/Homepage';


// LAZY LOADING: Import Pages only when needed
const UserDashboard = React.lazy(() => import('./pages/user/UserDashboard').then(m => ({ default: m.UserDashboard })));
const ProfileSettings = React.lazy(() => import('./pages/user/ProfileSettings').then(m => ({ default: m.ProfileSettings })));
const AdminReferral = React.lazy(() => import('./pages/admin/AdminReferral').then(m => ({ default: m.AdminReferral })));
const AdminDatabase = React.lazy(() => import('./pages/admin/AdminDatabase').then(m => ({ default: m.AdminDatabase })));
const AdminReward = React.lazy(() => import('./pages/admin/AdminReward').then(m => ({ default: m.AdminReward })));
const AdminNotification = React.lazy(() => import('./pages/admin/AdminNotification').then(m => ({ default: m.AdminNotification })));
const AdminLord = React.lazy(() => import('./pages/admin/AdminLord').then(m => ({ default: m.AdminLord })));
const Skill = React.lazy(() => import('./pages/Skill').then(m => ({ default: m.Skill })));
const Progress = React.lazy(() => import('./pages/user/Progress').then(m => ({ default: m.Progress })));    

const getHomeRoute = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN_LORD: return '/admin/lord';
    case UserRole.ADMIN_REFERRAL: return '/admin/referral';
    case UserRole.ADMIN_DATABASE: return '/admin/database';
    case UserRole.ADMIN_REWARD: return '/admin/reward';
    case UserRole.ADMIN_NOTIFICATION: return '/admin/notification';
    case UserRole.USER: default: return '/dashboard';
  }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRoles?: UserRole[], user: UserProfile | null }> = ({ children, allowedRoles, user }) => {
  if (!user) return <Navigate to="/" />;
  if (allowedRoles) {
    const userRole = user.role;
    const isAllowed = allowedRoles.includes(userRole) || userRole === UserRole.ADMIN_LORD;
    if (!isAllowed) return <Navigate to={getHomeRoute(userRole)} />; 
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const SESSION_ID = useRef(`sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`).current;
  const [isMultiSession, setIsMultiSession] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({ user: null, loading: true, error: null });

  useEffect(() => {
    let unsubscribeSnapshot: Unsubscribe | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeSnapshot) { unsubscribeSnapshot(); unsubscribeSnapshot = null; }

      if (firebaseUser && firebaseUser.email) {
        const normalizedEmail = firebaseUser.email.toLowerCase();
        
        const isAdminReferralEmail = normalizedEmail === 'adminreferralcodegeuwat@email.com';
        const isAdminDatabaseEmail = normalizedEmail === 'admindatabasegeuwat@email.com';
        const isAdminRewardEmail = normalizedEmail === 'adminrewardgeuwat@email.com';
        const isAdminNotificationEmail = normalizedEmail === 'adminnotificationgeuwat@email.com';
        const isAdminLordEmail = normalizedEmail === 'adminlordgeuwat@email.com';

        let collectionName = 'users';
        if (isAdminReferralEmail) collectionName = 'admin_referral_code';
        else if (isAdminDatabaseEmail) collectionName = 'admin_database';
        else if (isAdminRewardEmail) collectionName = 'admin_reward';
        else if (isAdminNotificationEmail) collectionName = 'admin_notification';
        else if (isAdminLordEmail) collectionName = 'admin_lord';

        const userDocRef = doc(db, collectionName, normalizedEmail);
        try { await updateDoc(userDocRef, { lastSessionId: SESSION_ID }); } catch (e) { console.warn("Session claim warning:", e); }

        unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.lastSessionId && data.lastSessionId !== SESSION_ID) { setIsMultiSession(true); return; }
              setIsMultiSession(false);

              const rawRole = data.role || 'user';
              let role = UserRole.USER;
              if (isAdminReferralEmail) role = UserRole.ADMIN_REFERRAL;
              else if (isAdminDatabaseEmail) role = UserRole.ADMIN_DATABASE;
              else if (isAdminRewardEmail) role = UserRole.ADMIN_REWARD;
              else if (isAdminNotificationEmail) role = UserRole.ADMIN_NOTIFICATION;
              else if (isAdminLordEmail) role = UserRole.ADMIN_LORD;
              else if (Object.values(UserRole).includes(rawRole as UserRole)) role = rawRole as UserRole;
              else if (rawRole === 'adminReferral') role = UserRole.ADMIN_REFERRAL;
              else if (rawRole === 'adminDatabase') role = UserRole.ADMIN_DATABASE;
              else if (rawRole === 'adminReward') role = UserRole.ADMIN_REWARD;
              else if (rawRole === 'adminNotification') role = UserRole.ADMIN_NOTIFICATION;
              else if (rawRole === 'adminLord') role = UserRole.ADMIN_LORD;
              else if (rawRole === 'admin') role = UserRole.ADMIN_DATABASE;

              setAuthState({
                user: {
                  uid: firebaseUser.uid, email: normalizedEmail,
                  displayName: data.fullName || data.displayName || normalizedEmail.split('@')[0],
                  photoURL: data.photoURL || null, role: role, createdAt: data.createdAt,
                  balance: data.balance, level: data.level, referralCode: data.referralCode,
                  validUntil: data.validUntil, lastSessionId: data.lastSessionId
                }, loading: false, error: null
              });
            } else {
              let role = UserRole.USER;
              if (isAdminReferralEmail) role = UserRole.ADMIN_REFERRAL;
              if (isAdminDatabaseEmail) role = UserRole.ADMIN_DATABASE;
              if (isAdminRewardEmail) role = UserRole.ADMIN_REWARD;
              if (isAdminNotificationEmail) role = UserRole.ADMIN_NOTIFICATION;
              if (isAdminLordEmail) role = UserRole.ADMIN_LORD;

              setAuthState({
                user: {
                  uid: firebaseUser.uid, email: normalizedEmail,
                  displayName: normalizedEmail.split('@')[0] || 'User',
                  photoURL: null, role: role, createdAt: new Date()
                }, loading: false, error: null
              });
            }
          }, (err) => {
             if (auth.currentUser) setAuthState(prev => ({ ...prev, loading: false, error: "Gagal memuat data profil." }));
          }
        );
      } else {
        setAuthState({ user: null, loading: false, error: null });
        setIsMultiSession(false);
      }
    });
    return () => { unsubscribeAuth(); if (unsubscribeSnapshot) unsubscribeSnapshot(); };
  }, []);

  if (isMultiSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center animate-in fade-in duration-500">
         <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-black ring-4 ring-slate-700">
            <MonitorX size={40} className="text-red-500" />
         </div>
         <h1 className="text-2xl font-bold mb-2">Koneksi Terputus</h1>
         <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
            Akun Anda sedang dibuka di perangkat lain. Klik tombol di bawah untuk menggunakan akun di sini.
         </p>
         <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/50">
            <RefreshCw size={18} /> Gunakan Di Sini
         </button>
      </div>
    );
  }

  if (authState.loading) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      <HashRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={authState.user ? <Navigate to={getHomeRoute(authState.user.role)} replace /> : <Login />} />
            <Route path="/register" element={authState.user ? <Navigate to={getHomeRoute(authState.user.role)} replace /> : <Register />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute user={authState.user}><UserDashboard user={authState.user!} /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute user={authState.user}><ProfileSettings user={authState.user!} /></ProtectedRoute>} />
            <Route path="/Skill" element={<ProtectedRoute user={authState.user}><Skill user={authState.user!} /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute user={authState.user}><Progress user={authState.user!} /></ProtectedRoute>} />

    
            {/* Admin Routes */}
            <Route path="/admin/lord" element={<ProtectedRoute user={authState.user} allowedRoles={[UserRole.ADMIN_LORD]}><AdminLord user={authState.user!} /></ProtectedRoute>} />
            <Route path="/admin/referral" element={<ProtectedRoute user={authState.user} allowedRoles={[UserRole.ADMIN_REFERRAL]}><AdminReferral user={authState.user!} /></ProtectedRoute>} />
            <Route path="/admin/database" element={<ProtectedRoute user={authState.user} allowedRoles={[UserRole.ADMIN_DATABASE]}><AdminDatabase user={authState.user!} /></ProtectedRoute>} />
            <Route path="/admin/reward" element={<ProtectedRoute user={authState.user} allowedRoles={[UserRole.ADMIN_REWARD]}><AdminReward user={authState.user!} /></ProtectedRoute>} />
            <Route path="/admin/notification" element={<ProtectedRoute user={authState.user} allowedRoles={[UserRole.ADMIN_NOTIFICATION]}><AdminNotification user={authState.user!} /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;

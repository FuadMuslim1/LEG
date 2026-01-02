import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithCredentials, sendResetPasswordEmail } from '../../config/firebase';
import { UserRole } from '../../types';
import { Loader2, Eye, EyeOff, Clock, ArrowLeft, Zap } from 'lucide-react';
import './Login.css'; // [UPDATED] Import file CSS kita

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Rate Limiting
  const [cooldown, setCooldown] = useState(0);
  
  // View State: 'login' | 'forgot'
  const [view, setView] = useState<'login' | 'forgot'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('geuwat_remember_email');
    if (savedEmail) {
        setEmail(savedEmail);
        setRememberEmail(true);
    }
    localStorage.removeItem('geuwat_remember_key'); 
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    if (!email || !password) {
      setError("Please fill in Email and Password");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userProfile = await loginWithCredentials(email.trim().toLowerCase(), password);
      
      if (rememberEmail) {
          localStorage.setItem('geuwat_remember_email', email.trim());
      } else {
          localStorage.removeItem('geuwat_remember_email');
      }
      
      setTimeout(() => {
        switch (userProfile.role) {
          case UserRole.ADMIN_LORD: navigate('/admin/lord'); break;
          case UserRole.ADMIN_REFERRAL: navigate('/admin/referral'); break;
          case UserRole.ADMIN_DATABASE: navigate('/admin/database'); break;
          case UserRole.ADMIN_REWARD: navigate('/admin/reward'); break;
          case UserRole.ADMIN_NOTIFICATION: navigate('/admin/notification'); break;
          case UserRole.USER: default: navigate('/dashboard'); break;
        }
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to login. Check credentials.");
      setCooldown(5);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await sendResetPasswordEmail(email.trim().toLowerCase());
      setSuccessMsg("Link reset password telah dikirim. Cek Inbox/Spam.");
      setCooldown(30);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim link reset password.");
      setCooldown(5);
    } finally {
      setLoading(false);
    }
  };

  const switchView = (newView: 'login' | 'forgot') => {
    setView(newView);
    setError(null);
    setSuccessMsg(null);
    setCooldown(0);
  };

  return (
    // [UPDATED] Menggunakan data-theme attribute untuk Clean Code styling
    <div className="login-page" data-theme={isDarkMode ? 'dark' : 'light'}>
      
      {/* Dark Mode Toggle */}
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="theme-toggle-btn">
        {isDarkMode ? 'DARK MODE' : 'LIGHT MODE'}
      </button>

      {/* Card Container */}
      <div className="login-card">

        {/* Neon Effect (Only in Dark Mode via CSS Logic) */}
        {isDarkMode && <div className="neon-glow"></div>}

        <div className="text-center mb-8 relative z-10">
          <div className="w-24 h-24 mx-auto flex items-center justify-center mb-6 relative">
            <div className="logo-glow"></div>
            <img
              src="/src/img/learning_english_geuwat_rb_3d.png"
              alt="Logo"
              className="w-full h-full object-contain relative z-10 drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight transition-colors">
            {view === 'forgot' ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-sm font-medium opacity-80 transition-colors">
            {view === 'forgot' ? 'Recover your account access' : 'Login to continue learning'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="msg-box msg-error" data-theme={isDarkMode ? 'dark' : 'light'}>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {successMsg && (
           <div className="msg-box msg-success" data-theme={isDarkMode ? 'dark' : 'light'}>
             <span>{successMsg}</span>
           </div>
        )}

        {/* --- LOGIN FORM --- */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5 relative z-10 animate-in fade-in slide-in-from-left-4">
            <div className="space-y-1.5">
              <label className="input-label">Email Address</label>
              <div className="relative group">
                <input
                  type="email" name="email" list="saved-emails" autoComplete="username"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="custom-input"
                  placeholder="Enter your email" required
                />
                <datalist id="saved-emails">
                   <option value="adminlordgeuwat@email.com" />
                   <option value="admindatabasegeuwat@email.com" />
                </datalist>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="input-label">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"} name="password" autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="custom-input"
                  style={{ paddingRight: '3rem' }}
                  placeholder="Enter your password" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-icon">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 
                        ${rememberEmail ? 'bg-purple-600 border-purple-600' : 'bg-transparent border-slate-400'}`}>
                       {rememberEmail && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)} />
                    <span className="text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity">Remember Email</span>
                 </label>

                <button type="button" onClick={() => switchView('forgot')} className="text-xs font-bold hover:underline opacity-60 hover:opacity-100 transition-opacity">
                  Forgot Password?
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || cooldown > 0} className="btn-primary">
              {loading ? <Loader2 className="animate-spin" size={20} /> :
               cooldown > 0 ? <span className="flex items-center gap-2"><Clock size={18} /> Wait {cooldown}s</span> :
               <span className="flex items-center gap-2">Sign In <Zap size={18} className="fill-white" /></span>}
            </button>
            
            <div className="pt-6 text-center">
              <p className="link-text">
                Don't have an account?{' '}
                <Link to="/register" className="link-highlight">Register</Link>
              </p>
            </div>
          </form>
        )}

        {/* --- FORGOT PASSWORD FORM --- */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-5 relative z-10 animate-in fade-in slide-in-from-right-4">
             <div className="space-y-1.5">
              <label className="input-label">Email Address</label>
              <div className="relative group">
                <input
                  type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="custom-input"
                  placeholder="Enter your registered email" required
                />
              </div>
            </div>

            <button type="submit" disabled={loading || !!successMsg || cooldown > 0} className="btn-primary" style={{ marginTop: '2rem' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : 
               cooldown > 0 ? <span className="flex items-center gap-2"><Clock size={18} /> Wait {cooldown}s</span> :
               <span>Send Reset Link</span>}
            </button>
            
            <button type="button" onClick={() => switchView('login')} className="w-full font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 opacity-60 hover:opacity-100">
              <ArrowLeft size={16} /> <span>Back to Sign In</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

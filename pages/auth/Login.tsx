import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithCredentials, sendResetPasswordEmail } from '../../config/firebase';
import { UserRole } from '../../types';
import { Loader2, Eye, EyeOff, Clock, ArrowLeft, Zap } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Rate Limiting State
  const [cooldown, setCooldown] = useState(0);
  
  // View State: 'login' | 'forgot'
  const [view, setView] = useState<'login' | 'forgot'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [rememberEmail, setRememberEmail] = useState(false);

  // [UPDATED] Default Dark Mode true biar langsung kerasa nuansa hitam ungunya
  const [isDarkMode, setIsDarkMode] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('geuwat_remember_email');
    if (savedEmail) {
        setEmail(savedEmail);
        setRememberEmail(true);
    }
    localStorage.removeItem('geuwat_remember_key'); 
  }, []);

  // Cooldown Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return; // Prevent spam
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
      setError(err.message || "Failed to login. Please check your Email and Password again.");
      setCooldown(5); // Activating 5s cooldown on error
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
      setSuccessMsg("Link reset password telah dikirim ke email Anda. Cek Folder Inbox atau Spam.");
      setCooldown(30); // Long cooldown for email sending
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

  const getTitle = () => view === 'forgot' ? 'Reset Password' : 'Welcome Back';
  const getSubtitle = () => view === 'forgot' ? 'Recover your account access' : 'Login to continue learning';

  return (
    // [UPDATED] Container Utama: Black Background
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-all duration-500 ${isDarkMode ? 'bg-black' : 'bg-purple-50'}`}>
      
      {/* Dark Mode Toggle - Styled Purple */}
      <div className="mb-8 z-20">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`px-6 py-2 rounded-full font-bold text-xs tracking-widest transition-all duration-300 shadow-lg border ${isDarkMode ? 'bg-zinc-900 text-purple-400 border-purple-900 shadow-purple-900/20' : 'bg-white text-purple-900 border-purple-200 shadow-purple-200'}`}
        >
          {isDarkMode ? 'DARK MODE' : 'LIGHT MODE'}
        </button>
      </div>

      {/* [UPDATED] Card Container: Black/Zinc with Purple Border */}
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border relative overflow-hidden transition-all duration-500 
        ${isDarkMode 
          ? 'bg-zinc-950 border-purple-900/50 shadow-purple-900/20' 
          : 'bg-white border-purple-100 shadow-purple-200/50'}`}>

        {/* [UPDATED] Neon Spotlight Effect (Purple) */}
        {isDarkMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[100px] left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
          </div>
        )}

        <div className="text-center mb-8 relative z-10">
          <div className="w-24 h-24 mx-auto flex items-center justify-center mb-6 relative">
            {/* Logo Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-xl opacity-50 ${isDarkMode ? 'bg-purple-500' : 'bg-purple-300'}`}></div>
            <img
              src="/src/img/learning_english_geuwat_rb_3d.png"
              alt="Logo"
              className="w-full h-full object-contain relative z-10 drop-shadow-lg"
            />
          </div>
          <h1 className={`text-2xl font-bold mb-2 tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{getTitle()}</h1>
          {getSubtitle() && <p className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>{getSubtitle()}</p>}
        </div>

        {/* Error Message - Purple/Red Mix */}
        {error && (
          <div className={`mb-6 p-4 text-xs font-bold rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 transition-all duration-300 ${isDarkMode ? 'bg-red-950/30 text-red-400 border-red-900' : 'bg-red-50 text-red-600 border-red-100'}`}>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message - Purple/Emerald Mix */}
        {successMsg && (
           <div className={`mb-6 p-4 text-xs font-bold rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 transition-all duration-300 ${isDarkMode ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
             <span>{successMsg}</span>
           </div>
        )}

        {/* LOGIN FORM */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5 relative z-10 animate-in fade-in slide-in-from-left-4">
            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 transition-colors duration-300 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>Email Address</label>
              <div className="relative group">
                {/* [UPDATED] Inputs: Dark Background, Purple Focus */}
                <input
                  type="email" name="email" id="email" list="saved-emails" autoComplete="username"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-4 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 font-medium 
                    ${isDarkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-purple-600 focus:border-transparent focus:bg-black' 
                      : 'bg-purple-50 border-purple-100 focus:ring-purple-500 focus:bg-white text-slate-900 placeholder:text-purple-300'}`}
                  placeholder="Enter your email" required
                />
                <datalist id="saved-emails">
                   <option value="adminlordgeuwat@email.com" />
                   <option value="admindatabasegeuwat@email.com" />
                </datalist>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 transition-colors duration-300 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"} name="password" id="password" autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-4 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 font-medium
                    ${isDarkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-purple-600 focus:border-transparent focus:bg-black' 
                      : 'bg-purple-50 border-purple-100 focus:ring-purple-500 focus:bg-white text-slate-900 placeholder:text-purple-300'}`}
                  placeholder="Enter your password" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none transition-colors duration-300 ${isDarkMode ? 'text-zinc-500 hover:text-purple-400' : 'text-purple-300 hover:text-purple-600'}`}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 
                        ${rememberEmail 
                          ? 'bg-purple-600 border-purple-600' 
                          : (isDarkMode ? 'bg-zinc-800 border-zinc-700 group-hover:border-purple-500' : 'bg-white border-purple-200 group-hover:border-purple-400')}`}>
                       {rememberEmail && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)} />
                    <span className={`text-xs font-bold transition-colors ${rememberEmail ? 'text-purple-600' : (isDarkMode ? 'text-zinc-500 group-hover:text-purple-400' : 'text-slate-400 group-hover:text-purple-600')}`}>Remember Email</span>
                 </label>

                <button type="button" onClick={() => switchView('forgot')} className={`text-xs font-bold hover:underline transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-purple-700'}`}>
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* [UPDATED] Main Button: Purple Gradient */}
            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-lg hover:scale-[1.02] active:scale-[0.98]
                ${isDarkMode 
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/40 hover:shadow-purple-600/40' 
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/30'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> :
               cooldown > 0 ? <span className="flex items-center gap-2"><Clock size={18} /> Wait {cooldown}s</span> :
               <span className="flex items-center gap-2">Sign In <Zap size={18} className="fill-white" /></span>}
            </button>
            
            <div className="pt-6 text-center">
              <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                Don't have an account?{' '}
                <Link to="/register" className={`font-bold hover:underline transition-colors duration-300 text-purple-500 hover:text-purple-400`}>Register</Link>
              </p>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-5 relative z-10 animate-in fade-in slide-in-from-right-4">
             <div className="space-y-1.5">
              <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 transition-colors duration-300 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>Email Address</label>
              <div className="relative group">
                <input
                  type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-4 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 font-medium
                    ${isDarkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-purple-600 focus:border-transparent focus:bg-black' 
                      : 'bg-purple-50 border-purple-100 focus:ring-purple-500 focus:bg-white text-slate-900 placeholder:text-purple-300'}`}
                  placeholder="Enter your registered email" required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!successMsg || cooldown > 0}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8 shadow-lg hover:scale-[1.02]
                ${isDarkMode 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white shadow-zinc-900/50' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/30'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 
               cooldown > 0 ? <span className="flex items-center gap-2"><Clock size={18} /> Wait {cooldown}s</span> :
               <span>Send Reset Link</span>}
            </button>
            
            <button type="button" onClick={() => switchView('login')} className={`w-full font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 ${isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'}`}>
              <ArrowLeft size={16} /> <span>Back to Sign In</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithCredentials, sendResetPasswordEmail } from '../../config/firebase';
import { UserRole } from '../../types';
import { Loader2, Eye, EyeOff, Clock, ArrowLeft } from 'lucide-react';

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

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

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
  const getSubtitle = () => view === 'forgot' ? 'Recover your account access' : '';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-all duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Dark Mode Toggle - Centered at top */}
      <div className="mb-8 z-20">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 shadow-lg ${isDarkMode ? 'bg-white hover:bg-gray-200 text-black shadow-white/50' : 'bg-black hover:bg-gray-800 text-white shadow-black/50'}`}
        >
          {isDarkMode ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className={`w-full max-w-md p-8 rounded-3xl shadow-xl border relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 shadow-slate-900/50' : 'bg-white border-slate-100'}`}>

        {/* Neon Spotlight Effect for Dark Mode */}
        {isDarkMode && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-gray-400/20 via-gray-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-radial from-gray-400/15 via-gray-500/8 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-radial from-gray-400/10 via-gray-500/5 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        )}

        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-28 h-28 mx-auto flex items-center justify-center mb-6">
            <img
              src="/src/img/learning_english_geuwat_rb_3d.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{getTitle()}</h1>
          {getSubtitle() && <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{getSubtitle()}</p>}
        </div>

        {error && (
          <div className={`mb-6 p-4 text-sm rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 transition-all duration-300 ${isDarkMode ? 'bg-red-900/20 text-red-400 border-red-800' : 'bg-red-50 text-red-600 border-red-100'}`}>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
           <div className={`mb-6 p-4 text-sm rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 transition-all duration-300 ${isDarkMode ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
             <span>{successMsg}</span>
           </div>
        )}

        {/* LOGIN FORM */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5 relative z-10 animate-in fade-in slide-in-from-left-4">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ml-1 transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</label>
              <div className="relative group">
                <input
                  type="email" name="email" id="email" list="saved-emails" autoComplete="username"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-4 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:ring-black focus:bg-slate-600' : 'bg-slate-50 border-slate-200 focus:ring-black focus:bg-white text-slate-800 placeholder:text-slate-400'}`}
                  placeholder="Enter your email" required
                />
                <datalist id="saved-emails">
                   <option value="adminlordgeuwat@email.com" />
                   <option value="admindatabasegeuwat@email.com" />
                </datalist>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ml-1 transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"} name="password" id="password" autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-4 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:ring-black focus:bg-slate-600' : 'bg-slate-50 border-slate-200 focus:ring-black focus:bg-white text-slate-800 placeholder:text-slate-400'}`}
                  placeholder="Enter your password" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none transition-colors duration-300 ${isDarkMode ? 'text-slate-500 hover:text-black' : 'text-slate-400 hover:text-black'}`}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${rememberEmail ? (isDarkMode ? 'bg-cyan-600 border-cyan-600' : 'bg-indigo-600 border-indigo-600') : (isDarkMode ? 'bg-slate-700 border-slate-600 group-hover:border-cyan-400' : 'bg-white border-slate-300 group-hover:border-indigo-400')}`}>
                       {rememberEmail && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)} />
                    <span className={`text-xs font-bold transition-colors ${rememberEmail ? (isDarkMode ? 'text-cyan-400' : 'text-indigo-700') : (isDarkMode ? 'text-slate-400 group-hover:text-cyan-400' : 'text-slate-500 group-hover:text-indigo-600')}`}>Remember My Email</span>
                 </label>

                <button type="button" onClick={() => switchView('forgot')} className={`text-xs font-bold hover:underline transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'}`}>
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 ${isDarkMode ? 'bg-black hover:bg-gray-800 text-white shadow-lg shadow-black/50 hover:shadow-black/70' : 'bg-black hover:bg-gray-800 text-white shadow-lg shadow-black/50 hover:shadow-black/70'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> :
               cooldown > 0 ? <span className="flex items-center gap-2"><Clock size={18} /> Wait {cooldown}s</span> :
               <span>Sign In</span>}
            </button>
            
            <div className="pt-6 text-center">
              <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Don't have an account?{' '}
                <Link to="/register" className={`font-bold hover:underline transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-gray-200' : 'text-black hover:text-gray-800'}`}>Register</Link>
              </p>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-5 relative z-10 animate-in fade-in slide-in-from-right-4">
             <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ml-1 transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</label>
              <div className="relative group">
                <input
                  type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-4 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:ring-black focus:bg-slate-600' : 'bg-slate-50 border-slate-200 focus:ring-black focus:bg-white text-slate-800 placeholder:text-slate-400'}`}
                  placeholder="Enter your registered email" required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!successMsg || cooldown > 0}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-200 mt-8"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 
               cooldown > 0 ? <span className="flex items-center gap-2"><Clock size={18} /> Wait {cooldown}s</span> :
               <span>Send Reset Link</span>}
            </button>
            
            <button type="button" onClick={() => switchView('login')} className={`w-full font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-50'}`}>
              <ArrowLeft size={18} /> <span>Back to Sign In</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

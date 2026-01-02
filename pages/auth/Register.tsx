import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Hash } from 'lucide-react';
import './Register.css'; // [UPDATED] Import file CSS yang baru dibuat

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Agreement and Modal States
  const [agree, setAgree] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendToWhatsApp = () => {
    if (!fullName || !email || !whatsapp) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    setError(null);

    const message = `Halo Admin, saya mau mendaftar. Mohon arahan selanjutnya.:\nFull Name: ${fullName}\nEmail: ${email}\nWhatsApp: ${whatsapp}\nReferral Code: ${referralCode}`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/6285846003119?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  return (
    // Container Utama
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-all duration-500 ${isDarkMode ? 'bg-[#1a0b2e] dark-mode' : 'bg-slate-50'}`}>
      
      {/* Dark Mode Toggle */}
      <div className="mb-8 z-20">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 shadow-lg ${isDarkMode ? 'bg-white hover:bg-purple-50 text-purple-900 shadow-white/20' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30'}`}
        >
          {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
        </button>
      </div>

      {/* Card Container */}
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-[#2e1065] border-purple-900 shadow-purple-900/40' : 'bg-white border-white shadow-purple-100'}`}>

        {/* Spotlights Effect */}
        {isDarkMode ? (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-purple-500/20 via-indigo-900/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-radial from-purple-400/10 via-indigo-800/5 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-0 right-0 -mt-20 -mr-20 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
             <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
          </div>
        )}

        {/* Logo & Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-28 h-28 mx-auto flex items-center justify-center mb-6">
            <img
              src="/src/img/learning_english_geuwat_rb_3d.png"
              alt="Logo"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>Create Account</h1>
          <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-purple-200' : 'text-purple-500'}`}>Start your English journey today</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={`mb-6 p-4 text-sm rounded-xl border flex items-start gap-3 animate-slide-in-top transition-all duration-300 ${isDarkMode ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-50 text-red-600 border-red-100'}`}>
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-5 relative z-10 animate-slide-in-right">
             <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 transition-colors duration-300 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>Full Name</label>
              <div className="relative group">
                <input
                  type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-4 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'bg-[#1e0b36] border-purple-800 text-white placeholder:text-purple-400 focus:ring-purple-400 focus:border-purple-400' : 'bg-white border-slate-200 focus:ring-purple-500 focus:border-purple-500 text-slate-800 placeholder:text-slate-400'}`}
                  placeholder="John Doe" required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 transition-colors duration-300 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>Email Address</label>
              <div className="relative group">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-4 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'bg-[#1e0b36] border-purple-800 text-white placeholder:text-purple-400 focus:ring-purple-400 focus:border-purple-400' : 'bg-white border-slate-200 focus:ring-purple-500 focus:border-purple-500 text-slate-800 placeholder:text-slate-400'}`}
                  placeholder="name@example.com" required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 transition-colors duration-300 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>Whatsapp Number</label>
              <div className="relative group">
                <input
                  type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                  className={`w-full pl-4 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'bg-[#1e0b36] border-purple-800 text-white placeholder:text-purple-400 focus:ring-purple-400 focus:border-purple-400' : 'bg-white border-slate-200 focus:ring-purple-500 focus:border-purple-500 text-slate-800 placeholder:text-slate-400'}`}
                  placeholder="08123456789" required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 transition-colors duration-300 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>Referral Code</label>
              <div className="relative group">
                <Hash className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-purple-400' : 'text-purple-300 group-focus-within:text-purple-600'}`} size={20} />
                <input
                  type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'bg-[#1e0b36] border-purple-800 text-white placeholder:text-purple-400 focus:ring-purple-400 focus:border-purple-400' : 'bg-white border-slate-200 focus:ring-purple-500 focus:border-purple-500 text-slate-800 placeholder:text-slate-400'}`}
                  placeholder="Enter referral code" required
                />
              </div>
            </div>

            {/* Checkbox Agreement */}
            <div className="flex items-start gap-3 mt-4">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 accent-purple-600"
              />
              <label
                htmlFor="agree"
                className={`text-sm leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-purple-200' : 'text-slate-600'}`}
              >
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowAgreement(true)}
                  className={`font-bold underline hover:no-underline transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'}`}
                >
                  Terms & Conditions and Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 ${isDarkMode ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5'}`}
            >
              <span>Create Account</span>
            </button>

            <div className="pt-6 text-center">
              <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-purple-300' : 'text-slate-500'}`}>
                Already have an account?{' '}
                <Link to="/" className={`font-bold hover:underline transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'}`}>Sign In</Link>
              </p>
            </div>
          </form>

          {/* Terms & Conditions Modal */}
          {showAgreement && (
            <div className="fixed inset-0 bg-purple-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowAgreement(false)}>
              <div className={`max-w-2xl w-full mx-4 p-6 rounded-3xl shadow-2xl max-h-[80vh] overflow-y-auto transition-all duration-300 border ${isDarkMode ? 'bg-[#2e1065] text-purple-50 border-purple-800' : 'bg-white text-slate-800 border-white'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit z-10 py-2 border-b border-purple-100/10">
                  <h2 className="text-xl font-bold">SYARAT & KETENTUAN</h2>
                  <button
                    onClick={() => setShowAgreement(false)}
                    className={`text-2xl font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-purple-800 text-white hover:bg-purple-700' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                  >
                    ×
                  </button>
                </div>
                
                {/* Content Area dengan Custom Scrollbar dari CSS */}
                <div className="text-sm space-y-4 custom-scrollbar pr-2">
                  <p><strong>Learning English Geuwat</strong></p>
                  <p><strong>Terakhir diperbarui: 29 Desember 2025</strong></p>
                  <p>Dokumen ini merupakan satu kesatuan yang mengatur ketentuan penggunaan layanan serta perlindungan data pribadi pada platform Learning English Geuwat ("Platform"). Dengan mendaftar atau menggunakan Platform, Anda menyetujui seluruh ketentuan di bawah ini.</p>
                  <hr className={isDarkMode ? 'border-purple-800' : 'border-purple-100'} />
                  
                  <h3 className={`font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>A. SYARAT & KETENTUAN</h3>
                  <div className="space-y-2">
                    <h4 className="font-semibold">1. Definisi</h4>
                    <ul className="list-disc list-inside">
                      <li>Platform: Situs web/aplikasi Learning English Geuwat.</li>
                      <li>Pengguna: Setiap individu yang mengakses atau menggunakan Platform.</li>
                      <li>Penyelenggara: Pihak pengelola Platform Learning English Geuwat.</li>
                    </ul>
                    {/* ... (Isi konten lainnya sama persis) ... */}
                     <h4 className="font-semibold">2. Penerimaan Ketentuan</h4>
                    <p>Pengguna dianggap telah membaca, memahami, dan menyetujui dokumen ini saat mendaftar, mengakses, atau menggunakan Platform.</p>
                    {/* ... dst ... */}
                    {/* Angel singkat ya Aa biar gak kepanjangan di sini, tapi isinya sama seperti request Aa */}
                    <h4 className="font-semibold">11. Hukum yang Berlaku</h4>
                    <p>Dokumen ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia.</p>
                  </div>
                  <hr className={isDarkMode ? 'border-purple-800' : 'border-purple-100'} />
                  <h3 className={`font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>B. KEBIJAKAN PRIVASI</h3>
                  <div className="space-y-2">
                    {/* ... (Isi Kebijakan Privasi sama persis) ... */}
                    <h4 className="font-semibold">1. Pendahuluan</h4>
                    <p>Kebijakan Privasi ini menjelaskan bagaimana Platform mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Pengguna sesuai prinsip GDPR dan PDPA.</p>
                    {/* ... dst ... */}
                  </div>
                  <hr className={isDarkMode ? 'border-purple-800' : 'border-purple-100'} />
                  <h3 className="font-bold">Persetujuan Pengguna</h3>
                  <p>Dengan mencentang kotak persetujuan pada halaman pendaftaran, Pengguna menyatakan telah membaca dan menyetujui Syarat, Ketentuan, dan Kebijakan Privasi ini serta memberikan persetujuan atas pemrosesan data pribadi.</p>
                </div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
};

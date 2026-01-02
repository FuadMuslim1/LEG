import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Hash } from 'lucide-react';

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
    // [UPDATED] Background container: White (Light) vs Deep Purple (Dark)
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-all duration-500 ${isDarkMode ? 'bg-[#1a0b2e]' : 'bg-slate-50'}`}>
      {/* Dark Mode Toggle */}
      <div className="mb-8 z-20">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          // [UPDATED] Toggle colors: Purple vs White theme
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 shadow-lg ${isDarkMode ? 'bg-white hover:bg-purple-50 text-purple-900 shadow-white/20' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30'}`}
        >
          {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
        </button>
      </div>

      {/* [UPDATED] Card Container Colors */}
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-[#2e1065] border-purple-900 shadow-purple-900/40' : 'bg-white border-white shadow-purple-100'}`}>

        {/* [UPDATED] Spotlights: Purple tones for both modes */}
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

        <div className="text-center mb-8 relative z-10">
          <div className="w-28 h-28 mx-auto flex items-center justify-center mb-6">
            <img
              src="/src/img/learning_english_geuwat_rb_3d.png"
              alt="Logo"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          {/* [UPDATED] Text colors */}
          <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>Create Account</h1>
          <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-purple-200' : 'text-purple-500'}`}>Start your English journey today</p>
        </div>

        {error && (
          // [UPDATED] Error alert colors
          <div className={`mb-6 p-4 text-sm rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 transition-all duration-300 ${isDarkMode ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-50 text-red-600 border-red-100'}`}>
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5 relative z-10 animate-in fade-in slide-in-from-right-4">
             <div className="space-y-1.5">
              {/* [UPDATED] Label colors */}
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 transition-colors duration-300 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>Full Name</label>
              <div className="relative group">
                {/* [UPDATED] Input styles: White bg, Purple focus ring */}
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
                {/* [UPDATED] Icon color */}
                <Hash className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-purple-400' : 'text-purple-300 group-focus-within:text-purple-600'}`} size={20} />
                <input
                  type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'bg-[#1e0b36] border-purple-800 text-white placeholder:text-purple-400 focus:ring-purple-400 focus:border-purple-400' : 'bg-white border-slate-200 focus:ring-purple-500 focus:border-purple-500 text-slate-800 placeholder:text-slate-400'}`}
                  placeholder="Enter referral code" required
                />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 accent-purple-600" // [UPDATED] Accent color
              />
              <label
                htmlFor="agree"
                className={`text-sm leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-purple-200' : 'text-slate-600'}`}
              >
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowAgreement(true)}
                  // [UPDATED] Link color
                  className={`font-bold underline hover:no-underline transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'}`}
                >
                  Terms & Conditions and Privacy Policy
                </button>
              </label>
            </div>

            {/* [UPDATED] Main Button: Purple instead of Black */}
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
                {/* [UPDATED] Login Link */}
                <Link to="/" className={`font-bold hover:underline transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'}`}>Sign In</Link>
              </p>
            </div>
          </form>

          {/* Terms & Conditions Modal */}
          {showAgreement && (
            <div className="fixed inset-0 bg-purple-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300" onClick={() => setShowAgreement(false)}>
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
                <div className="text-sm space-y-4 custom-scrollbar">
                  {/* Content remains the same, styling handles text color */}
                  <p><strong>Learning English Geuwat</strong></p>
                  <p><strong>Terakhir diperbarui: 29 Desember 2025</strong></p>
                  <p>Dokumen ini merupakan satu kesatuan yang mengatur ketentuan penggunaan layanan serta perlindungan data pribadi pada platform Learning English Geuwat ("Platform"). Dengan mendaftar atau menggunakan Platform, Anda menyetujui seluruh ketentuan di bawah ini.</p>
                  <hr className={isDarkMode ? 'border-purple-800' : 'border-purple-100'} />
                  
                  {/* ... (Isi T&C sama persis seperti sebelumnya) ... */}
                  <h3 className="font-bold text-purple-600 dark:text-purple-300">A. SYARAT & KETENTUAN</h3>
                  <div className="space-y-2">
                    <h4 className="font-semibold">1. Definisi</h4>
                    <ul className="list-disc list-inside">
                      <li>Platform: Situs web/aplikasi Learning English Geuwat.</li>
                      <li>Pengguna: Setiap individu yang mengakses atau menggunakan Platform.</li>
                      <li>Penyelenggara: Pihak pengelola Platform Learning English Geuwat.</li>
                    </ul>
                    {/* ... (Sisanya sama) ... */}
                     <h4 className="font-semibold">2. Penerimaan Ketentuan</h4>
                    <p>Pengguna dianggap telah membaca, memahami, dan menyetujui dokumen ini saat mendaftar, mengakses, atau menggunakan Platform.</p>
                    <h4 className="font-semibold">3. Persyaratan Pengguna</h4>
                    <ol className="list-decimal list-inside">
                      <li>Berusia minimal 13 tahun.</li>
                      <li>Pengguna di bawah 18 tahun wajib memperoleh izin orang tua/wali.</li>
                      <li>Menyediakan data pendaftaran yang benar dan akurat.</li>
                      <li>Penyelenggara berhak menolak, membatasi, menangguhkan, atau menghapus akun yang melanggar ketentuan atau terindikasi penipuan.</li>
                    </ol>
                     <h4 className="font-semibold">4. Akun & Keamanan</h4>
                    <ol className="list-decimal list-inside">
                      <li>Akun bersifat pribadi dan tidak dapat dipindahtangankan.</li>
                      <li>Pengguna bertanggung jawab menjaga kerahasiaan kredensial.</li>
                      <li>Segala aktivitas pada akun menjadi tanggung jawab Pengguna.</li>
                    </ol>
                    <h4 className="font-semibold">5. Layanan & Konten</h4>
                    <ol className="list-decimal list-inside">
                      <li>Seluruh konten pembelajaran (materi, video, kuis, tantangan) adalah milik Penyelenggara atau mitra sah.</li>
                      <li>Konten dapat diperbarui atau dihentikan sewaktu-waktu.</li>
                      <li>Dilarang menyalin, mendistribusikan, atau memperjualbelikan konten tanpa izin tertulis.</li>
                    </ol>
                    <h4 className="font-semibold">6. Pembayaran (Jika Berlaku)</h4>
                    <ol className="list-decimal list-inside">
                      <li>Harga dan metode pembayaran ditentukan oleh Penyelenggara.</li>
                      <li>Pembayaran tidak dapat dikembalikan kecuali dinyatakan lain dalam kebijakan resmi.</li>
                      <li>Perubahan harga tidak berlaku surut.</li>
                    </ol>
                    <h4 className="font-semibold">7. Larangan & Sanksi</h4>
                    <p>Pengguna dilarang melakukan tindakan melanggar hukum, peretasan, spam, penipuan, atau penyalahgunaan sistem. Pelanggaran dapat berakibat sanksi hingga penghapusan akun.</p>
                    <h4 className="font-semibold">8. Batasan Tanggung Jawab</h4>
                    <p>Platform disediakan apa adanya. Penyelenggara tidak bertanggung jawab atas kerugian langsung maupun tidak langsung akibat penggunaan Platform.</p>
                    <h4 className="font-semibold">9. Penghentian Akun</h4>
                    <p>Penyelenggara berhak menangguhkan atau menghapus akun berdasarkan kebijakan internal dan/atau pelanggaran ketentuan.</p>
                    <h4 className="font-semibold">10. Perubahan Ketentuan</h4>
                    <p>Ketentuan dapat diperbarui dari waktu ke waktu. Pengguna disarankan meninjau dokumen ini secara berkala.</p>
                    <h4 className="font-semibold">11. Hukum yang Berlaku</h4>
                    <p>Dokumen ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia.</p>
                  </div>
                  <hr className={isDarkMode ? 'border-purple-800' : 'border-purple-100'} />
                  <h3 className="font-bold text-purple-600 dark:text-purple-300">B. KEBIJAKAN PRIVASI</h3>
                  <div className="space-y-2">
                    <h4 className="font-semibold">1. Pendahuluan</h4>
                    <p>Kebijakan Privasi ini menjelaskan bagaimana Platform mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Pengguna sesuai prinsip GDPR dan PDPA.</p>
                    <h4 className="font-semibold">2. Data yang Dikumpulkan</h4>
                    <ul className="list-disc list-inside">
                      <li>Data Identitas: Nama, email, nomor WhatsApp, kode referral.</li>
                      <li>Data Akun & Aktivitas: Progress belajar, riwayat interaksi.</li>
                      <li>Data Teknis: Alamat IP, perangkat, browser, log sistem, cookies.</li>
                    </ul>
                    <h4 className="font-semibold">3. Tujuan Pemrosesan Data</h4>
                    <p>Data digunakan untuk:</p>
                    <ol className="list-decimal list-inside">
                      <li>Pengelolaan akun dan layanan</li>
                      <li>Penyimpanan progress belajar</li>
                      <li>Komunikasi layanan</li>
                      <li>Analitik dan pengembangan produk</li>
                      <li>Keamanan dan pencegahan penyalahgunaan</li>
                    </ol>
                    <h4 className="font-semibold">4. Dasar Hukum Pemrosesan (GDPR)</h4>
                    <p>Pemrosesan data didasarkan pada:</p>
                    <ul className="list-disc list-inside">
                      <li>Persetujuan Pengguna</li>
                      <li>Pelaksanaan kontrak layanan</li>
                      <li>Kepentingan sah Penyelenggara</li>
                      <li>Kewajiban hukum (jika ada)</li>
                    </ul>
                    <h4 className="font-semibold">5. Penyimpanan & Keamanan Data</h4>
                    <ol className="list-decimal list-inside">
                      <li>Data disimpan secara aman menggunakan infrastruktur cloud.</li>
                      <li>Akses dibatasi kepada pihak berwenang.</li>
                      <li>Langkah teknis dan organisasi diterapkan untuk mencegah kebocoran.</li>
                    </ol>
                    <h4 className="font-semibold">6. Pembagian Data ke Pihak Ketiga</h4>
                    <p>Data tidak dijual. Pembagian hanya dilakukan kepada penyedia layanan pendukung atau jika diwajibkan hukum, dengan kewajiban kerahasiaan.</p>
                    <h4 className="font-semibold">7. Hak Pengguna</h4>
                    <p>Pengguna berhak untuk:</p>
                    <ul className="list-disc list-inside">
                      <li>Mengakses dan memperbaiki data</li>
                      <li>Meminta penghapusan data</li>
                      <li>Menarik persetujuan</li>
                      <li>Membatasi pemrosesan data</li>
                    </ul>
                    <h4 className="font-semibold">8. Retensi Data</h4>
                    <p>Data disimpan selama akun aktif atau sesuai kebutuhan layanan dan kewajiban hukum, lalu dihapus atau dianonimkan.</p>
                    <h4 className="font-semibold">9. Cookies</h4>
                    <p>Cookies digunakan untuk preferensi, analitik, dan peningkatan pengalaman. Pengguna dapat mengelola cookies melalui pengaturan browser.</p>
                    <h4 className="font-semibold">10. Privasi Anak</h4>
                    <p>Platform tidak ditujukan untuk anak di bawah 13 tahun tanpa izin orang tua/wali.</p>
                    <h4 className="font-semibold">11. Kontak</h4>
                    <p>Pertanyaan terkait ketentuan atau privasi dapat disampaikan melalui kontak resmi Learning English Geuwat.</p>
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

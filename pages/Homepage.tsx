import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

// [UPDATED] Angel pindahin data modal ke sini biar kodingan Aa nggak 'spaghetti' di bawah
// Ini bikin kode Aa bersih banget (Clean Code & DRY)
const MODAL_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
  'modal-metode': {
    title: '🚀 Metode Geuwat',
    content: (
      <>
        <p><strong>Jurus Sat-Set!</strong> Belajarnya ngebut pol, tapi santuy. Kami nggak suka basa-basi teori yang bikin pusing.</p>
        <p>Fokus utama kami adalah efisiensi. Kamu akan belajar pola bahasa yang paling sering digunakan dalam percakapan nyata, bukan sekadar menghafal rumus yang jarang terpakai. Potong kompas, langsung ke inti, dan biarkan kemampuanmu berkembang secepat kilat!</p>
      </>
    ),
  },
  'modal-instruktur': {
    title: '✨ Instruktur Kece',
    content: (
      <>
        <p><strong>Mentor Spesialis!</strong> Diajar sama para expert yang seru and anti-krik-krik.</p>
        <p>Mentor di Geuwat bukan cuma guru, tapi partner belajar yang asik. Mereka punya pengalaman bertahun-tahun dan cara mengajar yang jauh dari kata membosankan. Kamu bakal merasa lagi nongkrong bareng temen sambil upgrade skill bahasa Inggris kamu!</p>
      </>
    ),
  },
  'modal-materi': {
    title: '💼 Materi Real Life',
    content: (
      <>
        <p><strong>Materi Nggak Kaleng-Kaleng.</strong> Langsung kepake buat traveling, interview, dan keseharian.</p>
        <p>Kami menyusun kurikulum berdasarkan kebutuhan dunia nyata. Mau spik-spik harian? Siap. Mau tampil meyakinkan pas interview kerja? Bisa banget. Atau sekadar pengen punya value lebih di dunia profesional? Ini tempatnya!</p>
      </>
    ),
  },
  'modal-fleksibel': {
    title: '🕊️ Fleksibel Parah',
    content: (
      <>
        <p><strong>Bebas Kayak Burung!</strong> Mau belajar sambil rebahan jam 3 pagi? Gas!</p>
        <p>Kami tahu kesibukanmu nggak menentu. Makanya, Learning English Geuwat didesain untuk bisa diakses kapan saja dan di mana saja. Nggak ada jadwal yang mengikat leher, kamu yang pegang kendali penuh atas waktu belajarmu sendiri. Belajar jadi tanpa beban!</p>
      </>
    ),
  },
  'modal-pronunciation': {
    title: '🎤 Geuwat PRONUNCIATION',
    content: (
      <>
        <p>• Fokus: Bikin Suara Kamu Seksi Maksimal (Pronunciation). MUSNAHKAN pelafalan yang bikin kamu terdengar seperti NPC. Waktunya jadi MC (Main Character) terisekai.</p>
        <p>• Isi Course: Jurus Mimic Cepat (Shadowing), Latihan Otot Mulut, Bedah Suara Ajaib (Sheep vs Ship).</p>
        <p>Hasilnya: Ucapannya clean, clear, dan nggak perlu diulang!</p>
      </>
    ),
  },
  'modal-vocab': {
    title: '📚 Geuwat VOCAB',
    content: (
      <>
        <p>Fokus: Bikin Vocabulary Kamu Nggak Cupu (Vocabulary). Dari kata "Good" bisa jadi "Splendid".</p>
        <p>Isi Course: Metode Hack Otak Kanan buat nge-lock ribuan kata. Koleksi "Kata-kata Mewah" buat nge-gombal and "Kata-kata Masa Kini" buat chatting.</p>
        <p>Hasilnya: Stock kata melimpah ruah, nggak perlu pakai kata 'pokoknya' lagi!</p>
      </>
    ),
  },
  'modal-grammar': {
    title: '📝 Geuwat GRAMMAR',
    content: (
      <>
        <p>• Fokus: Struktur Kalimat Anti-Gagal (Grammar). Stop drama tenses!</p>
        <p>• Isi Course: Metode Bodo Amat Tenses (Fokus 3 tenses Dewa), Jurus Anti-Malu, Cheat Sheet Nulis.</p>
        <p>Hasilnya: Ngomong dan nulis jadi rapi tanpa terbebani.</p>
      </>
    ),
  },
  'modal-speaking': {
    title: '🗣️ Geuwat SPEAKING',
    content: (
      <>
        <p>• Fokus: Membungkam Keraguan (Speaking).</p>
        <p>• Isi Course: Live practice intensif dan teknik improvisasi seketika.</p>
        <p>Hasilnya: Kamu jadi Pede Level Max. Siap stand up comedy di depan bule!</p>
      </>
    ),
  },
};

const Homepage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // [UPDATED] Logic Typing Effect yang Aman (Memory Leak Proof)
  useEffect(() => {
    const text = "Belajar Cepat Santuy, Cas Cis Cus, Langsung Praktek!";
    let index = 0;
    
    const intervalId = setInterval(() => {
      // Angel pakai slice biar aman update state-nya
      setTypedText((prev) => text.slice(0, index + 1));
      index++;
      if (index > text.length) clearInterval(intervalId);
    }, 80);

    return () => clearInterval(intervalId); // Cleanup saat unmount
  }, []);

  // [UPDATED] Logic Scroll to Top Visibility (React Way)
  useEffect(() => {
    const handleScroll = () => {
      // Update state hanya jika status berubah biar ga re-render terus
      const shouldShow = window.scrollY > 300;
      setShowScrollBtn((prev) => (prev !== shouldShow ? shouldShow : prev));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // [UPDATED] Modal Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // [UPDATED] Logic Navigasi & Neon Effect yang lebih bersih
  const handleNavClick = (e: React.MouseEvent, targetId: string, isHeroTitle: boolean = false) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId) as HTMLElement;
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Trigger Neon Effect
      const neonTarget = isHeroTitle 
        ? document.querySelector('#hero-title') 
        : document.querySelector(`${targetId} h2`);

      if (neonTarget) {
        neonTarget.classList.remove('neon');
        // Force reflow hack (masih diperlukan untuk restart CSS animation)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        void (neonTarget as HTMLElement).offsetWidth; 
        neonTarget.classList.add('neon');
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Site Navigation */}
      <header className="site-header">
        <div className="container">
          <div className="logo">GEUWAT</div>
          <nav className="nav-menu">
            <button type="button" className="nav-btn" onClick={(e) => handleNavClick(e, '#hero-title', true)}>Home</button>
            <a href="#features" onClick={(e) => handleNavClick(e, '#features')}>Features</a>
            <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')}>Courses</a>
            <a href="#testimonials" onClick={(e) => handleNavClick(e, '#testimonials')}>Testimonials</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
          </nav>
          <div className="auth-buttons-header">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="hero">
          <h1 id="hero-title" className="insta-fire-text">Learning English Geuwat</h1>
          <h2>Apaan Tuh 🤔</h2>
          <p>Tentu, ini adalah platform pembelajaran bahasa Inggris cepat dan santuy!</p>
          {/* Menggunakan state typedText */}
          <p className="tagline" id="typing" aria-live="polite">{typedText}</p>
        </section>

        {/* Welcome Section */}
        <section id="welcome">
          <h2 id="welcome-title">😜 Cek Ombak, Gans!</h2>
          <p>👋 Selamat Datang!</p>
          <p>Pengen gaspol nguasain bahasa Inggris secepat kilat tapi gayanya tetap "SANTUY PARAH"? Ogah sama teori-teori ribet yang bikin kepala ngebul? Well, kamu sudah nyasar ke lapak yang bener! Learning English Geuwat itu platform yang fokusnya ke pembelajaran yang sat-set-sat-set and langsung tokcer. Kita ini kayak shortcut super: potong kompas biar kamu nggak perlu babibu lagi, tapi bisa langsung cas cis cus ngomong Inggris dengan pede, baik buat spik-spik harian😂, maupun buat naikin value di dunia profesional😏!</p>
        </section>

        {/* Features Section */}
        <section id="features">
          <h2 id="features-title">💥 Kenapa Pilih Geuwat?</h2>
          <div className="feature-grid">
            <div className="feature-card" onClick={() => setActiveModal('modal-metode')}>
              <div className="feature-card-inner">
                <h3>🚀 Metode Geuwat</h3>
                <p>Jurus Sat-Set! Belajarnya ngebut pol, tapi santuy.</p>
              </div>
            </div>
            <div className="feature-card" onClick={() => setActiveModal('modal-instruktur')}>
              <div className="feature-card-inner">
                <h3>✨ Instruktur Kece</h3>
                <p>Mentor Spesialis! Expert yang seru and anti-krik-krik.</p>
              </div>
            </div>
            <div className="feature-card" onClick={() => setActiveModal('modal-materi')}>
              <div className="feature-card-inner">
                <h3>💼 Materi Real Life</h3>
                <p>Langsung kepake buat traveling and interview.</p>
              </div>
            </div>
            <div className="feature-card" onClick={() => setActiveModal('modal-fleksibel')}>
              <div className="feature-card-inner">
                <h3>🕊️ Fleksibel Parah</h3>
                <p>Bebas Kayak Burung! Belajar kapan aja semaumu.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="courses">
          <h2 id="courses-title">🎯 Materi Gokil Kami</h2>
          <div className="course-grid">
            <div className="course-card" onClick={() => setActiveModal('modal-pronunciation')}>
              <div className="course-card-inner">
                <h3>🎤 Geuwat PRONUNCIATION</h3>
                <p>Fokus: Bikin Suara Kamu Seksi Maksimal.</p>
              </div>
            </div>
            <div className="course-card" onClick={() => setActiveModal('modal-vocab')}>
              <div className="course-card-inner">
                <h3>📚 Geuwat VOCAB</h3>
                <p>Fokus: Bikin Vocabulary Kamu Nggak Cupu.</p>
              </div>
            </div>
            <div className="course-card" onClick={() => setActiveModal('modal-grammar')}>
              <div className="course-card-inner">
                <h3>📝 Geuwat GRAMMAR</h3>
                <p>Fokus: Struktur Kalimat Anti-Gagal.</p>
              </div>
            </div>
            <div className="course-card" onClick={() => setActiveModal('modal-speaking')}>
              <div className="course-card-inner">
                <h3>🗣️ Geuwat SPEAKING</h3>
                <p>Fokus: Membungkam Keraguan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <h2 id="testimonials-title">⭐️ Kata Mereka</h2>
          <p>🧘 Masih GHOIB 🧘</p>
        </section>
      </main>

      {/* Contact Section (with ID for navigation) */}
      <section id="contact" className="bg-slate-900 py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[100px] -z-10"></div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-white font-bold text-3xl md:text-4xl mb-4 tracking-tight">
              📲 Hubungi Kami
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Ada pertanyaan atau butuh bantuan belajar? Angel dan tim siap kok nemenin Aa kapan aja!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card WhatsApp */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:border-green-500/50 transition-all duration-300 group shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <span className="text-3xl">💬</span>
              </div>
              <h4 className="text-white font-bold text-xl mb-3">WhatsApp Official</h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Respon cepat buat Aa yang mau nanya-nanya langsung via chat.</p>
              <a href="https://wa.me/6282338792512" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-400 font-bold hover:text-green-300 gap-2 transition-colors">
                +62 823-3879-2512
              </a>
            </div>

            {/* Card Email */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:border-indigo-500/50 transition-all duration-300 group shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <span className="text-3xl">📧</span>
              </div>
              <h4 className="text-white font-bold text-xl mb-3">Email Support</h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Kirim pertanyaan formal atau kerjasama lewat sini ya A.</p>
              <a href="mailto:fuadmuslim4@gmail.com" className="inline-flex items-center text-indigo-400 font-bold hover:text-indigo-300 gap-2 transition-colors">
                fuadmuslim4@gmail.com
              </a>
            </div>

            {/* Card Social Media */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:border-pink-500/50 transition-all duration-300 group shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <span className="text-3xl">✨</span>
              </div>
              <h4 className="text-white font-bold text-xl mb-3">Ikuti Kami</h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Kepoin kegiatan seru kita di media sosial juga yuk, Aa!</p>
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/fuadmuslym/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-all">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.92 4.92 0 011.675 1.086 4.92 4.92 0 011.086 1.676c.163.46.35 1.26.404 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.404 2.43a4.92 4.92 0 01-1.086 1.675 4.92 4.92 0 01-1.676 1.086c-.46.163-1.26.35-2.43.404-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.404a4.902 4.902 0 01-1.675-1.086 4.902 4.902 0 01-1.086-1.676c-.163-.46-.35-1.26-.404-2.43-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.24-1.97.404-2.43a4.902 4.902 0 011.086-1.675 4.902 4.902 0 011.676-1.086c.46-.163 1.26-.35 2.43-.404 1.266-.058 1.646-.07 4.85-.07zm0-2.163C8.756 0 8.34.012 7.052.07 5.768.127 4.745.32 3.95.634a6.926 6.926 0 00-2.502 1.645A6.926 6.926 0 00.634 4.95c-.314.795-.507 1.818-.564 3.102C.012 8.34 0 8.756 0 12c0 3.244.012 3.66.07 4.948.057 1.284.25 2.307.564 3.102a6.926 6.926 0 001.645 2.502 6.926 6.926 0 002.502 1.645c.795.314 1.818.507 3.102.564C8.34 23.988 8.756 24 12 24s3.66-.012 4.948-.07c1.284-.057 2.307-.25 3.102-.564a6.926 6.926 0 002.502-1.645 6.926 6.926 0 001.645-2.502c.314-.795.507-1.818.564-3.102.058-1.288.07-1.704.07-4.948s-.012-3.66-.07-4.948c-.057-1.284-.25-2.307-.564-3.102a6.926 6.926 0 00-1.645-2.502A6.926 6.926 0 0019.05.634c-.795-.314-1.818-.507-3.102-.564C15.66.012 15.244 0 12 0z"/></svg>
                </a>
                <a href="https://web.facebook.com/fuadmuslym/?locale=id_ID" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.762v2.31h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.325C24 .593 23.407 0 22.675 0z"/></svg>
                </a>
                <a href="https://www.youtube.com/@fuadmuslimn.s/playlists" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-all">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M23.498 6.186a2.997 2.997 0 00-2.115-2.12C19.417 3.5 12 3.5 12 3.5s-7.417 0-9.383.566a2.997 2.997 0 00-2.115 2.12A31.797 31.797 0 000 12a31.797 31.797 0 00.502 5.814 2.997 2.997 0 002.115 2.12C4.583 20.5 12 20.5 12 20.5s7.417 0 9.383-.566a2.997 2.997 0 002.115-2.12A31.797 31.797 0 0024 12a31.797 31.797 0 00-.502-5.814zM9.545 15.568V8.432l6.182 3.568-6.182 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">G</div>
            <p className="text-slate-500 text-sm font-medium">
              © 2025 <span className="text-indigo-400">Learning English Geuwat</span>. Dibuat dengan cinta.
            </p>
          </div>
          <nav className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-indigo-400 text-xs font-bold uppercase tracking-widest transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-400 text-xs font-bold uppercase tracking-widest transition-colors">Terms of Service</a>
          </nav>
        </div>
      </footer>

      {/* [UPDATED] Single Modal Logic (DRY) */}
      {/* Menggunakan satu block code untuk me-render modal apa saja berdasarkan activeModal */}
      {activeModal && MODAL_CONTENT[activeModal] && (
        <div className="modal active" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setActiveModal(null)} aria-label="Close modal">&times;</span>
            <h3>{MODAL_CONTENT[activeModal].title}</h3>
            {MODAL_CONTENT[activeModal].content}
          </div>
        </div>
      )}

      {/* [UPDATED] Scroll Top Button menggunakan conditional class */}
      <button 
        id="scrollTopBtn" 
        className={showScrollBtn ? 'visible' : ''} 
        onClick={scrollToTop} 
        title="Go to top" 
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </>
  );
};

export default Homepage;

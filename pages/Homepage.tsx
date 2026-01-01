import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const typingRef = useRef<HTMLSpanElement>(null);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);

  // Typing Effect
  useEffect(() => {
    const text = "Belajar Cepat Santuy, Cas Cis Cus, Langsung Praktek!";
    const typingElement = typingRef.current;
    if (!typingElement) return;

    let index = 0;
    const typeWriter = () => {
      if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 80);
      }
    };
    typeWriter();
  }, []);

  // Modal Logic
  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      if (scrollBtnRef.current) {
        scrollBtnRef.current.classList.toggle('visible', window.scrollY > 300);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation Effects
  const triggerNeon = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;
    element.classList.remove('neon');
    void element.offsetWidth; // trigger reflow
    element.classList.add('neon');
  };

  const handleNavClick = (e: React.MouseEvent, targetId: string, isHeroTitle: boolean = false) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId) as HTMLElement;
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (isHeroTitle) {
        triggerNeon('#hero-title');
      } else {
        triggerNeon(`${targetId} h2`);
      }
    }
  };

  return (
    <>
      {/* Site Navigation */}
      <header className="site-header">
        <div className="container">
          <div className="logo">Learning English Geuwat</div>
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
          <p className="tagline" id="typing" ref={typingRef} aria-live="polite"></p>
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
            <div className="feature-card" onClick={() => openModal('modal-metode')}>
              <div className="feature-card-inner">
                <h3>🚀 Metode Geuwat</h3>
                <p>Jurus Sat-Set! Belajarnya ngebut pol, tapi santuy.</p>
              </div>
            </div>
            <div className="feature-card" onClick={() => openModal('modal-instruktur')}>
              <div className="feature-card-inner">
                <h3>✨ Instruktur Kece</h3>
                <p>Mentor Spesialis! Expert yang seru and anti-krik-krik.</p>
              </div>
            </div>
            <div className="feature-card" onClick={() => openModal('modal-materi')}>
              <div className="feature-card-inner">
                <h3>💼 Materi Real Life</h3>
                <p>Langsung kepake buat traveling and interview.</p>
              </div>
            </div>
            <div className="feature-card" onClick={() => openModal('modal-fleksibel')}>
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
            <div className="course-card" onClick={() => openModal('modal-pronunciation')}>
              <div className="course-card-inner">
                <h3>🎤 Geuwat PRONUNCIATION</h3>
                <p>Fokus: Bikin Suara Kamu Seksi Maksimal.</p>
              </div>
            </div>
            <div className="course-card" onClick={() => openModal('modal-vocab')}>
              <div className="course-card-inner">
                <h3>📚 Geuwat VOCAB</h3>
                <p>Fokus: Bikin Vocabulary Kamu Nggak Cupu.</p>
              </div>
            </div>
            <div className="course-card" onClick={() => openModal('modal-grammar')}>
              <div className="course-card-inner">
                <h3>📝 Geuwat GRAMMAR</h3>
                <p>Fokus: Struktur Kalimat Anti-Gagal.</p>
              </div>
            </div>
            <div className="course-card" onClick={() => openModal('modal-speaking')}>
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

      {/* Footer */}
      <footer id="contact">
        <h3 id="contact-title">📲 Hubungi Kami</h3>
        <div className="contact-info">
          <p>Email: <a href="mailto:fuadmuslim4@gmail.com">fuadmuslim4@gmail.com</a></p>
          <p>WhatsApp: <a href="https://wa.me/6282338792512" target="_blank" rel="noopener noreferrer">+62 82338792512</a></p>
        </div>
        <div className="social-links">
          <p>Ikuti Kami:</p>
          <a href="https://www.instagram.com/fuadmuslym/" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.92 4.92 0 011.675 1.086 4.92 4.92 0 011.086 1.676c.163.46.35 1.26.404 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.404 2.43a4.92 4.92 0 01-1.086 1.675 4.92 4.92 0 01-1.676 1.086c-.46.163-1.26.35-2.43.404-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.404a4.902 4.902 0 01-1.675-1.086 4.902 4.902 0 01-1.086-1.676c-.163-.46-.35-1.26-.404-2.43-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.24-1.97.404-2.43a4.902 4.902 0 011.086-1.675 4.902 4.902 0 011.676-1.086c.46-.163 1.26-.35 2.43-.404 1.266-.058 1.646-.07 4.85-.07zm0-2.163C8.756 0 8.34.012 7.052.07 5.768.127 4.745.32 3.95.634a6.926 6.926 0 00-2.502 1.645A6.926 6.926 0 00.634 4.95c-.314.795-.507 1.818-.564 3.102C.012 8.34 0 8.756 0 12c0 3.244.012 3.66.07 4.948.057 1.284.25 2.307.564 3.102a6.926 6.926 0 001.645 2.502 6.926 6.926 0 002.502 1.645c.795.314 1.818.507 3.102.564C8.34 23.988 8.756 24 12 24s3.66-.012 4.948-.07c1.284-.057 2.307-.25 3.102-.564a6.926 6.926 0 002.502-1.645 6.926 6.926 0 001.645-2.502c.314-.795.507-1.818.564-3.102.058-1.288.07-1.704.07-4.948s-.012-3.66-.07-4.948c-.057-1.284-.25-2.307-.564-3.102a6.926 6.926 0 00-1.645-2.502A6.926 6.926 0 0019.05.634c-.795-.314-1.818-.507-3.102-.564C15.66.012 15.244 0 12 0z" />
              <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z" />
              <circle cx="18.406" cy="5.594" r="1.44" />
            </svg>
          </a>
          <a href="https://web.facebook.com/fuadmuslym/?locale=id_ID" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.762v2.31h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.325C24 .593 23.407 0 22.675 0z" />
            </svg>
          </a>
          <a href="https://www.tiktok.com/@fuadmuslimns" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 0v24c6.627 0 12-5.373 12-12S18.627 0 12 0zm3.183 16.746c-.932 0-1.863-.119-2.772-.349v-4.012h-.549c-.548 0-1.071-.22-1.462-.611a2.07 2.07 0 01-.611-1.462v-4.1h1.921v3.048c.634.234 1.314.35 2 .35 2.326 0 4.193-1.886 4.193-4.213h2.032c0 3.493-2.847 6.343-6.333 6.343z" />
            </svg>
          </a>
          <a href="https://www.youtube.com/@fuadmuslimn.s/playlists" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
              <path d="M23.498 6.186a2.997 2.997 0 00-2.115-2.12C19.417 3.5 12 3.5 12 3.5s-7.417 0-9.383.566a2.997 2.997 0 00-2.115 2.12A31.797 31.797 0 000 12a31.797 31.797 0 00.502 5.814 2.997 2.997 0 002.115 2.12C4.583 20.5 12 20.5 12 20.5s7.417 0 9.383-.566a2.997 2.997 0 002.115-2.12A31.797 31.797 0 0024 12a31.797 31.797 0 00-.502-5.814zM9.545 15.568V8.432l6.182 3.568-6.182 3.568z" />
            </svg>
          </a>
        </div>
        <div className="footer-bottom">
          <small>© 2025 Learning English Geuwat.</small>
          <div className="footer-links">
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat dan Ketentuan</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeModal === 'modal-metode' && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal} aria-label="Close modal">&times;</span>
            <h3>🚀 Metode Geuwat</h3>
            <p><strong>Jurus Sat-Set!</strong> Belajarnya ngebut pol, tapi santuy. Kami nggak suka basa-basi teori yang bikin pusing.</p>
            <p>Fokus utama kami adalah efisiensi. Kamu akan belajar pola bahasa yang paling sering digunakan dalam percakapan nyata, bukan sekadar menghafal rumus yang jarang terpakai. Potong kompas, langsung ke inti, dan biarkan kemampuanmu berkembang secepat kilat!</p>
          </div>
        </div>
      )}

      {activeModal === 'modal-instruktur' && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>✨ Instruktur Kece</h3>
            <p><strong>Mentor Spesialis!</strong> Diajar sama para expert yang seru and anti-krik-krik.</p>
            <p>Mentor di Geuwat bukan cuma guru, tapi partner belajar yang asik. Mereka punya pengalaman bertahun-tahun dan cara mengajar yang jauh dari kata membosankan. Kamu bakal merasa lagi nongkrong bareng temen sambil upgrade skill bahasa Inggris kamu!</p>
          </div>
        </div>
      )}

      {activeModal === 'modal-materi' && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>💼 Materi Real Life</h3>
            <p><strong>Materi Nggak Kaleng-Kaleng.</strong> Langsung kepake buat traveling, interview, dan keseharian.</p>
            <p>Kami menyusun kurikulum berdasarkan kebutuhan dunia nyata. Mau spik-spik harian? Siap. Mau tampil meyakinkan pas interview kerja? Bisa banget. Atau sekadar pengen punya value lebih di dunia profesional? Ini tempatnya!</p>
          </div>
        </div>
      )}

      {activeModal === 'modal-fleksibel' && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>🕊️ Fleksibel Parah</h3>
            <p><strong>Bebas Kayak Burung!</strong> Mau belajar sambil rebahan jam 3 pagi? Gas!</p>
            <p>Kami tahu kesibukanmu nggak menentu. Makanya, Learning English Geuwat didesain untuk bisa diakses kapan saja dan di mana saja. Nggak ada jadwal yang mengikat leher, kamu yang pegang kendali penuh atas waktu belajarmu sendiri. Belajar jadi tanpa beban!</p>
          </div>
        </div>
      )}

      {activeModal === 'modal-pronunciation' && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal} aria-label="Close modal">&times;</span>
            <h3>🎤 Geuwat PRONUNCIATION</h3>
            <p>• Fokus: Bikin Suara Kamu Seksi Maksimal (Pronunciation). MUSNAHKAN pelafalan yang bikin kamu terdengar seperti NPC. Waktunya jadi MC (Main Character) terisekai.</p>
            <p>• Isi Course:
              o Jurus Mimic Cepat (Shadowing): Kita tiru ucapan native speaker secepat flash!
              o Latihan Otot Mulut: Drill intensif biar artikulasi kamu clean banget.
              o Bedah Suara Ajaib: Fokus ke bunyi-bunyi 'kembar' (Sheep vs Ship).
            </p>
            <p>Hasilnya: Ucapannya clean, clear, dan nggak perlu diulang!</p>
          </div>
        </div>
      )}

      {activeModal === 'modal-vocab' && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>📚 Geuwat VOCAB</h3>
            <p>Fokus: Bikin Vocabulary Kamu Nggak Cupu (Vocabulary). Dari kata "Good" bisa jadi "Splendid".</p>
            <p>Isi Course: Metode Hack Otak Kanan buat nge-lock ribuan kata. Koleksi "Kata-kata Mewah" buat nge-gombal and "Kata-kata Masa Kini" buat chatting.</p>
            <p>Hasilnya: Stock kata melimpah ruah, nggak perlu pakai kata 'pokoknya' lagi!</p>
          </div>
        </div>
      )}

      {activeModal === 'modal-grammar' && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>📝 Geuwat GRAMMAR</h3>
            <p>• Fokus: Struktur Kalimat Anti-Gagal (Grammar). Stop drama tenses!</p>
            <p>• Isi Course:
              o Metode Bodo Amat Tenses: Cuma fokus ke 3 tenses Dewa.
              o Jurus Anti-Malu: Kuasai Verb dan Preposition yang sering nyasar.
              o Cheat Sheet Nulis: Grammar Hacks buat email atau caption smart.
            </p>
            <p>Hasilnya: Ngomong dan nulis jadi rapi tanpa terbebani.</p>
          </div>
        </div>
      )}

      {activeModal === 'modal-speaking' && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>🗣️ Geuwat SPEAKING</h3>
            <p>• Fokus: Membungkam Keraguan (Speaking).</p>
            <p>• Isi Course: Live practice intensif dan teknik improvisasi seketika.</p>
            <p>Hasilnya: Kamu jadi Pede Level Max. Siap stand up comedy di depan bule!</p>
          </div>
        </div>
      )}

      <button id="scrollTopBtn" ref={scrollBtnRef} onClick={scrollToTop} title="Go to top" aria-label="Scroll to top">↑</button>
    </>
  );
};

export default Homepage;

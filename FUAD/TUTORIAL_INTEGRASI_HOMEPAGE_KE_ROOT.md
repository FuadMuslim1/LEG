# Tutorial Integrasi Folder Homepage ke Root Project

Folder `homepage` berisi file HTML, CSS, dan JS statis yang perlu diintegrasikan ke dalam aplikasi React ini. Berikut langkah-langkahnya:

## 1. Pindahkan Folder Homepage ke `public/`
- Jika folder `homepage` berada di luar project, pindahkan ke dalam folder `public/` di root project.
- Struktur akhir:
  ```
  public/
    homepage/
      index.html
      assets/
        css/
          homepage.css
        js/
          homepage.js
  ```

## 2. Akses Halaman Homepage
- Setelah dipindah, halaman dapat diakses langsung via: `http://localhost:3000/homepage/index.html`
- File di `public/` tidak diproses oleh React/Vite, sehingga tetap statis.

## 3. Integrasi ke Aplikasi React (Opsional)
- Jika ingin homepage menjadi bagian dari aplikasi React, konversi ke komponen React (lihat `TUTORIAL_KONVERSI_KE_REACT.md`).
- Tambahkan route di `App.tsx` atau `main.tsx`:
  ```tsx
  import Homepage from './pages/Homepage'; // Setelah konversi

  // Dalam routing:
  <Route path="/homepage" element={<Homepage />} />
  ```
- Atau ganti halaman utama dengan homepage:
  ```tsx
  <Route path="/" element={<Homepage />} />
  ```

## 4. Update Link Navigasi
- Jika ada link dari halaman lain ke homepage, gunakan:
  ```tsx
  <a href="/homepage/index.html" target="_blank">Homepage</a>
  ```
- Atau jika sudah dikonversi ke React: `<Link to="/homepage">Homepage</Link>`

## 5. Jalankan dan Test
- Jalankan `npm run dev`.
- Akses homepage dan pastikan semua asset (CSS, JS) ter-load dengan benar.

---

**Catatan:**
- Jika homepage perlu interaksi dengan komponen React lain, sebaiknya konversi penuh ke React.
- Untuk deployment, pastikan file di `public/` ikut ter-deploy.

Jika butuh bantuan spesifik, silakan beri tahu!

# Tutorial Konversi HTML, CSS, dan JS ke React

Berikut langkah-langkah mengubah file HTML, CSS, dan JS menjadi komponen React:

## 1. Buat File Komponen di `pages/` atau `components/`
- Contoh: `pages/HalamanBaru.tsx`

## 2. Pindahkan Struktur HTML ke JSX
- Copy isi `<body>` dari HTML ke dalam fungsi komponen React.
- Ganti atribut HTML:
  - `class` → `className`
  - `for` → `htmlFor`
  - Tag harus ditutup (misal `<img />`, `<input />`)
- Contoh:
  ```tsx
  // Sebelum: <div class="container">...</div>
  // Sesudah:
  <div className="container">...</div>
  ```

## 3. Pindahkan CSS
- Jika CSS dalam file terpisah, import di komponen:
  ```tsx
  import './HalamanBaru.css';
  ```
- Atau gunakan style inline/Styled Components sesuai kebutuhan.

## 4. Konversi JS ke React
- Pindahkan script JS ke dalam fungsi atau hook React (`useState`, `useEffect`, dsb).
- Ganti manipulasi DOM langsung (misal `document.getElementById`) dengan state/props React.
- Contoh:
  ```js
  // JS asli:
  document.getElementById('btn').onclick = function() { ... }
  // React:
  const handleClick = () => { ... };
  <button onClick={handleClick}>Klik</button>
  ```

## 5. Hapus Tag `<script>` dan `<style>` dari JSX
- Semua logic JS dan CSS sudah dipindahkan ke file/module terpisah.

## 6. Simpan dan Jalankan
- Simpan file, lalu lihat hasilnya di browser.

---

**Tips:**
- Gunakan VS Code extension seperti "ES7+ React/Redux/React-Native snippets" untuk mempercepat penulisan kode.
- Jika script JS kompleks, konversi bertahap dan uji setiap bagian.

Jika butuh contoh konversi spesifik, silakan upload file HTML/JS/CSS Anda!
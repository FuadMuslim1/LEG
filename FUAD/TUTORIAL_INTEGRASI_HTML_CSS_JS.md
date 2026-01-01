# Tutorial Integrasi Folder HTML, CSS, JS ke Root Project

Jika Anda memiliki folder berisi file HTML, CSS, dan JS (misal hasil export dari aplikasi lain atau template), berikut cara mengintegrasikannya ke dalam project ini:

## 1. Tempatkan Folder di `public/`
- Buat folder baru bernama `public` di root project jika belum ada.
- Pindahkan seluruh folder HTML, CSS, JS Anda ke dalam `public/`.
- Contoh struktur:
  ```
  public/
    my-template/
      index.html
      style.css
      script.js
  ```

## 2. Akses Langsung Lewat Browser
- File di dalam `public/` akan tersedia secara langsung saat aplikasi dijalankan.
- Contoh akses: `http://localhost:5173/my-template/index.html`

## 3. (Opsional) Link dari React
- Anda bisa menambahkan link atau tombol di aplikasi React untuk membuka halaman HTML tersebut:
  ```tsx
  <a href="/my-template/index.html" target="_blank" rel="noopener noreferrer">Buka Template</a>
  ```

## 4. Catatan Penting
- File di `public/` tidak akan diproses oleh React/Vite, jadi gunakan hanya untuk file statis.
- Jika ingin mengintegrasikan logika JS ke React, sebaiknya konversi script JS menjadi komponen React.

---

**Ringkasan:**
1. Tempatkan folder HTML, CSS, JS ke dalam `public/`.
2. Akses lewat URL sesuai nama folder/file.
3. (Opsional) Tambahkan link dari aplikasi React.

Jika butuh bantuan konversi script JS ke React, silakan minta!
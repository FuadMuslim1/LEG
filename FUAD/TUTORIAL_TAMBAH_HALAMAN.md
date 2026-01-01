# Tutorial Menambahkan Halaman Lewat VS Code

1. **Buka folder `pages/` di VS Code.**
2. **Buat file baru untuk halaman:**
   - Contoh: `pages/HalamanBaru.tsx`
3. **Isi file dengan komponen React:**
   ```tsx
   import React from 'react';
   
   const HalamanBaru = () => {
     return <div>Ini halaman baru!</div>;
   };
   
   export default HalamanBaru;
   ```
4. **Tambahkan routing (jika diperlukan):**
   - Jika menggunakan React Router, update file routing utama (misal di `App.tsx`).
   - Contoh:
   ```tsx
   import HalamanBaru from './pages/HalamanBaru';
   // ...
   <Route path="/halaman-baru" element={<HalamanBaru />} />
   ```
5. **Simpan file dan lihat hasilnya di browser.**

**Tips:**
- Gunakan fitur auto-complete dan snippet di VS Code untuk mempercepat penulisan kode.
- Pastikan nama file dan komponen konsisten.
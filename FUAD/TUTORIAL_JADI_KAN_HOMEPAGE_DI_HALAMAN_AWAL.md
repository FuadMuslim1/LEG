# Tutorial: Jadikan Homepage sebagai Halaman Awal Aplikasi React

## Tujuan
Mengubah aplikasi React agar homepage muncul sebagai halaman pertama saat aplikasi dijalankan, bukan halaman login atau dashboard.

## Langkah-langkah yang Dilakukan

### 1. Import Komponen Homepage
- Tambahkan import untuk komponen Homepage di `App.tsx`:
  ```tsx
  import Homepage from './pages/Homepage';
  ```

### 2. Ubah Route Utama
- Ganti route "/" dari kondisional redirect ke komponen Homepage:
  ```tsx
  <Route path="/" element={<Homepage />} />
  ```
- Pindahkan route login ke "/login" untuk menghindari konflik:
  ```tsx
  <Route path="/login" element={authState.user ? <Navigate to={getHomeRoute(authState.user.role)} replace /> : <Login />} />
  ```

### 3. Struktur Route Akhir
- Route "/" sekarang menampilkan Homepage tanpa syarat autentikasi.
- Pengguna dapat mengakses login melalui "/login" jika diperlukan.
- Route lainnya tetap sama, termasuk protected routes untuk dashboard dan admin.

## Hasil
- Saat aplikasi dijalankan (`npm run dev`), homepage akan muncul pertama kali.
- Homepage dapat diakses tanpa login, memberikan pengalaman landing page yang lebih baik.
- Navigasi ke halaman lain tetap berfungsi seperti sebelumnya.

## Catatan
- Homepage sekarang menjadi entry point utama aplikasi.
- Jika diperlukan autentikasi untuk fitur tertentu, tambahkan logika di dalam komponen Homepage.
- Pastikan komponen Homepage tidak bergantung pada data user yang mungkin belum terautentikasi.

## Perbaikan Kendala: Button Login Tidak Menuju Halaman Login

### Masalah
Button login di homepage tidak menuju halaman login karena menggunakan anchor tag dengan href="login.html" yang tidak sesuai dengan routing React.

### Solusi
1. Import `Link` dari `react-router-dom` di `pages/Homepage.tsx`:
   ```tsx
   import { Link } from 'react-router-dom';
   ```

2. Ganti anchor tag dengan komponen Link:
   ```tsx
   <Link to="/login" className="login-btn">Login</Link>
   <Link to="/register" className="register-btn">Register</Link>
   ```

### Hasil
- Button login sekarang akan menavigasi ke halaman login menggunakan React Router.
- Navigasi menjadi konsisten dengan sistem routing aplikasi.
- Tidak ada reload halaman saat navigasi.

## Testing
- Jalankan `npm run dev` dan pastikan homepage muncul di root URL.
- Coba navigasi ke "/login" untuk memastikan login masih berfungsi.
- Verifikasi bahwa protected routes masih memerlukan autentikasi.

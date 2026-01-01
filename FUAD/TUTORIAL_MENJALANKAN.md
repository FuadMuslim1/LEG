# Tutorial Menjalankan Aplikasi

1. **Pastikan Node.js dan npm sudah terinstall.**
   - Download dari https://nodejs.org/
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Jalankan aplikasi secara lokal:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di http://localhost:5173 (atau port yang tertera di terminal).
4. **Konfigurasi Firebase:**
   - Edit file `firebase.ts` dengan kredensial Firebase milik Anda.
5. **(Opsional) Deploy ke Firebase Hosting:**
   ```bash
   npm run build
   firebase deploy
   ```

Lihat file README.md untuk info lebih lanjut.
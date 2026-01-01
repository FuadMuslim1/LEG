# Daftar yang Perlu Diinstal di PC/Root Project

## Di PC (Sebelum Mulai)
1. **Node.js & npm** — https://nodejs.org/
2. **Git** — https://git-scm.com/
3. **VS Code** — https://code.visualstudio.com/
4. **Firebase CLI** —
   ```bash
   npm install -g firebase-tools
   ```

## Di Folder Root Project (Setelah Clone/Download)
1. **Install dependencies npm:**
   ```bash
   npm install
   ```
2. **(Opsional) Install Prettier & ESLint secara global:**
   ```bash
   npm install -g prettier eslint
   ```
3. **(Opsional) Install extension VS Code yang direkomendasikan (lihat INSTALLING_TOOLS.md)**

---

**Catatan:**
- Pastikan koneksi internet stabil saat install.
- Untuk deployment, pastikan sudah login Firebase CLI: `firebase login`.
- Jika menggunakan fitur testing, install juga Jest/Testing Library sesuai kebutuhan.
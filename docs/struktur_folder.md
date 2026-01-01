LEG/
├── 📂 .vscode/                 # Konfigurasi editor VS Code
├── 📂 components/              # Komponen UI yang dapat digunakan kembali
│   ├── 📂 Admin/
│   │   └── AdminLayout.tsx     # Layout khusus halaman admin
│   ├── ErrorBoundary.tsx       # Penanganan error aplikasi
│   ├── Layout.tsx              # Layout utama untuk User
│   └── Skeleton.tsx            # Loading placeholder
├── 📂 FUAD/                    # Dokumentasi internal & tutorial (Markdown)
│   ├── DAFTAR_FILE_ROOT.md
│   ├── DAFTAR_YANG_PERLU_INSTALL.md
│   ├── DESKRIPSI_APLIKASI.md
│   ├── TUTORIAL_MENJALANKAN.md
│   └── ... (file tutorial lainnya)
├── 📂 pages/                   # Halaman utama aplikasi
│   ├── 📂 admin/               # Halaman khusus Admin
│   │   ├── AdminDatabase.tsx
│   │   ├── AdminLord.tsx
│   │   ├── AdminNotification.tsx
│   │   ├── AdminReferral.tsx
│   │   └── AdminReward.tsx
│   ├── 📂 dashboard/            # Halaman User
│   │   ├── ProfileSettings.tsx
│   │   └── UserDashboard.tsx
│   ├── Homepage.tsx            # Landing page awal
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Subject.tsx             # (Rencana untuk dihapus/TODO)
│   ├── MaterialList.tsx        # (Rencana untuk dihapus/TODO)
│   └── Pronunciation.tsx       # (Rencana untuk dihapus/TODO)
├── 📂 public/                  # Aset statis (Gambar, Logo, dll)
├── .gitattributes              # Konfigurasi Git (LF normalization)
├── .gitignore                  # Daftar file yang diabaikan Git
├── App.tsx                     # Entry point utama & Routing React
├── firebase.json               # Konfigurasi Firebase Hosting/CLI
├── firebase.ts                 # Inisialisasi Firebase SDK
├── firestore.rules             # Aturan keamanan database
├── index.html                  # Template HTML utama
├── index.tsx                   # Mounting React ke DOM
├── package.json                # Daftar dependensi & script npm
├── README.md                   # Dokumentasi utama project
├── TODO.md                     # Daftar tugas/fitur yang akan dihapus/dibuat
├── tsconfig.json               # Konfigurasi TypeScript
├── types.ts                    # Definisi tipe data global
└── vite.config.ts              # Konfigurasi build tool Vite

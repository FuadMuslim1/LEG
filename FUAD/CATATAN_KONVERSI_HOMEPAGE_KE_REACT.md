# Catatan Konversi Homepage ke React

Proses konversi folder homepage (HTML, CSS, JS) ke komponen React.

## Langkah 1: Persiapan
- Membaca file HTML (index.html), CSS (homepage.css), JS (homepage.js)
- Memahami struktur: header, hero, sections (features, courses, testimonials), footer, modals
- Logika JS: typing effect, modal logic, scroll logic, navigation effects

## Langkah 2: Membuat Komponen React
- Membuat file pages/Homepage.tsx
- Mengonversi HTML ke JSX:
  - class -> className
  - for -> htmlFor
  - Tag self-closing
- Mengimpor CSS sebagai modul

## Langkah 3: Konversi Logika JS ke React
- Menggunakan useState untuk state modal
- Menggunakan useEffect untuk inisialisasi effects
- Mengonversi event listeners ke event handlers React
- Menggunakan useRef untuk DOM manipulation

## Langkah 4: Testing dan Integrasi
- Menjalankan aplikasi dan test komponen
- Menambahkan route ke App.tsx jika diperlukan

## Progress:
- [ ] Membuat file Homepage.tsx
- [ ] Mengonversi HTML ke JSX
- [ ] Mengimpor CSS
- [ ] Konversi typing effect
- [ ] Konversi modal logic
- [ ] Konversi scroll logic
- [ ] Konversi navigation effects
- [ ] Testing komponen
- [ ] Integrasi routing

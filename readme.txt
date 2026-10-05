# Undangan Pernikahan Agil & Inggrid

Website undangan statis tanpa framework.

## Struktur
- `index.html` — struktur halaman
- `style.css` — desain, responsive, animasi, parallax
- `script.js` — countdown, RSVP/localStorage, lightbox, musik, copy rekening, guest URL, auto-scroll
- `assets/` — foto, musik, QR lokasi

## Menjalankan
Buka `index.html` di browser. Untuk pengalaman terbaik, jalankan melalui web server sederhana/hosting statis.

## Nama tamu otomatis dari URL
Contoh:
`index.html?to=Bapak%20Budi`

Jika sudah dihosting:
`https://domain-anda.com/?to=Bapak%20Budi`

## Catatan musik
File `assets/music.mp3` adalah audio yang diberikan untuk undangan. Browser biasanya tidak mengizinkan autoplay sebelum ada interaksi pengguna, sehingga musik dimulai setelah tombol **Buka Undangan** ditekan. Tombol ♫ dapat digunakan untuk play/pause.

## RSVP
Ucapan disimpan di `localStorage` browser pengunjung. Artinya data tersimpan pada perangkat/browser masing-masing dan **belum menjadi database online**. Jika ingin RSVP masuk ke satu dashboard/database bersama, bagian ini perlu dihubungkan ke backend/Google Sheets/Firebase/Supabase.

## Lokasi
Tombol Google Maps dan QR lokasi diarahkan ke:
BARAYA VARIASI KUNINGAN RT 26 RW 05 Dusun Wage Desa Mekarwangi Kec. Lebakwangi Kab. Kuningan

## Data rekening
BRI — 4279-01-008332-53-9
Atas nama Arip Samsul Ma'arip

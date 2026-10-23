# Furia Sports Center — source aktif

Desain versi sebelumnya dipertahankan, ditambah konten venue, animasi reveal, peta, Instagram placeholder, statistik dan ulasan persisten.

## Edit dan build

- `public/index.html`, `public/style.css`, `public/script.js`, `public/community.js`: website.
- `public/config.js`: AYO, kontak/jam operasional, serta `developerUrl` untuk portofolio Hery.
- `public/assets/instagram-furiasportsclub.png`: screenshot IG pengguna; pertahankan gambar utuh dan perbarui jika ada cuplikan baru.
- `worker/index.mjs`: API, keamanan admin, rate limits, statistik dan moderasi.
- `worker/admin.mjs`: dashboard pribadi di `/admin`.
- `drizzle/0000_furia.sql`: migrasi database awal; jangan ubah setelah diterapkan.
- `node scripts/build.mjs`: mengemas UI lama dan aset lokal ke Worker.
- `node scripts/test-worker.mjs`: menguji API dengan SQLite lokal terisolasi.
- `python verify-site.py`: aset, anchor dan struktur.
- `node scripts/preview.mjs`: preview lokal dan database sementara, admin lokal otomatis. Adapter lokal tidak dipakai pada deployment.

`dist/` hanya output build. `build_page.py` dan `update-branding.mjs` merupakan generator historis; jangan dijalankan lagi.

## Statistik

Buka `/admin` dan masuk dengan kata sandi pribadi yang disimpan sebagai secret `ADMIN_PASSWORD` di Cloudflare untuk melihat 7/30/90 hari dan unduh CSV. Tidak ada angka simulasi pada dashboard produksi. Waktu WITA. Statistik hosting baru dimulai tanpa impor data lama sesuai pilihan pemilik.

`page_view` = halaman utama dibuka. Klik AYO = klik tombol booking, bukan reservasi selesai. Pengunjung-harian = browser unik per hari dijumlahkan; bukan orang unik lintas hari. Rasio klik menggunakan sesi kunjungan yang juga mengeklik AYO. IDs acak; tidak menyimpan nama/email/IP mentah dalam event statistik. Do Not Track dihormati, bot yang dikenali dan preview dikecualikan. Penghitung bukan sistem antifraud dan tetap berupa perkiraan.

## Ulasan

Form website menyimpan ke database dengan status pending. Pengelola dapat menerbitkan, menyembunyikan atau meninjau ulang di `/admin`. Data tidak hanya tersimpan di browser. Ulasan Google bisa tampil bersama dengan label sumber dan atribusi berbeda; rata-rata rating tidak dicampur.

Untuk Google otomatis, atur secret server `GOOGLE_PLACES_API_KEY` dan nilai `GOOGLE_PLACE_ID` melalui pengaturan environment Sites. Gunakan Places API (New) dengan akses/billing yang sesuai, identifikasi Place ID resmi Furia. Jangan taruh API key di source atau browser. API Google mengembalikan maksimal 5 ulasan relevan, bukan seluruh riwayat. Tanpa konfigurasi ini, section tetap berfungsi dengan ulasan website dan tautan Google Maps, tanpa rating Google palsu.

Referensi: https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places dan https://developers.google.com/maps/documentation/places/web-service/policies

## Peluncuran

Hosting utama memakai Cloudflare Worker + D1 binding DB pada akun pemilik, terhubung ke GitHub `hery4wn/furia-website`, branch `main`. Lihat `CLOUDFLARE-SETUP.md` untuk konfigurasi deployment dan status domain `furiapalopo.fit`. Instagram resmi sudah terpasang; WhatsApp dan jam operasional belum tersedia. Foto venue/fasilitas masih ilustrasi dan ditandai. Site lama tetap terpisah dengan identity `appgprj_6ac7897b5fe48191bbb1909fd3adf21d` dan audience tetap dipertahankan.

## Penyempurnaan desain dan motion

`public/refinement.css` menyempurnakan art direction di atas stylesheet lama; `public/motion.js` menangani reveal bertahap, navigasi aktif dan parallax dekoratif ringan. Konten, AYO, API statistik/ulasan, login admin dan skema database dipertahankan.

- Hero dengan frame asimetris dan indikator tab yang bergeser.
- Kartu olahraga dengan foto dan caption terpisah, hover zoom dan panah.
- Menu overlay dengan animasi buka/tutup, fokus keyboard, dan konten di belakang inert.
- Perbaikan proporsi galeri, peta, Instagram, form dan footer.
- Native smooth scrolling; tanpa scroll hijacking atau dependency animasi baru.
- Tombol jeda dan prefers-reduced-motion tetap dihormati. Tidak ada autoplay pergantian olahraga.

## Instagram resmi

Instagram: https://www.instagram.com/furiasportsclub?psln=MWgwcWR5YWxja2wzdg==
Screenshot pengguna: public/assets/instagram-furiasportsclub.png. Link terpasang di tombol, screenshot profil, dan footer. Screenshot adalah cuplikan, bukan data jumlah followers real-time. Deep link HTTPS mengikuti dukungan aplikasi/pengaturan perangkat.

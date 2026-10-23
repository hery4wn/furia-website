# GitHub dan rencana Cloudflare

Kode website, aset, animasi, statistik dan ulasan sudah ada dalam Git lokal. Target publikasi yang disarankan: repositori privat `hery4wn/furia-website`.

Repositori privat `https://github.com/hery4wn/furia-website` telah dibuat pengguna dan diverifikasi melalui konektor. Source diunggah lewat GitHub Git Data API; riwayat commit GitHub terpisah dari riwayat source Sites.

## Pembaruan foto berikutnya

Foto dan screenshot dapat ditempatkan di `public/assets/`, lalu referensinya diganti di `public/index.html`. Screenshot Instagram sekarang memakai `public/assets/instagram-placeholder.svg`. Video besar sebaiknya menggunakan penyimpanan media khusus agar repositori tidak membengkak. Perubahan aset kemudian di-commit dan di-push ke repositori yang sama.

## Batas migrasi Cloudflare

Registrasi domain tetap di Hostinger. Domain dan hosting adalah pengaturan terpisah; kode di GitHub tidak otomatis mengganti DNS maupun hosting.

Website saat ini menggunakan Cloudflare Worker melalui Sites dan database D1 yang dikelola Sites. Untuk pindah ke akun Cloudflare sendiri:

- Gunakan Cloudflare Workers dengan binding D1 `DB`, bukan hanya mengunggah HTML statis. API statistik dan ulasan memerlukan server serta database.
- Siapkan konfigurasi Wrangler dan database D1 milik akun Cloudflare. Migrasikan data produksi sebelum mengganti trafik, jika riwayat statistik/ulasan ingin dipertahankan.
- **Admin wajib diperbarui sebelum deployment langsung ke Cloudflare.** Implementasi saat ini mempercayai header identitas yang diverifikasi oleh Sites. Pada hosting mandiri header tersebut bukan bukti login. Gunakan login yang diverifikasi di server, misalnya Cloudflare Access dengan validasi JWT dan pembatasan akun pemilik. Jangan membuka API admin dengan hanya mempercayai header kiriman pengunjung.
- Hubungkan domain `furiapalopo.fit` setelah hosting, autentikasi, database dan SSL selesai diuji. Jangan mengganti MX/email ketika mengatur DNS.
- Otomasi deployment dari GitHub dapat dihubungkan setelah repositori dan akun Cloudflare siap. Saat ini belum ada koneksi deployment GitHub ke Cloudflare yang dibuat.

Situs Sites yang sekarang tetap menjadi versi aktif sampai migrasi selesai. Dokumen ini adalah catatan kesiapan, bukan konfirmasi bahwa migrasi atau push sudah dilakukan.

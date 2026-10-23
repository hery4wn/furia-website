# GitHub dan Cloudflare

Repositori privat https://github.com/hery4wn/furia-website telah terhubung ke Cloudflare Workers Builds. Push ke `main` memicu deployment otomatis. Build memakai `npm run build`, kemudian migrasi D1 dan Wrangler deploy.

Foto/screenshot berikutnya dapat ditaruh di `public/assets/`, diperbarui referensinya di halaman, lalu diunggah ke repositori ini. Screenshot Instagram saat ini `public/assets/instagram-furiasportsclub.png`. Video besar sebaiknya memakai penyimpanan media tersendiri.

Registrasi domain tetap di Hostinger; nameserver Cloudflare sudah disimpan. Kedua domain terhubung ke Worker. Propagasi DNS dan sertifikat harus diverifikasi sebelum menyatakan domain aktif.

Dashboard `/admin` menggunakan password pribadi tanpa kartu pembayaran, dengan sesi bertanda tangan dan pembatasan percobaan login. Simpan password sebagai encrypted runtime secret `ADMIN_PASSWORD`, jangan di source/repo/chat.

Lihat [CLOUDFLARE-SETUP.md](CLOUDFLARE-SETUP.md) untuk detail akun, database, deployment, keamanan dan status cutover. Site lama tetap terpisah dan tidak dihapus; statistik baru dimulai tanpa impor sesuai keputusan pemilik.

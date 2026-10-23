# Deployment Furia — Cloudflare

Status konfigurasi: 23 Oktober 2026 (WITA).

Hosting memakai akun Cloudflare pemilik, Worker `furia-website`, D1 `furia-website` dengan binding `DB`.
GitHub: https://github.com/hery4wn/furia-website — branch `main`, deployment otomatis aktif.
URL hosting: https://furia-website.heriyawan25032004.workers.dev
Domain: https://furiapalopo.fit dan https://www.furiapalopo.fit.

Hostinger tetap registrar. Nameserver sudah disimpan: `dion.ns.cloudflare.com` dan `edna.ns.cloudflare.com`.
Kedua custom domain sudah terhubung ke Worker. Aktivasi global DNS dan HTTPS masih perlu menunggu propagasi dan diperiksa; jangan menyamakan konfigurasi tersimpan dengan domain sudah aktif.

Jangan gunakan IP atau TXT verifikasi Sites lama sebagai tujuan hosting ini. Cloudflare mengelola record Worker dan sertifikat custom domain.

Admin: `/admin`, password pribadi dalam encrypted runtime secret `ADMIN_PASSWORD`, bukan login ChatGPT. Secret diisi sendiri oleh pemilik dan tidak masuk GitHub. API admin menolak akses tanpa sesi valid.

Statistik dimulai dari nol sesuai pilihan pemilik; riwayat Sites tidak diimpor. Ulasan website dimoderasi; integrasi Google membutuhkan konfigurasi tersendiri. Instagram resmi telah dipasang. WhatsApp, jadwal resmi dan dokumentasi venue asli masih dapat dilengkapi.

Detail dan perintah build: [CLOUDFLARE-SETUP.md](CLOUDFLARE-SETUP.md).

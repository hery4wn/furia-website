# Deployment Furia — Cloudflare

Status konfigurasi: 23 Oktober 2026 (WITA).

Hosting memakai akun Cloudflare pemilik, Worker `furia-website`, D1 `furia-website` dengan binding `DB`.
GitHub: https://github.com/hery4wn/furia-website — branch `main`, deployment otomatis aktif.
URL hosting: https://furia-website.heriyawan25032004.workers.dev
Domain: https://furiapalopo.fit dan https://www.furiapalopo.fit.

Hostinger tetap registrar. Nameserver sudah disimpan: `dion.ns.cloudflare.com` dan `edna.ns.cloudflare.com`.
Kedua custom domain sudah terhubung ke Worker. DNS publik sudah menunjuk ke Cloudflare. HTTPS kedua domain sudah diverifikasi dengan sertifikat valid: halaman utama dan login 200, API admin tanpa login 403. Cache DNS sebagian perangkat/browser masih dapat tertinggal selama propagasi.

Jangan gunakan IP atau TXT verifikasi Sites lama sebagai tujuan hosting ini. Cloudflare mengelola record Worker dan sertifikat custom domain.

Admin: `/admin`, password pribadi dalam encrypted runtime secret `ADMIN_PASSWORD`, bukan login ChatGPT. Secret diisi sendiri oleh pemilik dan tidak masuk GitHub. API admin menolak akses tanpa sesi valid.

Statistik dimulai dari nol sesuai pilihan pemilik; riwayat Sites tidak diimpor. Ulasan website dimoderasi; integrasi Google membutuhkan konfigurasi tersendiri. Instagram resmi telah dipasang. WhatsApp, jadwal resmi dan dokumentasi venue asli masih dapat dilengkapi.

Detail dan perintah build: [CLOUDFLARE-SETUP.md](CLOUDFLARE-SETUP.md).

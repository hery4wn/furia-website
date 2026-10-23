# Deployment Furia Sports Center

Tanggal pemeriksaan: 22 Oktober 2026 (WITA).

Website lama dipertahankan pada Site `appgprj_6ac7897b5fe48191bbb1909fd3adf21d`.
URL hosting: https://furia-sports-hery.bouncyspark1.chatgpt.site
Domain utama: https://furiapalopo.fit

## Status domain

Domain telah didaftarkan ke Site yang sama. Status awal `pending`, SSL `initializing`.
DNS publik saat diperiksa masih menunjuk ke `2.57.91.91`, bukan tujuan Sites.

Atur DNS pada penyedia domain. Untuk domain utama (apex), gunakan ALIAS/ANAME atau CNAME flattening menuju `custom-domains.chatgpt.site.` bila penyedia mendukung. Alternatif: ganti A record `@` menjadi dua alamat berikut:

| Tipe | Nama | Nilai |
| --- | --- | --- |
| A | @ | 162.159.143.30 |
| A | @ | 172.66.3.26 |
| TXT | _openai-site-verification | openai-site-verification=fEtJLUdwZY7zCIj47f1ikRUlVOVIWLN6ptNIZ9FTky4 |
| TXT | _cf-custom-hostname | 1cba4250-377d-44e6-a027-ccb20ecf580a |

Pilih salah satu metode routing (ALIAS/ANAME atau dua A record). Jangan mempertahankan A/AAAA lama yang mengarah ke hosting lain. Jangan mengubah MX/email. Nama TXT di atas relatif terhadap zona furiapalopo.fit; panel tertentu meminta nama lengkap.

Setelah propagasi, refresh status custom domain di Sites sampai domain dan SSL aktif. www belum ditambahkan. Canonical, sitemap, robots dan konfigurasi situs memakai furiapalopo.fit.

## Akses dan kesiapan publik

Audience Site saat ditinjau adalah `custom`, dengan akses hanya akun pemilik. Pengaturan ini dipertahankan. Untuk peluncuran profil bisnis ke pengunjung umum, pemilik perlu mengubah audience menjadi public.

Sebelum peluncuran: ganti foto ilustrasi/reference dengan dokumentasi venue asli, pastikan jam operasional, kontak resmi, lokasi Maps, harga/membership dan ketersediaan fasilitas. WhatsApp dan Instagram belum dikonfirmasi; tidak dibuatkan nomor/handle. Tautan AYO yang diberikan pengguna dipakai khusus booking padel; badminton/gym belum memiliki kanal reservasi terverifikasi.

## Pemeriksaan

Sintaks JavaScript, aset lokal, anchor, ID unik, urutan olahraga, penghapusan profil owner, struktur CSS dan format PNG RGBA telah diperiksa. Browser lokal gagal menjangkau server pratinjau dari lingkungan browser; pengujian visual/interaksi perlu dilanjutkan pada URL hosting.

## Pembaruan server (22 Oktober 2026)

Sumber aktif pindah ke public/ dan worker/. Build Worker mempertahankan UI sebelumnya serta menambahkan D1 binding DB. Dashboard statistik/moderasi ada di /admin dan hanya untuk akun ChatGPT pemilik. Tetap pertahankan audience lama sampai peluncuran umum disetujui. Google Places API key dan Place ID masih dibutuhkan bila ingin menampilkan ulasan Google otomatis; iframe peta tidak memerlukan key itu.

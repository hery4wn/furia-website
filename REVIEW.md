# Pemeriksaan pembaruan komunitas Furia

- Konten venue dan 8 aturan lengkap, refund, 9 fasilitas/ruang utama dan 11 fasilitas pendukung ditambahkan.
- Label tombol Booking di AYO; URL tujuan tetap sama.
- Credit pengembang Hery dan konfigurasi URL portofolio ditambahkan.
- Section Instagram desktop placeholder, maps dari iframe pengguna, ulasan website dan Google berlabel.
- Database D1 baru untuk statistik dan ulasan; dashboard owner di /admin dan ekspor CSV.
- Pengujian API memakai SQLite terisolasi: penyimpanan, duplikasi event, statistik, penolakan akses admin anonim, validasi input, origin, moderasi, dan pembatasan spam lulus.
- Uji browser lokal: pengiriman form berhasil dan tetap pending, dashboard menampilkan ulasan masuk; console tanpa error.
- Belum ada statistik contoh atau ulasan pengujian di database produksi.
- Google Reviews otomatis memerlukan konfigurasi Google Places API. Sampai tersedia, pengunjung membaca via tautan Google Maps.

## Verifikasi desain terbaru

Desktop dan mobile diperiksa pada browser. Tidak ditemukan overflow horizontal. Tab olahraga, menu buka/tutup, dialog kartu dan kontrol jeda animasi berfungsi; menjeda motion membuat seluruh konten terlihat. Tidak ada error JavaScript pada pemeriksaan browser. Pengujian API lokal tetap lulus. Parallax dibatasi pada desktop dan dinonaktifkan saat motion dijeda. Foto ilustrasi lama masih dipertahankan hingga aset venue asli tersedia.

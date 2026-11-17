# NERPS DocTrack

Prototipe aplikasi monitoring dokumentasi projek Fungsi NERPS: tracking BRD, DS, dan WO, lengkap dengan reminder deadline WO.

## Fitur
- Dashboard: card on review / on signing (BRD, DS, WO) dan deadline WO terdekat
- Tracking BRD dan DS: 5 tahap, status review per tim, log feedback dan revisi (tim, tanggal terima, tanggal revisi)
- Tracking WO: 6 tahap dari request ke sekretaris sampai WO terbit
- Notifikasi reminder WO yang mendekati batas (14 hari, kritis 7 hari)
- Hak akses: Technical Writer (CRUD), Developer (read, edit, upload), PIC NERPSP (read only)

## Struktur
```
index.html        # kerangka halaman
css/styles.css    # tema terang/gelap
js/data.js        # konstanta alur + data contoh
js/app.js         # state, render, aksi
```

## Menjalankan
Buka `index.html` di browser, atau jalankan server statis: `python3 -m http.server 8000`.

## Status prototipe
- Data masih in-memory (hilang saat refresh)
- Peran hanya simulasi lewat dropdown, belum ada login
- Outlook dan SharePoint masih mockup

## Rencana pengembangan
1. Backend + database (mis. Node/Express + PostgreSQL) dan penyimpanan berkas
2. Login SSO (Microsoft Entra ID) dan role-based access sesungguhnya
3. Integrasi Microsoft Graph API: Outlook (email WO, reminder) dan SharePoint (link review dokumen)
4. Audit trail perubahan status

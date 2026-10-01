CREATE TABLE IF NOT EXISTS anggota (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jenis_anggota TEXT NOT NULL CHECK (
        jenis_anggota IN ('Pemerintah', 'Non-Pemerintah', 'Pemerintah Daerah')
    ),
    nama_tampilan TEXT NOT NULL,
    instansi_tampilan TEXT,
    position TEXT,
    foto_tampilan TEXT,
    status_arsip BOOLEAN NOT NULL DEFAULT 0,
    tanggal_arsip TIMESTAMP NULL,
    dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anggota_non_pemerintah (
    anggota_id INTEGER PRIMARY KEY REFERENCES anggota(id) ON DELETE CASCADE,
    foto_organisasi TEXT,
    nama_organisasi TEXT NOT NULL,
    nama_ketua_organisasi TEXT,
    periode_jabatan_ketua TEXT,
    telepon_organisasi TEXT,
    email_organisasi TEXT,
    alamat_organisasi TEXT,
    foto_perwakilan TEXT,
    nama_lengkap TEXT NOT NULL,
    nik TEXT NOT NULL,
    telepon TEXT,
    email TEXT,
    alamat TEXT,
    periode_penugasan TEXT,
    jumlah_anggota INTEGER,
    surat_penunjukan_url TEXT,
    surat_pernyataan_url TEXT
);

CREATE TABLE IF NOT EXISTS anggota_pemerintah (
    anggota_id INTEGER PRIMARY KEY REFERENCES anggota(id) ON DELETE CASCADE,
    logo_kementerian TEXT,
    nama_kementerian TEXT NOT NULL,
    foto_menteri TEXT,
    nama_menteri TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS anggota_pemerintah_daerah (
    anggota_id INTEGER PRIMARY KEY REFERENCES anggota(id) ON DELETE CASCADE,
    logo_daerah TEXT,
    nama_daerah TEXT NOT NULL,
    foto_gubernur TEXT,
    nama_gubernur TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_anggota_jenis ON anggota(jenis_anggota);
CREATE INDEX IF NOT EXISTS idx_anggota_status_arsip ON anggota(status_arsip);
CREATE INDEX IF NOT EXISTS idx_anggota_nama_tampilan ON anggota(nama_tampilan);
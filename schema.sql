CREATE TABLE IF NOT EXISTS anggota (
    id BIGSERIAL PRIMARY KEY,
    jenis_anggota VARCHAR(30) NOT NULL CHECK (
        jenis_anggota IN (
            'Pemerintah',
            'Non-Pemerintah',
            'Pemerintah Daerah'
        )
    ),
    nama_tampilan VARCHAR(150) NOT NULL,
    instansi_tampilan VARCHAR(200),
    position VARCHAR(150),
    foto_tampilan TEXT,
    status_arsip BOOLEAN NOT NULL DEFAULT FALSE,
    tanggal_arsip TIMESTAMP NULL,
    dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anggota_non_pemerintah (
    anggota_id BIGINT PRIMARY KEY REFERENCES anggota(id) ON DELETE CASCADE,
    foto_organisasi TEXT,
    nama_organisasi VARCHAR(200) NOT NULL,
    nama_ketua_organisasi VARCHAR(150),
    periode_jabatan_ketua VARCHAR(100),
    telepon_organisasi VARCHAR(50),
    email_organisasi VARCHAR(150),
    alamat_organisasi TEXT,
    foto_perwakilan TEXT,
    nama_lengkap VARCHAR(150) NOT NULL,
    nik VARCHAR(50) NOT NULL,
    telepon VARCHAR(50),
    email VARCHAR(150),
    alamat TEXT,
    periode_penugasan VARCHAR(100),
    jumlah_anggota INTEGER,
    surat_penunjukan_url TEXT,
    surat_pernyataan_url TEXT
);

CREATE TABLE IF NOT EXISTS anggota_pemerintah (
    anggota_id BIGINT PRIMARY KEY REFERENCES anggota(id) ON DELETE CASCADE,
    logo_kementerian TEXT,
    nama_kementerian VARCHAR(200) NOT NULL,
    foto_menteri TEXT,
    nama_menteri VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS anggota_pemerintah_daerah (
    anggota_id BIGINT PRIMARY KEY REFERENCES anggota(id) ON DELETE CASCADE,
    logo_daerah TEXT,
    nama_daerah VARCHAR(200) NOT NULL,
    foto_gubernur TEXT,
    nama_gubernur VARCHAR(150) NOT NULL
);

ALTER TABLE anggota
    ADD COLUMN IF NOT EXISTS position VARCHAR(150);

ALTER TABLE anggota_non_pemerintah
    ADD COLUMN IF NOT EXISTS alamat TEXT;

ALTER TABLE anggota_non_pemerintah
    ADD COLUMN IF NOT EXISTS jumlah_anggota INTEGER;

CREATE INDEX IF NOT EXISTS idx_anggota_jenis
ON anggota(jenis_anggota);

CREATE INDEX IF NOT EXISTS idx_anggota_status_arsip
ON anggota(status_arsip);

CREATE INDEX IF NOT EXISTS idx_anggota_nama_tampilan
ON anggota(nama_tampilan);

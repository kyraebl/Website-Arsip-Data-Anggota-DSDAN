CREATE TABLE IF NOT EXISTS anggota (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    jenis_anggota VARCHAR(30) NOT NULL,
    nama_tampilan VARCHAR(150) NOT NULL,
    instansi_tampilan VARCHAR(200),
    `position` VARCHAR(150),
    foto_tampilan TEXT,
    status_arsip BOOLEAN NOT NULL DEFAULT FALSE,
    tanggal_arsip TIMESTAMP NULL DEFAULT NULL,
    dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_jenis_anggota CHECK (
        jenis_anggota IN ('Pemerintah', 'Non-Pemerintah', 'Pemerintah Daerah')
    ),
    INDEX idx_anggota_jenis (jenis_anggota),
    INDEX idx_anggota_status_arsip (status_arsip),
    INDEX idx_anggota_nama_tampilan (nama_tampilan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS anggota_non_pemerintah (
    anggota_id BIGINT PRIMARY KEY,
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
    surat_pernyataan_url TEXT,
    FOREIGN KEY (anggota_id) REFERENCES anggota(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS anggota_pemerintah (
    anggota_id BIGINT PRIMARY KEY,
    logo_kementerian TEXT,
    nama_kementerian VARCHAR(200) NOT NULL,
    foto_menteri TEXT,
    nama_menteri VARCHAR(150) NOT NULL,
    FOREIGN KEY (anggota_id) REFERENCES anggota(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS anggota_pemerintah_daerah (
    anggota_id BIGINT PRIMARY KEY,
    logo_daerah TEXT,
    nama_daerah VARCHAR(200) NOT NULL,
    foto_gubernur TEXT,
    nama_gubernur VARCHAR(150) NOT NULL,
    FOREIGN KEY (anggota_id) REFERENCES anggota(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
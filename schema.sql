CREATE TABLE IF NOT EXISTS members (
    id BIGSERIAL PRIMARY KEY,

    category VARCHAR(30) NOT FULL CHECK (
        category IN (
            'Pemerintah',
            'Non-Pemerintah',
            'Pemerintah Daerah',
        )
    ),

    full_name VARCHAR(150) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    position VARCHAR(150),

    email VARCHAR(150),
    phone VARCHAR(30),
    address TEXT,

    photo_url TEXT, 
    appointment_letter_url TEXT,
    statement_letter_url TEXT,

    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    archived_at TIMESTAMP NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_members_category
ON members(category);

CREATE INDEX IF NOT EXISTS idx_members_archived
ON members(is_archived);

CREATE INDEX IF NOT EXISTS idx_members_name
ON members(full_name);
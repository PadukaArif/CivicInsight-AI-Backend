import { db } from "../config/database"

db.run(`
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    account_id INTEGER NOT NULL UNIQUE,

    nik TEXT NOT NULL UNIQUE,

    full_name TEXT NOT NULL,

    role TEXT NOT NULL CHECK (
        role IN ('warga', 'admin_rt', 'admin_rw')
    ),

    rt TEXT NULL,
    rw TEXT NULL,

    phone_number TEXT,

    is_lansia INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (account_id)
        REFERENCES accounts(id)
        ON DELETE CASCADE
)
`)

// Add status and points columns to profiles if they don't exist
try {
  db.run("ALTER TABLE profiles ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved'))");
} catch (e) {}

try {
  db.run("ALTER TABLE profiles ADD COLUMN points INTEGER NOT NULL DEFAULT 0");
} catch (e) {}

// Create aduan table
db.run(`
CREATE TABLE IF NOT EXISTS aduan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    kategori TEXT NOT NULL,
    lokasi TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Terkirim' CHECK (status IN ('Terkirim', 'Diproses', 'Selesai')),
    tanggapan TEXT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
)
`)

// Create rumors table
db.run(`
CREATE TABLE IF NOT EXISTS rumors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reporter_id INTEGER NOT NULL,
    judul TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Belum Diverifikasi',
    FOREIGN KEY (reporter_id) REFERENCES accounts(id) ON DELETE CASCADE
)
`)

// Create facts table
db.run(`
CREATE TABLE IF NOT EXISTS facts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rumor_id INTEGER NULL,
    judul TEXT NOT NULL,
    penjelasan TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('fakta', 'hoaks')),
    sumber TEXT NULL,
    FOREIGN KEY (rumor_id) REFERENCES rumors(id) ON DELETE SET NULL
)
`)

// Create kas_ledger table
db.run(`
CREATE TABLE IF NOT EXISTS kas_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tanggal TEXT NOT NULL,
    keterangan TEXT NOT NULL,
    jenis TEXT NOT NULL CHECK (jenis IN ('pemasukan', 'pengeluaran')),
    jumlah REAL NOT NULL
)
`)

// Create households table
db.run(`
CREATE TABLE IF NOT EXISTS households (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kk_no TEXT NOT NULL UNIQUE,
    alamat TEXT NOT NULL,
    kepala_keluarga TEXT NOT NULL,
    phone_number TEXT NULL
)
`)

// Create household_members table
db.run(`
CREATE TABLE IF NOT EXISTS household_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    household_id INTEGER NOT NULL,
    nama TEXT NOT NULL,
    nik TEXT NOT NULL UNIQUE,
    pekerjaan TEXT NOT NULL,
    hubungan TEXT NOT NULL,
    status_kawin TEXT NOT NULL,
    pendidikan TEXT NOT NULL,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE
)
`)

// Create quiz_questions table
db.run(`
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    correct_answer TEXT NOT NULL
)
`)

// Create announcements table
db.run(`
CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Penting', 'Umum', 'Kegiatan')),
    urgency TEXT NOT NULL CHECK (urgency IN ('high', 'normal')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`)

// Create emergency_contacts table
db.run(`
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    nomor TEXT NOT NULL
)
`)

// Create comfort_votes table
db.run(`
CREATE TABLE IF NOT EXISTS comfort_votes (
    account_id INTEGER PRIMARY KEY,
    choice TEXT NOT NULL CHECK (choice IN ('sangat_nyaman', 'biasa_saja', 'cukup_khawatir')),
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
)
`)
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL bağlantı havuzu oluştur
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'booksdb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Veritabanı bağlantısını test et
pool.on('connect', () => {
  console.log('PostgreSQL veritabanına başarıyla bağlandı');
});

pool.on('error', (err) => {
  console.error('PostgreSQL bağlantı hatası:', err);
});

// Veritabanı tablosunu oluştur (eğer yoksa)
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      isbn VARCHAR(50),
      published_year INTEGER,
      genre VARCHAR(100),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log('Books tablosu hazır');
  } catch (error) {
    console.error('Tablo oluşturma hatası:', error);
  }
};

// Uygulama başladığında tabloyu oluştur
createTable();

module.exports = pool;


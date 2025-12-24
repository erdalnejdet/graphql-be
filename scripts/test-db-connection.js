const { Pool } = require('pg');
require('dotenv').config();

// Veritabanı bağlantısını test et
async function testConnection() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'booksdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    console.log('Veritabanına bağlanılıyor...');
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ Bağlantı başarılı!');
    console.log('📅 Sunucu zamanı:', result.rows[0].current_time);
    console.log('🔢 PostgreSQL versiyonu:', result.rows[0].pg_version.split('\n')[0]);
    
    // Kitapları listele
    const booksResult = await pool.query('SELECT COUNT(*) as count FROM books');
    console.log('📚 Toplam kitap sayısı:', booksResult.rows[0].count);
    
    // Tüm kitapları göster
    const allBooks = await pool.query('SELECT id, title, author FROM books ORDER BY id');
    if (allBooks.rows.length > 0) {
      console.log('\n📖 Kitaplar:');
      allBooks.rows.forEach(book => {
        console.log(`  - [${book.id}] ${book.title} - ${book.author}`);
      });
    } else {
      console.log('\n📖 Henüz kitap eklenmemiş.');
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Bağlantı hatası:', error.message);
    process.exit(1);
  }
}

testConnection();


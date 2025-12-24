const pool = require('../db/connection');

// Resolver fonksiyonları - GraphQL sorgularını ve mutation'ları işler
const resolvers = {
  Query: {
    // Tüm kitapları getir
    books: async () => {
      try {
        const result = await pool.query(
          'SELECT * FROM books ORDER BY created_at DESC'
        );
        return result.rows.map(formatBook);
      } catch (error) {
        throw new Error(`Kitaplar getirilirken hata oluştu: ${error.message}`);
      }
    },

    // ID'ye göre kitap getir
    book: async (_, { id }) => {
      try {
        const result = await pool.query(
          'SELECT * FROM books WHERE id = $1',
          [id]
        );
        
        if (result.rows.length === 0) {
          throw new Error(`ID ${id} ile kitap bulunamadı`);
        }
        
        return formatBook(result.rows[0]);
      } catch (error) {
        throw new Error(`Kitap getirilirken hata oluştu: ${error.message}`);
      }
    },

    // Kitapları ara
    searchBooks: async (_, { input }) => {
      try {
        let query = 'SELECT * FROM books WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        // Dinamik sorgu oluştur
        if (input) {
          if (input.title) {
            query += ` AND title ILIKE $${paramIndex}`;
            params.push(`%${input.title}%`);
            paramIndex++;
          }
          if (input.author) {
            query += ` AND author ILIKE $${paramIndex}`;
            params.push(`%${input.author}%`);
            paramIndex++;
          }
          if (input.genre) {
            query += ` AND genre ILIKE $${paramIndex}`;
            params.push(`%${input.genre}%`);
            paramIndex++;
          }
          if (input.publishedYear) {
            query += ` AND published_year = $${paramIndex}`;
            params.push(input.publishedYear);
            paramIndex++;
          }
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        return result.rows.map(formatBook);
      } catch (error) {
        throw new Error(`Arama yapılırken hata oluştu: ${error.message}`);
      }
    },
  },

  Mutation: {
    // Yeni kitap ekle
    createBook: async (_, { input }) => {
      try {
        const { title, author, isbn, publishedYear, genre, description } = input;

        const result = await pool.query(
          `INSERT INTO books (title, author, isbn, published_year, genre, description)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [title, author, isbn || null, publishedYear || null, genre || null, description || null]
        );

        return formatBook(result.rows[0]);
      } catch (error) {
        throw new Error(`Kitap eklenirken hata oluştu: ${error.message}`);
      }
    },

    // Kitap güncelle
    updateBook: async (_, { id, input }) => {
      try {
        // Önce kitabın var olup olmadığını kontrol et
        const checkResult = await pool.query(
          'SELECT * FROM books WHERE id = $1',
          [id]
        );

        if (checkResult.rows.length === 0) {
          throw new Error(`ID ${id} ile kitap bulunamadı`);
        }

        // Güncellenecek alanları belirle
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (input.title !== undefined) {
          updates.push(`title = $${paramIndex}`);
          values.push(input.title);
          paramIndex++;
        }
        if (input.author !== undefined) {
          updates.push(`author = $${paramIndex}`);
          values.push(input.author);
          paramIndex++;
        }
        if (input.isbn !== undefined) {
          updates.push(`isbn = $${paramIndex}`);
          values.push(input.isbn);
          paramIndex++;
        }
        if (input.publishedYear !== undefined) {
          updates.push(`published_year = $${paramIndex}`);
          values.push(input.publishedYear);
          paramIndex++;
        }
        if (input.genre !== undefined) {
          updates.push(`genre = $${paramIndex}`);
          values.push(input.genre);
          paramIndex++;
        }
        if (input.description !== undefined) {
          updates.push(`description = $${paramIndex}`);
          values.push(input.description);
          paramIndex++;
        }

        if (updates.length === 0) {
          throw new Error('Güncellenecek alan belirtilmedi');
        }

        // updated_at alanını güncelle
        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
          UPDATE books
          SET ${updates.join(', ')}
          WHERE id = $${paramIndex}
          RETURNING *
        `;

        const result = await pool.query(query, values);
        return formatBook(result.rows[0]);
      } catch (error) {
        throw new Error(`Kitap güncellenirken hata oluştu: ${error.message}`);
      }
    },

    // Kitap sil
    deleteBook: async (_, { id }) => {
      try {
        const result = await pool.query(
          'DELETE FROM books WHERE id = $1 RETURNING id',
          [id]
        );

        if (result.rows.length === 0) {
          throw new Error(`ID ${id} ile kitap bulunamadı`);
        }

        return true;
      } catch (error) {
        throw new Error(`Kitap silinirken hata oluştu: ${error.message}`);
      }
    },
  },
};

// Veritabanından gelen veriyi GraphQL formatına dönüştür
function formatBook(row) {
  return {
    id: row.id.toString(),
    title: row.title,
    author: row.author,
    isbn: row.isbn,
    publishedYear: row.published_year,
    genre: row.genre,
    description: row.description,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

module.exports = resolvers;


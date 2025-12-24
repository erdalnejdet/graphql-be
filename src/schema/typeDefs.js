const { gql } = require('apollo-server-express');

// GraphQL şema tanımlamaları
const typeDefs = gql`
  # Kitap tipi
  type Book {
    id: ID!
    title: String!
    author: String!
    isbn: String
    publishedYear: Int
    genre: String
    description: String
    createdAt: String!
    updatedAt: String!
  }

  # Kitap oluşturma için input tipi
  input CreateBookInput {
    title: String!
    author: String!
    isbn: String
    publishedYear: Int
    genre: String
    description: String
  }

  # Kitap güncelleme için input tipi
  input UpdateBookInput {
    title: String
    author: String
    isbn: String
    publishedYear: Int
    genre: String
    description: String
  }

  # Arama parametreleri için input tipi
  input SearchBooksInput {
    title: String
    author: String
    genre: String
    publishedYear: Int
  }

  # Query'ler (okuma işlemleri)
  type Query {
    # Tüm kitapları getir
    books: [Book!]!
    
    # ID'ye göre kitap getir
    book(id: ID!): Book
    
    # Kitapları ara
    searchBooks(input: SearchBooksInput): [Book!]!
  }

  # Mutation'lar (yazma işlemleri)
  type Mutation {
    # Yeni kitap ekle
    createBook(input: CreateBookInput!): Book!
    
    # Kitap güncelle
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    
    # Kitap sil
    deleteBook(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;


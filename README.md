# GraphQL Books API

PostgreSQL veritabanı kullanan kitaplar için GraphQL API'si.

## Özellikler

- ✅ Kitap ekleme (Create)
- ✅ Kitap silme (Delete)
- ✅ Kitap arama (Search)
- ✅ Tüm kitapları listeleme
- ✅ Kitap güncelleme
- ✅ Docker desteği

## Teknolojiler

- Node.js
- Express
- Apollo Server (GraphQL)
- PostgreSQL
- Docker & Docker Compose

## Kurulum

### Docker ile Çalıştırma (Önerilen)

1. Projeyi klonlayın veya indirin
2. Docker Compose ile servisleri başlatın:

```bash
docker-compose up --build
```

API `http://localhost:4000/graphql` adresinde çalışacaktır.

### Yerel Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. PostgreSQL veritabanını başlatın ve `.env` dosyasını oluşturun:

```bash
cp .env.example .env
```

3. `.env` dosyasını düzenleyin ve veritabanı bilgilerinizi girin.

4. Uygulamayı başlatın:

```bash
npm start
```

Geliştirme modu için:

```bash
npm run dev
```

## GraphQL Playground

Uygulama başladıktan sonra tarayıcınızda şu adresi açın:

```
http://localhost:4000/graphql
```

## Örnek Sorgular

### Tüm kitapları getir

```graphql
query {
  books {
    id
    title
    author
    isbn
    publishedYear
    genre
    description
  }
}
```

### Kitap ekle

```graphql
mutation {
  createBook(input: {
    title: "Savaş ve Barış"
    author: "Lev Tolstoy"
    isbn: "978-975-08-1234-5"
    publishedYear: 1869
    genre: "Klasik"
    description: "Rus edebiyatının başyapıtlarından biri"
  }) {
    id
    title
    author
  }
}
```

### Kitap ara

```graphql
query {
  searchBooks(input: {
    author: "Tolstoy"
  }) {
    id
    title
    author
    publishedYear
  }
}
```

### Kitap güncelle

```graphql
mutation {
  updateBook(id: "1", input: {
    title: "Savaş ve Barış (Güncellenmiş)"
    description: "Yeni açıklama"
  }) {
    id
    title
    description
  }
}
```

### Kitap sil

```graphql
mutation {
  deleteBook(id: "1")
}
```

## Veritabanı Yapısı

```sql
CREATE TABLE books (
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
```

## Veritabanına Bağlanma

### Bağlantı Bilgileri

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `booksdb`
- **User:** `postgres`
- **Password:** `postgres`

### Bağlantı Yöntemleri

#### 1. Docker Container İçinden (Önerilen)

```bash
docker exec -it books-postgres psql -U postgres -d booksdb
```

#### 2. Yerel psql ile

Eğer sisteminizde psql yüklüyse:

```bash
psql -h localhost -p 5432 -U postgres -d booksdb
```

Şifre sorulduğunda: `postgres`

#### 3. Test Script ile

Veritabanı bağlantısını test etmek için:

```bash
npm run test-db
```

#### 4. Harici PostgreSQL Client ile

pgAdmin, DBeaver, TablePlus veya DataGrip gibi araçları kullanarak yukarıdaki bağlantı bilgileriyle bağlanabilirsiniz.

## Docker Komutları

- Servisleri başlat: `docker-compose up`
- Arka planda başlat: `docker-compose up -d`
- Servisleri durdur: `docker-compose down`
- Logları görüntüle: `docker-compose logs -f`
- Veritabanını sıfırla: `docker-compose down -v`


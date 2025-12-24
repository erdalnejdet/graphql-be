const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers/index');
require('dotenv').config();

// Express uygulaması oluştur
const app = express();

// Traefik reverse proxy için trust proxy ayarı
app.set('trust proxy', true);

// CORS ayarları - Frontend'den gelen isteklere izin ver
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://graphql-backend-rhisd5-700af6-57-131-28-216.traefik.me',
  'https://graphql-backend-rhisd5-700af6-57-131-28-216.traefik.me'
];

// Ortam değişkeninden ek origin'ler ekle
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
}

app.use(cors({
  origin: function (origin, callback) {
    // Origin yoksa (örneğin Postman, curl) veya izin verilen listede ise izin ver
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Geçici olarak tüm origin'lere izin ver, production'da kısıtlayın
    }
  },
  credentials: true
}));

// Health-check endpoint'i - Sunucunun çalışıp çalışmadığını kontrol eder
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'GraphQL API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GraphQL health-check endpoint'i
app.get('/graphql/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'GraphQL API',
    endpoint: '/graphql',
    timestamp: new Date().toISOString()
  });
});

// Apollo Server oluştur
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // GraphQL playground için
  playground: true, // Geliştirme ortamı için GraphQL playground'u etkinleştir
  context: ({ req }) => {
    // Request bilgilerini context'e ekle (gerekirse)
    return {
      req
    };
  },
});

// Apollo Server'ı başlat ve Express'e bağla
async function startServer() {
  await server.start();
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: false // CORS'u Express middleware'inde yönetiyoruz
  });

  const PORT = process.env.PORT || 4000;
  const HOST = process.env.HOST || '0.0.0.0';

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server ${HOST}:${PORT} adresinde çalışıyor`);
    console.log(`📚 GraphQL endpoint: http://${HOST}:${PORT}${server.graphqlPath}`);
    console.log(`🎮 GraphQL Playground: http://${HOST}:${PORT}${server.graphqlPath}`);
    console.log(`❤️  Health check: http://${HOST}:${PORT}/health`);
    console.log(`🔍 GraphQL health check: http://${HOST}:${PORT}/graphql/health`);
  });
}

startServer().catch((error) => {
  console.error('Server başlatılırken hata oluştu:', error);
});


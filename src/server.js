const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers/index');
require('dotenv').config();

// Express uygulaması oluştur
const app = express();

// CORS ayarları - Frontend'den gelen isteklere izin ver
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
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
});

// Apollo Server'ı başlat ve Express'e bağla
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
    console.log(`📚 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🎮 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 GraphQL health check: http://localhost:${PORT}/graphql/health`);
  });
}

startServer().catch((error) => {
  console.error('Server başlatılırken hata oluştu:', error);
});


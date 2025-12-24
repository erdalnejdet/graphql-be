# Node.js base image kullan
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama dosyalarını kopyala
COPY . .

# Portu expose et
EXPOSE 4000

# Uygulamayı başlat
CMD ["npm", "start"]


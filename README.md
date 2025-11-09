# 🌐 WebAPI - Oyun Metadata Servisi

Bu dizin VPS'e deploy edilecek **public** metadata servisini içerir.

## 📋 İçerik

- **`games.json`** - Tüm oyunların metadata'sı (exe adları, save klasörleri, görseller)
- **`validate-json.js`** - JSON formatını doğrulama scripti
- **`update-metadata.js`** - Metadata güncelleme scripti

## 🚀 Deployment

### Seçenek 1: GitHub Raw (Ücretsiz)

1. **games.json'ı GitHub'a push et:**
```bash
git add webapi/games.json
git commit -m "Update games metadata"
git push origin main
```

2. **Raw URL'i al:**
```
https://raw.githubusercontent.com/KULLANICI_ADIN/Oyun-Servisi/main/webapi/games.json
```

3. **Backend .env dosyasına ekle:**
```env
WEBAPI_URL=https://raw.githubusercontent.com/KULLANICI_ADIN/Oyun-Servisi/main/webapi/games.json
```

### Seçenek 2: VPS (Önerilen)

1. **VPS'e yükle:**
```bash
scp games.json user@your-vps.com:/var/www/api/
```

2. **Nginx config (örnek):**
```nginx
server {
    listen 80;
    server_name your-vps.com;
    
    location /api/games.json {
        root /var/www/api;
        add_header Access-Control-Allow-Origin *;
        add_header Content-Type application/json;
    }
}
```

3. **Backend .env dosyasına ekle:**
```env
WEBAPI_URL=https://your-vps.com/api/games.json
```

### Seçenek 3: CDN (Cloudflare, AWS S3)

1. **S3'e yükle** veya Cloudflare Pages kullan
2. **Public URL'i .env'e ekle:**
```env
WEBAPI_URL=https://cdn.example.com/games.json
```

## 🏗️ Mimari

```
┌─────────────────────────────────────────┐
│           VPS / GitHub / CDN            │
│                                         │
│    📄 games.json (Public WebAPI)       │
│    - Oyun exe isimleri                 │
│    - Save klasör yolları               │
│    - Metadata & görseller              │
└─────────────────────────────────────────┘
                    ↓ HTTP Fetch
        ┌───────────────────────────┐
        │   Kullanıcının PC'si      │
        │                           │
        │  Backend (Local)          │
        │  - WebAPI'den veri çek    │
        │  - Oyun tarama            │
        │  - Local DB yönetimi      │
        │                           │
        │  Frontend + Electron      │
        │  - Oyun arayüzü           │
        │  - Oyun başlatma          │
        └───────────────────────────┘
```

## 📊 JSON Formatı

```json
{
  "games": [
    {
      "id": "gta-v",
      "gameName": "Grand Theft Auto V",
      "year": 2013,
      "genre": "Aksiyon",
      "paths": {
        "folderName": "GTA 5",
        "exeName": "GTA5.exe",
        "childFolder": null,
        "saveFolder": "%userprofile%\\Documents\\Rockstar Games\\GTA V\\Profiles"
      },
      "metadata": {
        "description": "Açık dünya aksiyon-macera oyunu",
        "images": {
          "background": "https://cdn.example.com/gta5-bg.jpg",
          "cover": "https://cdn.example.com/gta5-cover.jpg",
          "igdb": "https://cdn.example.com/gta5-igdb.jpg"
        }
      },
      "tags": ["Açık Dünya", "Çok Oyunculu", "Aksiyon"]
    }
  ]
}
```

## 🔒 Güvenlik

- **CORS**: WebAPI public erişilebilir olmalı
- **Rate Limiting**: VPS'te rate limiting aktif olmalı
- **Caching**: CDN veya browser cache kullan
- **Validation**: Her güncelleme sonrası `validate-json.js` çalıştır

## 🔄 Güncelleme Süreci

1. Yeni oyun metadata'sı ekle
2. `node validate-json.js` ile doğrula
3. VPS/GitHub'a yükle
4. Kullanıcılar otomatik olarak yeni metadata'yı alır (backend restart gerekmez)

## 📝 Bilinmeyen Oyun Bildirimi

Kullanıcılar bilinmeyen oyunları VPS'e bildirip yeni metadata ekleyebilir:

```javascript
// Backend'den gelen bildirimi VPS'e gönder
POST https://your-vps.com/api/report-unknown
{
  "folderName": "New Game",
  "exeName": "newgame.exe",
  "path": "C:/Games/New Game/newgame.exe"
}
```

## 🧪 Test

WebAPI'nin erişilebilir olduğunu test et:

```bash
curl https://your-vps.com/api/games.json
```

veya

```bash
curl https://raw.githubusercontent.com/user/repo/main/webapi/games.json
```

## 📦 CDN Cache Temizleme

Cloudflare kullanıyorsan cache'i temizle:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://cdn.example.com/games.json"]}'
```

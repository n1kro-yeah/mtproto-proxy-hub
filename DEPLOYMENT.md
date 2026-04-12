# 🚀 Deployment Guide

## Production Build

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

Для production рекомендуется использовать:
- **Gunicorn** с uvicorn workers
- **Nginx** как reverse proxy
- **Systemd** для автозапуска

### Frontend

```bash
cd frontend
npm install
npm run build
```

Собранные файлы будут в `frontend/dist/`

## Docker (опционально)

### Backend Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile

```dockerfile
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

## Environment Variables

### Backend
- `PORT` - порт сервера (default: 8000)
- `PROXY_SOURCE_URL` - URL для загрузки прокси (default: GitHub)

### Frontend
- `VITE_API_URL` - URL бэкенда (default: /api)

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/mtproto-proxy-hub;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Systemd Service

### Backend Service

```ini
[Unit]
Description=MTProto Proxy Hub Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/mtproto-proxy-hub/backend
ExecStart=/usr/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Сохраните как `/etc/systemd/system/mtproto-backend.service`

```bash
sudo systemctl enable mtproto-backend
sudo systemctl start mtproto-backend
```

## Security Checklist

- [ ] Используйте HTTPS (Let's Encrypt)
- [ ] Настройте firewall (ufw/iptables)
- [ ] Ограничьте CORS в production
- [ ] Используйте environment variables для секретов
- [ ] Регулярно обновляйте зависимости
- [ ] Настройте rate limiting
- [ ] Включите логирование

## Monitoring

Рекомендуемые инструменты:
- **PM2** - для Node.js процессов
- **Supervisor** - для Python процессов
- **Prometheus + Grafana** - метрики
- **Sentry** - отслеживание ошибок

## Backup

Регулярно делайте backup:
- Конфигурационных файлов
- Базы данных (если используется)
- Логов

## Performance Tips

1. Используйте CDN для статики
2. Включите gzip compression
3. Настройте кэширование
4. Используйте HTTP/2
5. Оптимизируйте изображения

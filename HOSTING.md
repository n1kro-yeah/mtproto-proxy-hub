# 🌐 Hosting Guide

## Рекомендуемый способ: Vercel (Бесплатно)

### Шаг 1: Подготовка

1. Убедитесь, что все изменения закоммичены и запушены на GitHub
2. Зарегистрируйтесь на https://vercel.com (можно через GitHub)

### Шаг 2: Деплой

1. Зайдите на https://vercel.com/new
2. Выберите "Import Git Repository"
3. Найдите ваш репозиторий `mtproto-proxy-hub`
4. Нажмите "Import"
5. Настройте проект:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Нажмите "Deploy"

### Шаг 3: Настройка бэкенда

Для бэкенда нужен отдельный деплой:

1. Создайте новый проект на Vercel
2. Выберите тот же репозиторий
3. Настройте:
   - **Root Directory**: `backend`
   - **Build Command**: оставьте пустым
   - **Output Directory**: оставьте пустым
4. Добавьте Environment Variables (если нужно)
5. Deploy

### Шаг 4: Обновите API URL

В `frontend/src/services/api.ts` измените:

```typescript
const API_BASE = import.meta.env.PROD 
  ? 'https://your-backend.vercel.app/api' 
  : '/api';
```

---

## Альтернатива 1: Netlify (Бесплатно)

### Для фронтенда:

1. Зайдите на https://netlify.com
2. "Add new site" → "Import an existing project"
3. Выберите GitHub репозиторий
4. Настройте:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Deploy

### Для бэкенда:

Используйте Railway, Render или Heroku (см. ниже)

---

## Альтернатива 2: Railway (Бесплатно с лимитами)

### Для бэкенда:

1. Зайдите на https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Выберите репозиторий
4. Railway автоматически определит Python
5. Настройте:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy

---

## Альтернатива 3: Render (Бесплатно)

### Для бэкенда:

1. Зайдите на https://render.com
2. "New" → "Web Service"
3. Подключите GitHub репозиторий
4. Настройте:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy

### Для фронтенда:

1. "New" → "Static Site"
2. Выберите репозиторий
3. Настройте:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Deploy

---

## Альтернатива 4: GitHub Pages (Только фронтенд)

⚠️ **Внимание**: GitHub Pages поддерживает только статические сайты. Бэкенд нужно хостить отдельно.

1. Установите gh-pages:
```bash
cd frontend
npm install --save-dev gh-pages
```

2. Добавьте в `package.json`:
```json
{
  "homepage": "https://your-username.github.io/mtproto-proxy-hub",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Деплой:
```bash
npm run deploy
```

---

## Альтернатива 5: Docker + VPS

Если у вас есть свой сервер:

1. Используйте Docker Compose из `DEPLOYMENT.md`
2. Настройте Nginx
3. Получите SSL сертификат (Let's Encrypt)

---

## 🔧 После деплоя

1. **Обновите README** с ссылкой на живой сайт
2. **Добавьте бейдж** в README:
```markdown
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-site.vercel.app)
```

3. **Настройте custom domain** (опционально):
   - В Vercel: Settings → Domains
   - Добавьте ваш домен
   - Обновите DNS записи

4. **Включите HTTPS** (обычно автоматически)

5. **Настройте мониторинг** (опционально):
   - Vercel Analytics
   - Google Analytics
   - Sentry для ошибок

---

## 📊 Рекомендации

**Для простого проекта:**
- Фронтенд: Vercel или Netlify
- Бэкенд: Railway или Render

**Для production:**
- Фронтенд: Vercel + CDN
- Бэкенд: VPS + Docker + Nginx

**Бесплатные лимиты:**
- Vercel: 100GB bandwidth/месяц
- Netlify: 100GB bandwidth/месяц
- Railway: $5 credit/месяц
- Render: 750 часов/месяц

---

## 🆘 Troubleshooting

**Проблема**: API не работает после деплоя
- Проверьте CORS настройки в `backend/main.py`
- Убедитесь, что API URL правильный в фронтенде

**Проблема**: Шрифты не загружаются
- Проверьте пути к шрифтам в `fonts.css`
- Убедитесь, что папка `public` включена в build

**Проблема**: 404 на роутах
- Добавьте `_redirects` файл для Netlify
- Или настройте rewrites в `vercel.json`

---

Удачи с деплоем! 🚀

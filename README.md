# MTProto Proxy Hub

Красивый веб-интерфейс для мониторинга Telegram MTProto и SOCKS5 прокси с современным дизайном Ocean Teal и Slate Night.

## ✨ Особенности

🎨 **Современный дизайн** - Ocean Teal цветовая схема с плавными анимациями  
🌙 **Темная тема (BETA)** - Slate Night палитра для комфортной работы ночью  
🚀 **Автоматическая загрузка** - Прокси загружаются из GitHub при старте  
📊 **Статистика в реальном времени** - Онлайн/оффлайн/проверка счетчики  
🔄 **Пульсирующие индикаторы** - Анимированные статус-индикаторы для всех состояний  
🌍 **Геолокация** - Определение страны и города прокси  
⚡ **Измерение задержки** - Цветовая индикация скорости (отлично/хорошо/средне/плохо)  
📋 **Копирование ссылок** - Быстрое копирование tg:// ссылок  
🔀 **Сортировка** - По задержке, статусу, типу, стране  
🎭 **Плавные анимации** - Framer Motion для перемещения карточек  
🔄 **Обновление в один клик** - Проверка всех прокси одновременно  
🎯 **Material UI иконки** - Современные иконки вместо эмодзи

## Структура проекта

```
mtproto-proxy-hub/
├── backend/              # FastAPI сервер
│   ├── main.py          # API endpoints
│   └── requirements.txt
├── frontend/            # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/  # ProxyCard
│   │   ├── services/    # API service
│   │   ├── styles/      # Soft UI CSS
│   │   ├── types/       # TypeScript types + hardcoded proxies
│   │   ├── App.tsx      # Main app
│   │   └── main.tsx     # Entry point
│   └── package.json
└── data/                # (не используется, прокси захардкожены)
```

## 🚀 Быстрый старт

### Автоматический запуск (Windows)

```bash
cd start
start-all.bat
```

Это запустит и бэкенд, и фронтенд автоматически.

### Backend (Python)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API будет доступен на `http://localhost:8000`

**При старте бэкенд автоматически загрузит прокси из:**
- GitHub репозитория: https://github.com/SoliSpirit/mtproto/blob/master/all_proxies.txt
- Ваши хардкоженные прокси из `frontend/src/types/proxy.ts`

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Фронтенд будет доступен на `http://localhost:3000`

## 🎯 Основные функции

### Сортировка прокси
- По задержке (latency)
- По статусу (online/offline/checking/unchecked)
- По типу (MTProto/SOCKS5)
- По стране
- Направление: возрастание/убывание
- Плавная анимация перемещения карточек

### Темная тема (BETA)
- Переключение через кнопку в правом верхнем углу
- Slate Night цветовая палитра
- Сохранение выбора в localStorage
- Адаптация всех компонентов

### Статус-индикаторы
- 🟢 Online - зеленый пульсирующий
- 🔴 Offline - красный пульсирующий
- 🔵 Checking - бирюзовый пульсирующий
- 🟡 Unchecked - желтый пульсирующий

## 📋 Добавление новых прокси

Прокси захардкожены в файле `frontend/src/types/proxy.ts`:

```typescript
export const HARDCODED_PROXIES = [
  {
    type: 'mtproto',
    host: 'example.com',
    port: 443,
    secret: 'your_secret_here'
  },
  {
    type: 'socks5',
    host: '1.2.3.4',
    port: 1080,
    user: 'username',
    pass: 'password'
  }
];
```

После изменения перезапустите фронтенд.

## 📝 API Endpoints

- `GET /proxies` - Получить список загруженных прокси
- `POST /check-proxy` - Проверить один прокси
- `POST /check-all-proxies` - Проверить все прокси параллельно

## 🛠 Технологии

**Backend:**
- FastAPI - async веб-фреймворк
- httpx - HTTP клиент для геолокации и загрузки прокси
- Pydantic - валидация данных
- uvicorn - ASGI сервер

**Frontend:**
- React 18 - UI библиотека
- TypeScript - типизация
- Vite - сборщик
- Framer Motion - анимации
- Material UI Icons - иконки
- SF Pro Display & SF Mono - шрифты

**Дизайн:**
- Ocean Teal (#14b8a6) - основной цвет
- Slate Night (#334155, #475569, #1e293b) - темная тема
- Градиентные фоны и кнопки
- Мягкие тени (shadow-xs до shadow-xl)
- Плавные переходы (cubic-bezier)
- Анимации: fadeIn, slideUp, cardShuffle, ping, pulse
- Hover эффекты с подъемом элементов
- Цветовая индикация статуса и задержки
- Адаптивный дизайн

## Формат ссылок

**MTProto:**
```
tg://proxy?server=HOST&port=PORT&secret=SECRET
```

**SOCKS5:**
```
tg://socks?server=HOST&port=PORT&user=USER&pass=PASS
```

## 🖼 Скриншоты

_Добавьте скриншоты в папку `screenshots/` и обновите этот раздел_

## 📄 Лицензия

MIT - см. файл [LICENSE](LICENSE)

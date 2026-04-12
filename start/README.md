# 🚀 MTProto Proxy Hub - Launcher Scripts

Эта папка содержит удобные скрипты для запуска приложения.

## 📁 Файлы

### `start-all.bat` ⭐ (Рекомендуется)
Интерактивная **панель управления** для Backend и Frontend.
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`
- Серверы запускаются в фоновом режиме (без отдельных окон)
- Управление через команды в главной консоли

**Использование:**
1. Двойной клик по файлу
2. Оба сервера запустятся автоматически в фоне
3. Откройте браузер: `http://localhost:3000`
4. Используйте команды для управления серверами

**Доступные команды:**
- `stop-backend` - Остановить Backend сервер
- `stop-frontend` - Остановить Frontend сервер
- `stop` - Остановить все серверы
- `status` - Показать статус серверов
- `restart` - Перезапустить все серверы
- `exit` - Остановить все и выйти

---

### `start-backend.bat`
Запускает **только Backend** (Python FastAPI).
- Порт: `8000`
- API доступен на: `http://localhost:8000`

**Использование:**
- Двойной клик по файлу
- Сервер запустится с hot-reload

---

### `start-frontend.bat`
Запускает **только Frontend** (React + Vite).
- Порт: `3000`
- Приложение доступно на: `http://localhost:3000`

**Использование:**
- Двойной клик по файлу
- Dev сервер запустится с hot-reload

---

## 🔧 Требования

### Backend
- Python 3.8+
- Установленные зависимости: `pip install -r backend/requirements.txt`

### Frontend
- Node.js 16+
- Установленные зависимости: `npm install` в папке `frontend/`

---

## 🎯 Быстрый старт

1. **Установите зависимости** (один раз):
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   cd ..

   # Frontend
   cd frontend
   npm install
   cd ..
   ```

2. **Запустите приложение**:
   - Двойной клик по `start-all.bat`
   - Откройте браузер: `http://localhost:3000`

3. **Управление серверами**:
   ```
   Enter command: status          # Проверить статус
   Enter command: stop-backend    # Остановить Backend
   Enter command: stop-frontend   # Остановить Frontend
   Enter command: stop            # Остановить всё
   Enter command: restart         # Перезапустить всё
   Enter command: exit            # Выйти
   ```

4. **Готово!** 🎉

---

## 🛑 Остановка серверов

**Через панель управления:**
- Введите `stop` для остановки всех серверов
- Введите `exit` для остановки и выхода

**Вручную:**
- Закройте окно панели управления (серверы продолжат работать)
- Используйте Task Manager для остановки процессов

---

## 📝 Примечания

- Backend должен быть запущен для работы проверки прокси
- Frontend может работать без Backend (но без функционала проверки)
- Оба сервера поддерживают hot-reload (автоматическая перезагрузка при изменении кода)
- Серверы запускаются в фоновом режиме - не будет лишних окон!

---

## 🎮 Панель управления

Главная консоль (`start-all.bat`) предоставляет интерактивное управление:

```
========================================
  MTProto Proxy Hub - Control Panel
========================================

[OK] Backend started on http://localhost:8000
[OK] Frontend started on http://localhost:3000

========================================
  Servers Status
========================================
Backend:  RUNNING (http://localhost:8000)
Frontend: RUNNING (http://localhost:3000)

========================================
  Available Commands
========================================
stop-backend  - Stop Backend server
stop-frontend - Stop Frontend server
stop          - Stop all servers
status        - Show servers status
restart       - Restart all servers
exit          - Stop all and exit
========================================

Enter command: _
```

---

## 🎨 Особенности

- ✨ Soft UI дизайн
- 🌊 Ocean Teal цветовая схема
- 🌙 Темная тема (Slate Night)
- 🔤 SF Pro Display шрифты
- 📊 Сортировка прокси (Latency, Status, Type, Country)
- 🚀 Автоматическая проверка прокси
- 🌍 Геолокация
- ⚡ Измерение задержки

---

**Приятного использования!** 🚀

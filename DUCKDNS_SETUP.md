# DuckDNS Setup for Vercel

## ⚠️ Предупреждение
DuckDNS + Vercel не идеальная комбинация из-за динамических IP Vercel. Рекомендуется использовать встроенный домен Vercel.

## Шаги настройки

### 1. Создайте DuckDNS домен
1. Зайдите на https://www.duckdns.org
2. Войдите через GitHub/Google
3. Создайте поддомен: `your-name.duckdns.org`
4. Сохраните токен

### 2. Узнайте IP Vercel
```bash
nslookup your-project.vercel.app
```

Или используйте онлайн инструмент: https://mxtoolbox.com/DNSLookup.aspx

### 3. Обновите DuckDNS
На странице DuckDNS:
- Введите IP адрес Vercel
- Нажмите "update ip"

### 4. Добавьте домен в Vercel
1. Vercel Dashboard → Your Project → Settings → Domains
2. Добавьте: `your-name.duckdns.org`
3. Vercel покажет инструкции по настройке DNS

### 5. Настройте A запись
В DuckDNS установите A запись на IP Vercel

## Проблемы и решения

**Проблема:** IP Vercel меняется
**Решение:** Используйте скрипт для автоматического обновления IP

**Проблема:** Нет HTTPS
**Решение:** Vercel автоматически предоставит Let's Encrypt сертификат

**Проблема:** Медленная работа
**Решение:** Используйте Cloudflare как прокси

## Автоматическое обновление IP (опционально)

Создайте скрипт для обновления IP:

```bash
#!/bin/bash
DOMAIN="your-name"
TOKEN="your-duckdns-token"
VERCEL_URL="your-project.vercel.app"

# Получить IP Vercel
IP=$(dig +short $VERCEL_URL | head -n1)

# Обновить DuckDNS
curl "https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip=$IP"
```

Запускайте этот скрипт через cron каждый час.

## Рекомендация

Вместо DuckDNS используйте:
1. **Встроенный домен Vercel** (бесплатно, надежно)
2. **Freenom** (бесплатные домены)
3. **Cloudflare** (с дешевым доменом)

Эти варианты работают лучше с Vercel!

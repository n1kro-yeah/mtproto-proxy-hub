export type Language = 'en' | 'ru';

export const translations = {
  en: {
    // Header
    title: 'MTProto Proxy Hub',
    subtitle: 'Monitor your Telegram proxy connections',
    
    // Stats
    online: 'Online',
    offline: 'Offline',
    checking: 'Checking',
    unchecked: 'Unchecked',
    
    // Proxy List
    proxyList: 'Proxy List',
    lastChecked: 'Last checked',
    
    // Buttons
    refreshAll: 'Refresh All',
    checkingAll: 'Checking All...',
    check: 'Check',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    sort: 'Sort',
    reset: 'Reset',
    cancel: 'Cancel',
    save: 'Save',
    
    // Sort options
    sortBy: 'Sort by',
    ping: 'Ping',
    status: 'Status',
    type: 'Type',
    country: 'Country',
    
    // Ping types
    pingType: 'Ping Type',
    tcpPing: 'TCP Ping',
    tcpPingDesc: 'Connection time to proxy port',
    icmpPing: 'ICMP Ping',
    icmpPingDesc: 'Network latency (may be blocked)',
    viaProxy: 'Via Proxy',
    viaProxyDesc: 'HTTP request through proxy',
    
    // Dialog
    configureViaProxyUrl: 'Configure Via Proxy URL',
    testUrl: 'Test URL',
    testUrlHelper: 'URL to test proxy connectivity (should return 204 No Content)',
    
    // Proxy card
    host: 'Host',
    port: 'Port',
    secret: 'Secret',
    user: 'User',
    pass: 'Pass',
    location: 'Location',
    unknown: 'Unknown',
    
    // Theme
    toggleTheme: 'Toggle theme (Beta)',
    
    // Errors
    failedToCheckProxies: 'Failed to check proxies',
    failedToCheckProxy: 'Failed to check proxy',
  },
  ru: {
    // Header
    title: 'MTProto Proxy Hub',
    subtitle: 'Мониторинг ваших Telegram прокси-соединений',
    
    // Stats
    online: 'Онлайн',
    offline: 'Оффлайн',
    checking: 'Проверка',
    unchecked: 'Не проверено',
    
    // Proxy List
    proxyList: 'Список прокси',
    lastChecked: 'Последняя проверка',
    
    // Buttons
    refreshAll: 'Обновить все',
    checkingAll: 'Проверка всех...',
    check: 'Проверить',
    copyLink: 'Копировать ссылку',
    copied: 'Скопировано!',
    sort: 'Сортировка',
    reset: 'Сброс',
    cancel: 'Отмена',
    save: 'Сохранить',
    
    // Sort options
    sortBy: 'Сортировать по',
    ping: 'Пинг',
    status: 'Статус',
    type: 'Тип',
    country: 'Страна',
    
    // Ping types
    pingType: 'Тип пинга',
    tcpPing: 'TCP Пинг',
    tcpPingDesc: 'Время подключения к порту прокси',
    icmpPing: 'ICMP Пинг',
    icmpPingDesc: 'Сетевая задержка (может быть заблокирован)',
    viaProxy: 'Через прокси',
    viaProxyDesc: 'HTTP запрос через прокси',
    
    // Dialog
    configureViaProxyUrl: 'Настройка URL для проверки через прокси',
    testUrl: 'Тестовый URL',
    testUrlHelper: 'URL для проверки прокси (должен возвращать 204 No Content)',
    
    // Proxy card
    host: 'Хост',
    port: 'Порт',
    secret: 'Секрет',
    user: 'Пользователь',
    pass: 'Пароль',
    location: 'Местоположение',
    unknown: 'Неизвестно',
    
    // Theme
    toggleTheme: 'Переключить тему (Бета)',
    
    // Errors
    failedToCheckProxies: 'Не удалось проверить прокси',
    failedToCheckProxy: 'Не удалось проверить прокси',
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key];
}

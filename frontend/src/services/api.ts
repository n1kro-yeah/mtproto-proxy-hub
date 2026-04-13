import type { Proxy } from '../types/proxy';
import type { PingType } from '../components/PingTypeControl';

const getApiBase = () => {
  const backendLanguage = localStorage.getItem('backendLanguage') || 'python';
  if (backendLanguage === 'csharp') {
    return 'http://127.0.0.1:8001/api';
  } else if (backendLanguage === 'cpp') {
    return 'http://127.0.0.1:8002/api';
  }
  return '/api';
};

export const proxyService = {
  async getProxies(): Promise<Omit<Proxy, 'status' | 'latency' | 'country' | 'city' | 'last_checked'>[]> {
    const API_BASE = getApiBase();
    const response = await fetch(`${API_BASE}/proxies`);
    if (!response.ok) throw new Error('Failed to fetch proxies');
    const data = await response.json();
    return data.proxies;
  },

  async checkProxy(
    proxy: Omit<Proxy, 'status' | 'latency' | 'country' | 'city' | 'last_checked'>,
    pingType: PingType = 'tcp',
    viaProxyUrl?: string
  ): Promise<Proxy> {
    const API_BASE = getApiBase();
    const response = await fetch(`${API_BASE}/check-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...proxy, 
        ping_type: pingType,
        via_proxy_url: viaProxyUrl
      })
    });
    if (!response.ok) throw new Error('Failed to check proxy');
    return response.json();
  },

  async checkAllProxies(
    proxies: Omit<Proxy, 'status' | 'latency' | 'country' | 'city' | 'last_checked'>[],
    pingType: PingType = 'tcp',
    viaProxyUrl?: string
  ): Promise<Proxy[]> {
    const API_BASE = getApiBase();
    const proxiesWithPingType = proxies.map(p => ({ 
      ...p, 
      ping_type: pingType,
      via_proxy_url: viaProxyUrl
    }));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    try {
      const response = await fetch(`${API_BASE}/check-all-proxies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxies: proxiesWithPingType }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Failed to check proxies');
      return response.json();
    } finally {
      clearTimeout(timeout);
    }
  }
};

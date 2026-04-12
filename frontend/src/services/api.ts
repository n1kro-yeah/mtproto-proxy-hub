import type { Proxy } from '../types/proxy';

const API_BASE = '/api';

export const proxyService = {
  async getProxies(): Promise<Omit<Proxy, 'status' | 'latency' | 'country' | 'city' | 'last_checked'>[]> {
    const response = await fetch(`${API_BASE}/proxies`);
    if (!response.ok) throw new Error('Failed to fetch proxies');
    const data = await response.json();
    return data.proxies;
  },

  async checkProxy(proxy: Omit<Proxy, 'status' | 'latency' | 'country' | 'city' | 'last_checked'>): Promise<Proxy> {
    const response = await fetch(`${API_BASE}/check-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proxy)
    });
    if (!response.ok) throw new Error('Failed to check proxy');
    return response.json();
  },

  async checkAllProxies(proxies: Omit<Proxy, 'status' | 'latency' | 'country' | 'city' | 'last_checked'>[]): Promise<Proxy[]> {
    const response = await fetch(`${API_BASE}/check-all-proxies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proxies })
    });
    if (!response.ok) throw new Error('Failed to check proxies');
    return response.json();
  }
};

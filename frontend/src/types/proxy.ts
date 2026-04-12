export interface Proxy {
  host: string;
  port: number;
  secret?: string;
  type: 'mtproto' | 'socks5';
  user?: string;
  pass?: string;
  status: 'checking' | 'online' | 'offline' | 'unchecked';
  latency: number | null;
  country: string | null;
  city: string | null;
  last_checked: number | null;
}

export const HARDCODED_PROXIES: Omit<Proxy, 'status' | 'latency' | 'country' | 'city' | 'last_checked'>[] = [
  {
    type: 'mtproto',
    host: '94.242.52.30',
    port: 443,
    secret: 'ee017d5acd82e12097ce431d84608fbd3431632e7275'
  },
  {
    type: 'mtproto',
    host: 'ffastdomain-eu.com',
    port: 443,
    secret: 'afdc38b8068b2444e50f6a4f093751b5'
  },
  {
    type: 'mtproto',
    host: '109.107.166.49',
    port: 443,
    secret: 'a4bc6821c58eee9b48038b104950504a'
  },
  {
    type: 'mtproto',
    host: '37.139.32.18',
    port: 443,
    secret: '9f3c7a8d2e4b1c6f5a7d8e9b0c2f4a1d'
  },
  {
    type: 'mtproto',
    host: '109.120.190.5',
    port: 443,
    secret: '9f3c7a8d2e4b1c6f5a7d8e9b0c2f4a1d'
  },
  {
    type: 'mtproto',
    host: '37.139.34.153',
    port: 443,
    secret: '9f3c7a8d2e4b1c6f5a7d8e9b0c2f4a1d'
  },
  {
    type: 'mtproto',
    host: 'qq.aezailoveyou.ru',
    port: 443,
    secret: '9f3c7a8d2e4b1c6f5a7d8e9b0c2f4a1d'
  }
];

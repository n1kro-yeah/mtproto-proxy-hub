import { useState } from 'react';
import type { Proxy } from '../types/proxy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import PublicIcon from '@mui/icons-material/Public';

const COUNTRY_CODES: Record<string, string> = {
  'Afghanistan': 'af', 'Albania': 'al', 'Algeria': 'dz', 'Argentina': 'ar',
  'Armenia': 'am', 'Australia': 'au', 'Austria': 'at', 'Azerbaijan': 'az',
  'Bangladesh': 'bd', 'Belarus': 'by', 'Belgium': 'be', 'Bolivia': 'bo',
  'Brazil': 'br', 'Bulgaria': 'bg', 'Cambodia': 'kh', 'Canada': 'ca',
  'Chile': 'cl', 'China': 'cn', 'Colombia': 'co', 'Croatia': 'hr',
  'Czech Republic': 'cz', 'Czechia': 'cz', 'Denmark': 'dk', 'Ecuador': 'ec',
  'Egypt': 'eg', 'Estonia': 'ee', 'Ethiopia': 'et', 'Finland': 'fi',
  'France': 'fr', 'Georgia': 'ge', 'Germany': 'de', 'Ghana': 'gh',
  'Greece': 'gr', 'Hong Kong': 'hk', 'Hungary': 'hu', 'Iceland': 'is',
  'India': 'in', 'Indonesia': 'id', 'Iran': 'ir', 'Iraq': 'iq',
  'Ireland': 'ie', 'Israel': 'il', 'Italy': 'it', 'Japan': 'jp',
  'Jordan': 'jo', 'Kazakhstan': 'kz', 'Kenya': 'ke', 'Kuwait': 'kw',
  'Latvia': 'lv', 'Lebanon': 'lb', 'Lithuania': 'lt', 'Luxembourg': 'lu',
  'Malaysia': 'my', 'Mexico': 'mx', 'Moldova': 'md', 'Morocco': 'ma',
  'Myanmar': 'mm', 'Nepal': 'np', 'Netherlands': 'nl', 'New Zealand': 'nz',
  'Nigeria': 'ng', 'Norway': 'no', 'Pakistan': 'pk', 'Peru': 'pe',
  'Philippines': 'ph', 'Poland': 'pl', 'Portugal': 'pt', 'Qatar': 'qa',
  'Romania': 'ro', 'Russia': 'ru', 'Saudi Arabia': 'sa', 'Serbia': 'rs',
  'Singapore': 'sg', 'Slovakia': 'sk', 'Slovenia': 'si', 'South Africa': 'za',
  'South Korea': 'kr', 'Spain': 'es', 'Sri Lanka': 'lk', 'Sweden': 'se',
  'Switzerland': 'ch', 'Taiwan': 'tw', 'Thailand': 'th', 'Turkey': 'tr',
  'Turkiye': 'tr', 'UAE': 'ae', 'United Arab Emirates': 'ae',
  'Ukraine': 'ua', 'United Kingdom': 'gb', 'United States': 'us',
  'Uruguay': 'uy', 'Uzbekistan': 'uz', 'Venezuela': 've', 'Vietnam': 'vn',
};

function CountryFlag({ country }: { country: string | null }) {
  if (!country) return <PublicIcon fontSize="small" style={{ opacity: 0.5 }} />;
  const code = COUNTRY_CODES[country];
  if (!code) return <PublicIcon fontSize="small" style={{ opacity: 0.5 }} />;
  return (
    <span
      className={`fi fi-${code}`}
      style={{ borderRadius: '3px', width: '20px', height: '15px', display: 'inline-block', flexShrink: 0 }}
      title={country}
    />
  );
}

interface ProxyCardProps {
  proxy: Proxy;
  index: number;
  onCheck: (index: number) => void;
  onCopy: (proxy: Proxy) => void;
  viewMode?: 'card' | 'compact';
}

export function ProxyCard({ proxy, index, onCheck, onCopy, viewMode = 'card' }: ProxyCardProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatLatency = (latency: number | null) => {
    if (latency === null) return 'N/A';
    if (latency < 100) return `${latency.toFixed(0)}ms`;
    if (latency < 1000) return `${latency.toFixed(0)}ms`;
    return `${(latency / 1000).toFixed(1)}s`;
  };

  const getLatencyColor = (latency: number | null) => {
    if (latency === null) return 'gray';
    if (latency < 100) return 'excellent';
    if (latency < 300) return 'good';
    if (latency < 500) return 'fair';
    return 'poor';
  };

  const handleCopy = () => {
    onCopy(proxy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (viewMode === 'compact') {
    return (
      <div className={`proxy-card-compact ${proxy.status}`}>
        <div className="compact-type">
          <span className="proxy-type-badge-compact">
            {proxy.type === 'mtproto' ? 'MT' : 'S5'}
          </span>
        </div>
        
        <div className="compact-status">
          <span className={`status-indicator ${proxy.status}`}></span>
        </div>

        <div className="compact-host">
          <span className="value host">{proxy.host}:{proxy.port}</span>
        </div>

        <div className="compact-location">
          {proxy.country ? (
            <span className="value location"><CountryFlag country={proxy.country} /> {proxy.country}</span>
          ) : (
            <span className="value small">Unknown</span>
          )}
        </div>

        <div className="compact-latency">
          {proxy.latency !== null && proxy.status === 'online' ? (
            <span className={`value latency ${getLatencyColor(proxy.latency)}`}>
              {formatLatency(proxy.latency)}
            </span>
          ) : (
            <span className="value small">N/A</span>
          )}
        </div>

        <div className="compact-actions">
          <button
            onClick={() => onCheck(index)}
            disabled={proxy.status === 'checking'}
            className="btn-check-compact"
            title="Check proxy status"
          >
            {proxy.status === 'checking' ? (
              <span className="spinner-small"></span>
            ) : (
              <RefreshIcon fontSize="small" />
            )}
          </button>

          <button
            onClick={handleCopy}
            className={`btn-copy-compact ${copied ? 'copied' : ''}`}
            title="Copy Telegram link"
          >
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`proxy-card ${proxy.status}`}>
      <div className="proxy-header">
        <div className="proxy-type-badge">
          {proxy.type === 'mtproto' ? 'MTProto' : 'SOCKS5'}
        </div>
        <div className="proxy-status">
          <span className={`status-indicator ${proxy.status}`}></span>
          <span className="status-text">
            {proxy.status === 'online' ? 'Online' : proxy.status === 'offline' ? 'Offline' : proxy.status === 'checking' ? 'Checking' : 'N/A'}
          </span>
          {proxy.latency !== null && proxy.status === 'online' && (
            <span className={`latency-badge ${getLatencyColor(proxy.latency)}`}>
              {formatLatency(proxy.latency)}
            </span>
          )}
        </div>
      </div>

      <div className="proxy-info">
        <div className="info-row">
          <span className="label">Host</span>
          <span className="value host">{proxy.host}</span>
        </div>

        <div className="info-row">
          <span className="label">Port</span>
          <span className="value">{proxy.port}</span>
        </div>

        {proxy.type === 'mtproto' && proxy.secret && (
          <div className="info-row">
            <span className="label">Secret</span>
            <div className="secret-container">
              <span className={`value secret ${showSecret ? 'revealed' : 'hidden'}`}>
                {showSecret ? proxy.secret : '••••••••••••••••'}
              </span>
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="btn-toggle"
                title="Toggle secret visibility"
              >
                {showSecret ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </button>
            </div>
          </div>
        )}

        {proxy.type === 'socks5' && proxy.user && (
          <>
            <div className="info-row">
              <span className="label">User</span>
              <span className="value">{proxy.user}</span>
            </div>
            <div className="info-row">
              <span className="label">Pass</span>
              <div className="secret-container">
                <span className={`value secret ${showSecret ? 'revealed' : 'hidden'}`}>
                  {showSecret ? proxy.pass : '••••••••'}
                </span>
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="btn-toggle"
                  title="Toggle password visibility"
                >
                  {showSecret ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </button>
              </div>
            </div>
          </>
        )}

        <div className="info-row">
          <span className="label">Location</span>
          <span className="value location">
            {proxy.country && proxy.city
              ? <><CountryFlag country={proxy.country} /> {proxy.city}, {proxy.country}</>
              : proxy.country
              ? <><CountryFlag country={proxy.country} /> {proxy.country}</>
              : <><PublicIcon fontSize="small" style={{ opacity: 0.5 }} /> Unknown</>}
          </span>
        </div>
      </div>

      <div className="proxy-actions">
        <button
          onClick={() => onCheck(index)}
          disabled={proxy.status === 'checking'}
          className="btn-check"
          title="Check proxy status"
        >
          {proxy.status === 'checking' ? (
            <span className="spinner-small"></span>
          ) : (
            <RefreshIcon fontSize="small" />
          )}
          <span>Check</span>
        </button>

        <button
          onClick={handleCopy}
          className={`btn-copy ${copied ? 'copied' : ''}`}
          title="Copy Telegram link"
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProxyCard } from './components/ProxyCard';
import { SkeletonLoader } from './components/SkeletonLoader';
import { SortControl } from './components/SortControl';
import { PingTypeControl, type PingType } from './components/PingTypeControl';
import { ViewModeControl, type ViewMode } from './components/ViewModeControl';
import { AutoRefreshControl } from './components/AutoRefreshControl';
import { BackendLanguageControl, type BackendLanguage } from './components/BackendLanguageControl';
import { HideOfflineControl } from './components/HideOfflineControl';
import { proxyService } from './services/api';
import { HARDCODED_PROXIES, type Proxy } from './types/proxy';
import type { SortState, SortCriterion } from './types/sort';
import { sortProxies } from './utils/sorting';
import { type Language, getTranslation } from './locales/translations';
import './styles/App.css';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SyncIcon from '@mui/icons-material/Sync';
import HelpIcon from '@mui/icons-material/Help';
import MapIcon from '@mui/icons-material/Map';

function App() {
  const navigate = useNavigate();
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [loadedProxies, setLoadedProxies] = useState<Omit<Proxy, 'status' | 'latency' | 'country' | 'city' | 'last_checked'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAll, setCheckingAll] = useState(false);
  const [error, setError] = useState('');
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [checkDuration, setCheckDuration] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sortState, setSortState] = useState<SortState>({
    criterion: null,
    direction: 'asc'
  });
  const [pingType, setPingType] = useState<PingType>('tcp');
  const [viaProxyUrl, setViaProxyUrl] = useState('https://www.gstatic.com/generate_204');
  const [language, setLanguage] = useState<Language>('en');
  const [isRefreshTextChanging, setIsRefreshTextChanging] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number | null>(null); // null = disabled by default
  const [backendLanguage, setBackendLanguage] = useState<BackendLanguage>('python');
  const [hideOffline, setHideOffline] = useState(false);
  const prevCheckingAllRef = useRef(checkingAll);
  const autoRefreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate refresh button text change
  useEffect(() => {
    if (prevCheckingAllRef.current !== checkingAll) {
      setIsRefreshTextChanging(true);
      setTimeout(() => {
        setIsRefreshTextChanging(false);
      }, 300);
    }
    prevCheckingAllRef.current = checkingAll;
  }, [checkingAll]);

  // Auto-refresh functionality
  useEffect(() => {
    // Clear existing timer
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
      autoRefreshTimerRef.current = null;
    }

    // Set up new timer if interval is set
    if (autoRefreshInterval !== null && autoRefreshInterval > 0) {
      const intervalMs = autoRefreshInterval * 60 * 1000; // Convert minutes to milliseconds
      
      autoRefreshTimerRef.current = setInterval(() => {
        console.log(`Auto-refresh triggered (every ${autoRefreshInterval} minutes)`);
        checkAllProxies();
      }, intervalMs);

      console.log(`Auto-refresh enabled: every ${autoRefreshInterval} minutes`);
    } else {
      console.log('Auto-refresh disabled');
    }

    // Cleanup on unmount or when interval changes
    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
    };
  }, [autoRefreshInterval]); // Only depend on interval, not on checkAllProxies

  useEffect(() => {
    initializeProxies();

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-version');
    }

    // Check for saved ping type preference
    const savedPingType = localStorage.getItem('pingType') as PingType;
    if (savedPingType === 'tcp' || savedPingType === 'icmp' || savedPingType === 'via-proxy') {
      setPingType(savedPingType);
    }

    // Check for saved via proxy URL
    const savedViaProxyUrl = localStorage.getItem('viaProxyUrl');
    if (savedViaProxyUrl) {
      setViaProxyUrl(savedViaProxyUrl);
    }

    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'en' || savedLanguage === 'ru') {
      setLanguage(savedLanguage);
    }

    // Check for saved view mode
    const savedViewMode = localStorage.getItem('viewMode') as ViewMode;
    if (savedViewMode === 'card' || savedViewMode === 'compact') {
      setViewMode(savedViewMode);
    }

    // Check for saved auto-refresh interval
    const savedInterval = localStorage.getItem('autoRefreshInterval');
    if (savedInterval) {
      const interval = savedInterval === 'null' ? null : parseInt(savedInterval);
      setAutoRefreshInterval(interval);
    }

    // Check for saved backend language
    const savedBackendLanguage = localStorage.getItem('backendLanguage') as BackendLanguage;
    if (savedBackendLanguage === 'python' || savedBackendLanguage === 'csharp' || savedBackendLanguage === 'cpp') {
      setBackendLanguage(savedBackendLanguage);
    }

    // Check for saved hide offline preference
    const savedHideOffline = localStorage.getItem('hideOffline');
    if (savedHideOffline === 'true') {
      setHideOffline(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-version');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-version');
      localStorage.setItem('theme', 'light');
    }
  };

  const initializeProxies = async () => {
    try {
      // Check if we have cached proxies in sessionStorage
      const cached = sessionStorage.getItem('cachedProxies');
      const cachedLoaded = sessionStorage.getItem('cachedLoadedProxies');
      if (cached && cachedLoaded) {
        setProxies(JSON.parse(cached));
        setLoadedProxies(JSON.parse(cachedLoaded));
        setLoading(false);
        return;
      }

      console.log('Loading proxies from backend...');
      const fetchedProxies = await proxyService.getProxies();
      console.log(`Received ${fetchedProxies.length} proxies from backend`);
      
      const combinedProxies = [...HARDCODED_PROXIES, ...fetchedProxies];
      console.log(`Total proxies (hardcoded + GitHub): ${combinedProxies.length}`);
      
      const initialProxies: Proxy[] = combinedProxies.map(p => ({
        ...p,
        status: 'unchecked' as const,
        latency: null,
        country: null,
        city: null,
        last_checked: null
      }));

      setLoadedProxies(combinedProxies);
      setProxies(initialProxies);
      sessionStorage.setItem('cachedProxies', JSON.stringify(initialProxies));
      sessionStorage.setItem('cachedLoadedProxies', JSON.stringify(combinedProxies));
      setLoading(false);
    } catch (err) {
      console.error('Failed to load proxies from backend, using only hardcoded:', err);
      
      const initialProxies: Proxy[] = HARDCODED_PROXIES.map(p => ({
        ...p,
        status: 'unchecked' as const,
        latency: null,
        country: null,
        city: null,
        last_checked: null
      }));

      setLoadedProxies(HARDCODED_PROXIES);
      setProxies(initialProxies);
      sessionStorage.setItem('cachedProxies', JSON.stringify(initialProxies));
      sessionStorage.setItem('cachedLoadedProxies', JSON.stringify(HARDCODED_PROXIES));
      setLoading(false);
    }
  };

  const checkAllProxies = async () => {
    const startTime = Date.now();
    try {
      setCheckingAll(true);
      setError('');

      // Set all proxies to checking status
      setProxies(prev => prev.map(p => ({ ...p, status: 'checking' as const })));

      const results = await proxyService.checkAllProxies(
        loadedProxies, 
        pingType,
        pingType === 'via-proxy' ? viaProxyUrl : undefined
      );
      setProxies(results);
      sessionStorage.setItem('cachedProxies', JSON.stringify(results));
      setLastCheckTime(new Date());
      setCheckDuration((Date.now() - startTime) / 1000); // Convert to seconds
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setError('Check timed out after 45 seconds');
      } else {
        setError('Failed to check proxies');
      }
      console.error(err);
      // Reset all proxies to unchecked on error
      setProxies(prev => prev.map(p => 
        p.status === 'checking' ? { ...p, status: 'unchecked' as const } : p
      ));
    } finally {
      setCheckingAll(false);
    }
  };

  const handleCheckSingle = async (index: number) => {
    try {
      setError('');
      const proxyToCheck = loadedProxies[index];

      setProxies(prev => prev.map((p, i) =>
        i === index ? { ...p, status: 'checking' as const } : p
      ));

      const result = await proxyService.checkProxy(
        proxyToCheck, 
        pingType,
        pingType === 'via-proxy' ? viaProxyUrl : undefined
      );

      setProxies(prev => {
        const updated = prev.map((p, i) => i === index ? result : p);
        sessionStorage.setItem('cachedProxies', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setError('Failed to check proxy');
      setProxies(prev => prev.map((p, i) =>
        i === index ? { ...p, status: 'offline' as const } : p
      ));
    }
  };

  const copyToClipboard = async (proxy: Proxy) => {
    try {
      let link = '';
      if (proxy.type === 'mtproto') {
        link = `tg://proxy?server=${proxy.host}&port=${proxy.port}&secret=${proxy.secret}`;
      } else {
        link = `tg://socks?server=${proxy.host}&port=${proxy.port}${proxy.user ? `&user=${proxy.user}&pass=${proxy.pass}` : ''}`;
      }
      await navigator.clipboard.writeText(link);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers or when clipboard API is not available
      const textArea = document.createElement('textarea');
      textArea.value = proxy.type === 'mtproto' 
        ? `tg://proxy?server=${proxy.host}&port=${proxy.port}&secret=${proxy.secret}`
        : `tg://socks?server=${proxy.host}&port=${proxy.port}${proxy.user ? `&user=${proxy.user}&pass=${proxy.pass}` : ''}`;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSort = (criterion: Exclude<SortCriterion, null>) => {
    setSortState(prev => ({
      criterion,
      direction: prev.criterion === criterion && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleResetSort = () => {
    setSortState({ criterion: null, direction: 'asc' });
  };

  const handlePingTypeChange = (type: PingType) => {
    setPingType(type);
    localStorage.setItem('pingType', type);
    console.log(`Ping type changed to: ${type}`);
  };

  const handleViaProxyUrlChange = (url: string) => {
    setViaProxyUrl(url);
    localStorage.setItem('viaProxyUrl', url);
    console.log(`Via Proxy URL changed to: ${url}`);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  const handleAutoRefreshChange = (interval: number | null) => {
    setAutoRefreshInterval(interval);
    localStorage.setItem('autoRefreshInterval', interval === null ? 'null' : interval.toString());
  };

  const handleBackendLanguageChange = (lang: BackendLanguage) => {
    setBackendLanguage(lang);
    localStorage.setItem('backendLanguage', lang);
  };

  const handleHideOfflineToggle = (hide: boolean) => {
    setHideOffline(hide);
    localStorage.setItem('hideOffline', hide.toString());
  };

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const sortedProxies = useMemo(() => {
    return sortProxies(proxies, sortState);
  }, [proxies, sortState]);

  const filteredProxies = useMemo(() => {
    if (hideOffline) {
      return sortedProxies.filter(p => p.status !== 'offline');
    }
    return sortedProxies;
  }, [sortedProxies, hideOffline]);

  const onlineCount = proxies.filter(p => p.status === 'online').length;
  const offlineCount = proxies.filter(p => p.status === 'offline').length;
  const checkingCount = proxies.filter(p => p.status === 'checking').length;
  const uncheckedCount = proxies.filter(p => p.status === 'unchecked').length;

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>MTProto Proxy Hub</h1>
          <p>Monitor your Telegram proxy connections</p>
          <button onClick={toggleDarkMode} className="theme-toggle" title="Toggle theme (Beta)">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            <span className="beta-badge">BETA</span>
          </button>
        </header>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
        <BackendLanguageControl 
          language={backendLanguage}
          onLanguageChange={handleBackendLanguageChange}
        />
        <button onClick={() => navigate('/map', { state: { proxies }, replace: true })} className="map-toggle" title="Карта прокси">
          <MapIcon />
        </button>
        <button onClick={() => navigate('/about')} className="info-toggle" title="О проекте">
          <InfoIcon />
        </button>
        <button onClick={toggleDarkMode} className="theme-toggle" title={t('toggleTheme')}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          <span className="beta-badge">BETA</span>
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="container">
        <div className="stats-section">
          <div className="stat-card online">
            <div className="stat-icon"><CheckCircleIcon /></div>
            <div className="stat-content">
              <div className="stat-value">{onlineCount}</div>
              <div className="stat-label">{t('online')}</div>
            </div>
          </div>

          <div className="stat-card offline">
            <div className="stat-icon"><CancelIcon /></div>
            <div className="stat-content">
              <div className="stat-value">{offlineCount}</div>
              <div className="stat-label">{t('offline')}</div>
            </div>
          </div>

          <div className={`stat-card checking ${checkingCount > 0 ? 'active' : ''}`}>
            <div className="stat-icon"><SyncIcon /></div>
            <div className="stat-content">
              <div className="stat-value">{checkingCount}</div>
              <div className="stat-label">{t('checking')}</div>
            </div>
          </div>

          <div className="stat-card unchecked">
            <div className="stat-icon"><HelpIcon /></div>
            <div className="stat-content">
              <div className="stat-value">{uncheckedCount}</div>
              <div className="stat-label">{t('unchecked')}</div>
            </div>
          </div>
        </div>

        <div className="proxies-section">
          <div className="section-header">
            <div className="header-left">
              <h2>{t('proxyList')}</h2>
              {lastCheckTime && (
                <span className="last-check">
                  {t('lastChecked')}: {lastCheckTime.toLocaleTimeString()}
                  {checkDuration !== null && (
                    <span className="check-duration"> ({checkDuration.toFixed(2)}s)</span>
                  )}
                </span>
              )}
            </div>
            <div className="header-right">
              <HideOfflineControl 
                hideOffline={hideOffline}
                onToggle={handleHideOfflineToggle}
              />
              <ViewModeControl 
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
              <AutoRefreshControl 
                interval={autoRefreshInterval}
                onIntervalChange={handleAutoRefreshChange}
              />
              <PingTypeControl 
                pingType={pingType}
                onPingTypeChange={handlePingTypeChange}
                viaProxyUrl={viaProxyUrl}
                onViaProxyUrlChange={handleViaProxyUrlChange}
              />
              <SortControl 
                sortState={sortState}
                onSort={handleSort}
                onReset={handleResetSort}
              />
              <button
                onClick={checkAllProxies}
                disabled={checkingAll}
                className="btn-check-all"
              >
                {checkingAll ? (
                  <>
                    <span className="spinner"></span>
                    <span className={isRefreshTextChanging ? 'text-changing' : ''}>{t('checkingAll')}</span>
                  </>
                ) : (
                  <>
                    <RefreshIcon />
                    <span className={isRefreshTextChanging ? 'text-changing' : ''}>{t('refreshAll')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className={`proxies-grid ${viewMode === 'compact' ? 'compact-view' : ''}`}>
            {filteredProxies.map((proxy, idx) => (
              <motion.div
                key={`${proxy.host}-${proxy.port}-${proxy.secret}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  layout: { duration: 0.3, ease: "easeInOut" },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 }
                }}
              >
                <ProxyCard
                  proxy={proxy}
                  index={idx}
                  onCheck={handleCheckSingle}
                  onCopy={copyToClipboard}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

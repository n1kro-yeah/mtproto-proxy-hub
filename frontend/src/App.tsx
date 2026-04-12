import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProxyCard } from './components/ProxyCard';
import { SkeletonLoader } from './components/SkeletonLoader';
import { SortControl } from './components/SortControl';
import { proxyService } from './services/api';
import { HARDCODED_PROXIES, type Proxy } from './types/proxy';
import type { SortState, SortCriterion } from './types/sort';
import { sortProxies } from './utils/sorting';
import './styles/App.css';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SyncIcon from '@mui/icons-material/Sync';
import HelpIcon from '@mui/icons-material/Help';

function App() {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [loadedProxies, setLoadedProxies] = useState<Omit<Proxy, 'status' | 'latency' | 'country' | 'city' | 'last_checked'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAll, setCheckingAll] = useState(false);
  const [error, setError] = useState('');
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sortState, setSortState] = useState<SortState>({
    criterion: null,
    direction: 'asc'
  });

  useEffect(() => {
    initializeProxies();

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-version');
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
      // Load proxies from backend
      const fetchedProxies = await proxyService.getProxies();
      
      // Combine hardcoded proxies with fetched proxies from GitHub
      const combinedProxies = [...HARDCODED_PROXIES, ...fetchedProxies];
      
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
      setLoading(false);
    } catch (err) {
      console.error('Failed to load proxies from backend, using only hardcoded:', err);
      
      // Fallback to only hardcoded proxies if backend fails
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
      setLoading(false);
    }
  };

  const checkAllProxies = async () => {
    try {
      setCheckingAll(true);
      setError('');

      // Set all proxies to checking status
      setProxies(prev => prev.map(p => ({ ...p, status: 'checking' as const })));

      const results = await proxyService.checkAllProxies(loadedProxies);
      setProxies(results);
      setLastCheckTime(new Date());
    } catch (err) {
      setError('Failed to check proxies');
      console.error(err);
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

      const result = await proxyService.checkProxy(proxyToCheck);

      setProxies(prev => prev.map((p, i) =>
        i === index ? result : p
      ));
    } catch (err) {
      setError('Failed to check proxy');
      setProxies(prev => prev.map((p, i) =>
        i === index ? { ...p, status: 'offline' as const } : p
      ));
    }
  };

  const copyToClipboard = (proxy: Proxy) => {
    let link = '';
    if (proxy.type === 'mtproto') {
      link = `tg://proxy?server=${proxy.host}&port=${proxy.port}&secret=${proxy.secret}`;
    } else {
      link = `tg://socks?server=${proxy.host}&port=${proxy.port}${proxy.user ? `&user=${proxy.user}&pass=${proxy.pass}` : ''}`;
    }
    navigator.clipboard.writeText(link);
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

  const sortedProxies = useMemo(() => {
    return sortProxies(proxies, sortState);
  }, [proxies, sortState]);

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
        <h1>MTProto Proxy Hub</h1>
        <p>Monitor your Telegram proxy connections</p>
        <button onClick={toggleDarkMode} className="theme-toggle" title="Toggle theme (Beta)">
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
              <div className="stat-label">Online</div>
            </div>
          </div>

          <div className="stat-card offline">
            <div className="stat-icon"><CancelIcon /></div>
            <div className="stat-content">
              <div className="stat-value">{offlineCount}</div>
              <div className="stat-label">Offline</div>
            </div>
          </div>

          <div className={`stat-card checking ${checkingCount > 0 ? 'active' : ''}`}>
            <div className="stat-icon"><SyncIcon /></div>
            <div className="stat-content">
              <div className="stat-value">{checkingCount}</div>
              <div className="stat-label">Checking</div>
            </div>
          </div>

          <div className="stat-card unchecked">
            <div className="stat-icon"><HelpIcon /></div>
            <div className="stat-content">
              <div className="stat-value">{uncheckedCount}</div>
              <div className="stat-label">Unchecked</div>
            </div>
          </div>
        </div>

        <div className="proxies-section">
          <div className="section-header">
            <div className="header-left">
              <h2>Proxy List</h2>
              {lastCheckTime && (
                <span className="last-check">
                  Last checked: {lastCheckTime.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="header-right">
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
                    Checking All...
                  </>
                ) : (
                  <>
                    <RefreshIcon />
                    Refresh All
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="proxies-grid">
            {sortedProxies.map((proxy, idx) => (
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

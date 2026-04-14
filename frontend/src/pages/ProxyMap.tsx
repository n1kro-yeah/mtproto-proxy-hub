import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Proxy } from '../types/proxy';
import {
  aggregateByCountry,
  aggregateByCities,
  loadWorldMap,
  loadCityCoordinates,
  DEFAULT_COLOR_SCALE,
} from '../utils/mapData';
import { MapCanvas } from '../components/MapCanvas';
import { MapControls } from '../components/MapControls';
import { MapLegend } from '../components/MapLegend';
import { CountryTooltip } from '../components/CountryTooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../styles/ProxyMap.css';

/**
 * ProxyMap page component
 * 
 * Main page component that orchestrates the map visualization.
 * Receives proxy data via route state and displays an interactive map.
 */
export const ProxyMap: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get proxies from route state
  const proxies: Proxy[] = location.state?.proxies || [];
  
  // Map view state
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Geographic data state
  const [worldTopology, setWorldTopology] = useState<any>(null);
  const [cityCoordinatesMap, setCityCoordinatesMap] = useState<Map<string, [number, number]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Zoom limits
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 8;
  
  // Load geographic data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [topology, coordinates] = await Promise.all([
          loadWorldMap(),
          loadCityCoordinates(),
        ]);
        
        setWorldTopology(topology);
        setCityCoordinatesMap(coordinates);
      } catch (err) {
        console.error('Failed to load geographic data:', err);
        setError('Failed to load map data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Aggregate country stats
  const countryStats = useMemo(() => {
    return aggregateByCountry(proxies);
  }, [proxies]);
  
  // Aggregate city markers
  const cityMarkers = useMemo(() => {
    return aggregateByCities(proxies, cityCoordinatesMap);
  }, [proxies, cityCoordinatesMap]);
  
  // Get hovered country stats
  const hoveredCountryStats = useMemo(() => {
    if (!hoveredCountry) return null;
    return countryStats.find(s => s.countryCode === hoveredCountry) || null;
  }, [hoveredCountry, countryStats]);
  
  // Zoom handlers
  const handleZoomIn = () => {
    setZoom(z => Math.min(z + 1, MAX_ZOOM));
  };
  
  const handleZoomOut = () => {
    setZoom(z => Math.max(z - 1, MIN_ZOOM));
  };
  
  const handleResetView = () => {
    setZoom(1);
    setCenter([0, 20]);
  };
  
  const handleBack = () => {
    navigate('/', { replace: true });
  };
  
  // Empty state
  if (proxies.length === 0) {
    return (
      <div className="proxy-map-page">
        <div className="empty-state">
          <h2>No proxy data available</h2>
          <p>Please return to the main page and check proxies first.</p>
          <button onClick={handleBack} className="btn-back">
            <ArrowBackIcon />
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="proxy-map-page">
        <div className="loading-state">
          <h2>Loading map data...</h2>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="proxy-map-page">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-retry">
            Retry
          </button>
          <button onClick={handleBack} className="btn-back">
            <ArrowBackIcon />
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="proxy-map-page">
      <header className="map-header">
        <button onClick={handleBack} className="btn-back">
          <ArrowBackIcon />
          Back
        </button>
        <h1>Proxy Map</h1>
        <div className="map-stats">
          <span>{countryStats.length} countries</span>
          <span>{cityMarkers.length} cities</span>
          <span>{proxies.length} proxies</span>
        </div>
      </header>
      
      <div className="map-container">
        <MapCanvas
          countryStats={countryStats}
          cityMarkers={cityMarkers}
          zoom={zoom}
          center={center}
          onCountryHover={setHoveredCountry}
          hoveredCountry={hoveredCountry}
          worldTopology={worldTopology}
        />
        
        <MapControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
        />
        
        <MapLegend colorScale={DEFAULT_COLOR_SCALE} />
        
        <CountryTooltip
          country={hoveredCountryStats}
          position={mousePosition}
        />
      </div>
    </div>
  );
};

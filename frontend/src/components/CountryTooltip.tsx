import React, { useState, useEffect } from 'react';
import { CountryStats } from '../types/map';

interface CountryTooltipProps {
  country: CountryStats | null;
  position: { x: number; y: number };
}

/**
 * CountryTooltip displays proxy statistics when hovering over a country
 * 
 * Displays:
 * - Country name with flag icon (using flag-icons library)
 * - Total proxy count
 * - Online/offline/unchecked breakdown
 * - Average latency (or "N/A" if null)
 * 
 * Features:
 * - Fade-in animation on appear
 * - Fade-out animation on disappear
 */
export const CountryTooltip: React.FC<CountryTooltipProps> = ({ country, position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [displayCountry, setDisplayCountry] = useState<CountryStats | null>(country);

  useEffect(() => {
    if (country) {
      // Show tooltip
      setDisplayCountry(country);
      setIsClosing(false);
      setIsVisible(true);
    } else {
      // Hide tooltip with animation
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
        setDisplayCountry(null);
      }, 200); // Match animation duration
    }
  }, [country]);

  if (!isVisible || !displayCountry) {
    return null;
  }

  return (
    <div
      className={`country-tooltip ${isClosing ? 'closing' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x + 15}px`,
        top: `${position.y + 15}px`,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <div className="tooltip-header">
        <span 
          className={`fi fi-${displayCountry.countryCode.toLowerCase()}`}
          style={{ 
            borderRadius: '3px', 
            width: '24px', 
            height: '18px', 
            display: 'inline-block',
            flexShrink: 0 
          }}
        />
        <span className="country-name">{displayCountry.countryName}</span>
      </div>
      
      <div className="tooltip-content">
        <div className="stat-row">
          <span className="label">Total Proxies:</span>
          <span className="value">{displayCountry.totalProxies}</span>
        </div>
        
        <div className="stat-row">
          <span className="label">Online:</span>
          <span className="value online">{displayCountry.onlineProxies}</span>
        </div>
        
        <div className="stat-row">
          <span className="label">Offline:</span>
          <span className="value offline">{displayCountry.offlineProxies}</span>
        </div>
        
        <div className="stat-row">
          <span className="label">Unchecked:</span>
          <span className="value unchecked">{displayCountry.uncheckedProxies}</span>
        </div>
        
        <div className="stat-row">
          <span className="label">Avg Latency:</span>
          <span className="value">
            {displayCountry.avgLatency !== null ? `${displayCountry.avgLatency.toFixed(0)}ms` : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

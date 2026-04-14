import React from 'react';
import { ColorScale } from '../types/map';

interface MapLegendProps {
  colorScale: ColorScale;
}

/**
 * MapLegend explains the color coding used on the map
 * 
 * Displays:
 * - Color gradient legend with proxy count ranges
 * - Status indicators (online/offline)
 */
export const MapLegend: React.FC<MapLegendProps> = ({ colorScale }) => {
  const { domain, range } = colorScale;

  // Create legend items from domain and range
  const legendItems = domain.map((threshold, index) => {
    const nextThreshold = domain[index + 1];
    const label = nextThreshold
      ? `${threshold}-${nextThreshold - 1}`
      : `${threshold}+`;
    
    return {
      color: range[index],
      label: threshold === 0 ? '0' : label,
    };
  });

  return (
    <div className="map-legend">
      <h3>Proxy Count</h3>
      <div className="legend-items">
        {legendItems.map((item, index) => (
          <div key={index} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="legend-divider" />
      
      <h3>Status</h3>
      <div className="legend-items">
        <div className="legend-item">
          <div className="legend-indicator online" />
          <span className="legend-label">Online</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator offline" />
          <span className="legend-label">Offline</span>
        </div>
      </div>
    </div>
  );
};

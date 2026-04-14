import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { CountryStats, CityMarker } from '../types/map';
import { getCountryColor, getCountryCodeFromNumericId } from '../utils/mapData';

interface MapCanvasProps {
  countryStats: CountryStats[];
  cityMarkers: CityMarker[];
  zoom: number;
  center: [number, number];
  onCountryHover: (countryCode: string | null) => void;
  hoveredCountry: string | null;
  worldTopology: any;
}

/**
 * MapCanvas renders the interactive SVG map using react-simple-maps
 * 
 * Features:
 * - Renders world map from TopoJSON data
 * - Applies color coding based on proxy count per country
 * - Renders city markers as circles
 * - Handles mouse events (hover, click) on countries
 * - Applies zoom and pan transformations
 */
export const MapCanvas: React.FC<MapCanvasProps> = ({
  countryStats,
  cityMarkers,
  zoom,
  center,
  onCountryHover,
  hoveredCountry,
  worldTopology,
}) => {
  // Create a map for quick country stats lookup
  const statsMap = new Map<string, CountryStats>();
  countryStats.forEach(stats => {
    statsMap.set(stats.countryCode, stats);
  });

  return (
    <div className="map-canvas">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
        }}
        width={800}
        height={450}
      >
        <ZoomableGroup zoom={zoom} center={center}>
          {worldTopology && (
            <Geographies geography={worldTopology}>
              {({ geographies }) =>
                geographies.map((geo: any) => {
                  const rawId = geo.id;
                  const isNumeric = /^\d+$/.test(String(rawId));
                  const countryCode = isNumeric
                    ? getCountryCodeFromNumericId(String(rawId))
                    : (rawId || geo.properties?.ISO_A2 || 'XX');
                  const stats = statsMap.get(countryCode);
                  const proxyCount = stats ? stats.totalProxies : 0;
                  const fillColor = getCountryColor(proxyCount);
                  const isHovered = hoveredCountry === countryCode;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHovered ? '#14b8a6' : fillColor}
                      stroke="#fff"
                      strokeWidth={0.5}
                      onMouseEnter={() => {
                        if (stats) {
                          onCountryHover(countryCode);
                        }
                      }}
                      onMouseLeave={() => {
                        onCountryHover(null);
                      }}
                      style={{
                        default: {
                          outline: 'none',
                        },
                        hover: {
                          fill: '#14b8a6',
                          outline: 'none',
                          cursor: stats ? 'pointer' : 'default',
                        },
                        pressed: {
                          fill: '#0d9488',
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}

          {cityMarkers.map((marker) => {
            const markerSize = Math.sqrt(marker.proxyCount) * 2;
            
            return (
              <Marker
                key={`${marker.city}-${marker.countryCode}`}
                coordinates={marker.coordinates}
              >
                <circle
                  r={markerSize}
                  fill="#14b8a6"
                  fillOpacity={0.6}
                  stroke="#fff"
                  strokeWidth={1}
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

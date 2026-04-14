import { Proxy } from './proxy';

/**
 * Aggregated proxy statistics for a single country
 */
export interface CountryStats {
  countryCode: string;      // ISO 3166-1 alpha-2 (e.g., "US", "RU")
  countryName: string;      // Full country name
  totalProxies: number;     // Total proxy count
  onlineProxies: number;    // Online proxy count
  offlineProxies: number;   // Offline proxy count
  uncheckedProxies: number; // Unchecked proxy count
  avgLatency: number | null; // Average latency in ms (null if no online proxies)
  proxies: Proxy[];         // Array of proxies in this country
}

/**
 * Geographic marker representing proxies in a specific city
 */
export interface CityMarker {
  city: string;             // City name
  countryCode: string;      // ISO 3166-1 alpha-2
  coordinates: [number, number]; // [longitude, latitude]
  proxyCount: number;       // Number of proxies in this city
  onlineCount: number;      // Online proxies in this city
  offlineCount: number;     // Offline proxies in this city
}

/**
 * Color scale mapping from proxy counts to visual colors
 */
export interface ColorScale {
  domain: number[];         // Proxy count thresholds [0, 1, 5, 10, 20]
  range: string[];          // Colors from light to dark teal
}

/**
 * Map view state for zoom and pan
 */
export interface MapViewState {
  zoom: number;             // Current zoom level (1-8)
  center: [number, number]; // Map center [longitude, latitude]
}

/**
 * Type guard to validate CountryStats
 */
export function isValidCountryStats(stats: CountryStats): boolean {
  return (
    stats.countryCode.length === 2 &&
    stats.totalProxies === stats.onlineProxies + stats.offlineProxies + stats.uncheckedProxies &&
    stats.totalProxies >= 0 &&
    stats.onlineProxies >= 0 &&
    stats.offlineProxies >= 0 &&
    stats.uncheckedProxies >= 0 &&
    stats.proxies.length > 0
  );
}

/**
 * Type guard to validate CityMarker
 */
export function isValidCityMarker(marker: CityMarker): boolean {
  const [lon, lat] = marker.coordinates;
  return (
    lon >= -180 && lon <= 180 &&
    lat >= -90 && lat <= 90 &&
    marker.proxyCount > 0 &&
    marker.proxyCount >= marker.onlineCount + marker.offlineCount &&
    marker.onlineCount >= 0 &&
    marker.offlineCount >= 0
  );
}

/**
 * Type guard to validate ColorScale
 */
export function isValidColorScale(scale: ColorScale): boolean {
  if (scale.domain.length !== scale.range.length) return false;
  
  // Check domain is sorted ascending
  for (let i = 1; i < scale.domain.length; i++) {
    if (scale.domain[i] < scale.domain[i - 1]) return false;
  }
  
  // Check all colors are valid hex codes
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  return scale.range.every(color => hexPattern.test(color));
}

/**
 * Type guard to validate MapViewState
 */
export function isValidMapViewState(state: MapViewState, minZoom: number = 1, maxZoom: number = 8): boolean {
  const [lon, lat] = state.center;
  return (
    state.zoom >= minZoom &&
    state.zoom <= maxZoom &&
    lon >= -180 && lon <= 180 &&
    lat >= -90 && lat <= 90
  );
}

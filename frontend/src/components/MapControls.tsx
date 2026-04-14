import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HomeIcon from '@mui/icons-material/Home';

interface MapControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  minZoom: number;
  maxZoom: number;
}

/**
 * MapControls provides zoom and pan controls for the map
 * 
 * Features:
 * - Zoom in/out buttons
 * - Reset view button
 * - Buttons disabled at zoom limits
 */
export const MapControls: React.FC<MapControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  minZoom,
  maxZoom,
}) => {
  return (
    <div className="map-controls">
      <button
        className="map-control-btn"
        onClick={onZoomIn}
        disabled={zoom >= maxZoom}
        title="Zoom In"
        aria-label="Zoom In"
      >
        <AddIcon />
      </button>
      
      <button
        className="map-control-btn"
        onClick={onZoomOut}
        disabled={zoom <= minZoom}
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <RemoveIcon />
      </button>
      
      <button
        className="map-control-btn"
        onClick={onResetView}
        title="Reset View"
        aria-label="Reset View"
      >
        <HomeIcon />
      </button>
    </div>
  );
};

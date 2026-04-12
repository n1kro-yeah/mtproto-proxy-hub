import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';

export type ViewMode = 'card' | 'compact';

interface ViewModeControlProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeControl({ viewMode, onViewModeChange }: ViewModeControlProps) {
  return (
    <div className="view-mode-control">
      <button
        onClick={() => onViewModeChange('card')}
        className={`view-mode-btn ${viewMode === 'card' ? 'active' : ''}`}
        title="Card View (Beta)"
      >
        <ViewModuleIcon />
      </button>
      <button
        onClick={() => onViewModeChange('compact')}
        className={`view-mode-btn ${viewMode === 'compact' ? 'active' : ''}`}
        title="Compact View (Beta)"
      >
        <ViewListIcon />
      </button>
      <span className="beta-badge-control">BETA</span>
    </div>
  );
}

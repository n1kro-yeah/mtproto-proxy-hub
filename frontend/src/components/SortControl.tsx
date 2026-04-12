import { useState, useRef, useEffect } from 'react';
import type { SortState, SortCriterion } from '../types/sort';
import SpeedIcon from '@mui/icons-material/Speed';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CategoryIcon from '@mui/icons-material/Category';
import PublicIcon from '@mui/icons-material/Public';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SortIcon from '@mui/icons-material/Sort';

interface SortControlProps {
  sortState: SortState;
  onSort: (criterion: Exclude<SortCriterion, null>) => void;
  onReset: () => void;
}

export function SortControl({ sortState, onSort, onReset }: SortControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const sortButtons: Array<{
    criterion: Exclude<SortCriterion, null>;
    icon: React.ReactNode;
    label: string;
  }> = [
    { criterion: 'latency', icon: <SpeedIcon />, label: 'Ping' },
    { criterion: 'status', icon: <SignalCellularAltIcon />, label: 'Status' },
    { criterion: 'type', icon: <CategoryIcon />, label: 'Type' },
    { criterion: 'country', icon: <PublicIcon />, label: 'Country' }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setShouldRender(false);
      setIsClosing(false);
    }, 250); // Match animation duration
  };

  const openMenu = () => {
    setShouldRender(true);
    // Small delay to ensure DOM is ready before animation
    setTimeout(() => {
      setIsOpen(true);
    }, 10);
  };

  const toggleMenu = () => {
    if (isOpen || isClosing) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleSortClick = (criterion: Exclude<SortCriterion, null>) => {
    onSort(criterion);
    // Keep menu open to allow multiple sorts
  };

  const handleResetClick = () => {
    onReset();
    closeMenu();
  };

  const getActiveSortLabel = () => {
    if (!sortState.criterion) return 'Sort';
    const activeButton = sortButtons.find(btn => btn.criterion === sortState.criterion);
    return activeButton ? activeButton.label : 'Sort';
  };

  return (
    <div className="sort-control-wrapper" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className={`sort-toggle-btn ${sortState.criterion ? 'active' : ''}`}
        title="Sort options"
      >
        <SortIcon />
        <span>{getActiveSortLabel()}</span>
        {sortState.criterion && (
          <span className="direction-icon">
            {sortState.direction === 'desc' ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
          </span>
        )}
      </button>

      {shouldRender && (
        <div className={`sort-menu ${isOpen && !isClosing ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
          <div className="sort-menu-header">
            <span>Sort by</span>
          </div>
          
          {sortButtons.map(({ criterion, icon, label }, index) => {
            const isActive = sortState.criterion === criterion;
            const isDesc = isActive && sortState.direction === 'desc';

            return (
              <button
                key={criterion}
                onClick={() => handleSortClick(criterion)}
                className={`sort-menu-item ${isActive ? 'active' : ''}`}
                style={{ animationDelay: isClosing ? '0s' : `${index * 0.05}s` }}
              >
                <span className="sort-menu-icon">{icon}</span>
                <span className="sort-menu-label">{label}</span>
                {isActive && (
                  <span className={`sort-menu-direction ${isDesc ? 'desc' : 'asc'}`}>
                    {isDesc ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
                  </span>
                )}
              </button>
            );
          })}

          <div className="sort-menu-divider"></div>

          <button
            onClick={handleResetClick}
            className="sort-menu-item reset"
          >
            <span className="sort-menu-icon"><RestartAltIcon /></span>
            <span className="sort-menu-label">Reset</span>
          </button>
        </div>
      )}
    </div>
  );
}

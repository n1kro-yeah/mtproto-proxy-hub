import { useState, useRef, useEffect } from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface AutoRefreshControlProps {
  interval: number | null; // in minutes, null = disabled
  onIntervalChange: (interval: number | null) => void;
}

export function AutoRefreshControl({ interval, onIntervalChange }: AutoRefreshControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const intervalOptions = [
    { value: null, label: 'Off' },
    { value: 3, label: '3 min' },
    { value: 5, label: '5 min' },
    { value: 10, label: '10 min' },
    { value: -1, label: 'Custom...' }
  ];

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
    }, 250);
  };

  const openMenu = () => {
    setShouldRender(true);
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

  const handleIntervalClick = (value: number | null) => {
    if (value === -1) {
      // Open custom dialog
      setCustomValue('');
      setIsDialogOpen(true);
      closeMenu();
    } else {
      onIntervalChange(value);
      closeMenu();
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCustomValue('');
  };

  const handleDialogSave = () => {
    const numValue = parseInt(customValue);
    if (!isNaN(numValue) && numValue > 0) {
      onIntervalChange(numValue);
    }
    setIsDialogOpen(false);
  };

  const getDisplayLabel = () => {
    if (interval === null) return 'Auto: Off';
    const option = intervalOptions.find(opt => opt.value === interval);
    return option ? `Auto: ${option.label}` : `Auto: ${interval} min`;
  };

  return (
    <>
      <div className="auto-refresh-control-wrapper" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className={`auto-refresh-toggle-btn ${interval !== null ? 'active' : ''}`}
          title="Auto-refresh interval (Beta)"
        >
          <AutorenewIcon className={interval !== null ? 'spinning' : ''} />
          <span>{getDisplayLabel()}</span>
          <KeyboardArrowDownIcon className={`arrow-icon ${isOpen ? 'open' : ''}`} />
          <span className="beta-badge-control">BETA</span>
        </button>

        {shouldRender && (
          <div className={`auto-refresh-menu ${isOpen && !isClosing ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
            <div className="auto-refresh-menu-header">
              <span>Auto Refresh</span>
            </div>
            
            {intervalOptions.map((option, index) => {
              const isActive = interval === option.value;

              return (
                <button
                  key={option.value ?? 'off'}
                  onClick={() => handleIntervalClick(option.value)}
                  className={`auto-refresh-menu-item ${isActive ? 'active' : ''}`}
                  style={{ animationDelay: isClosing ? '0s' : `${index * 0.05}s` }}
                >
                  <span className="auto-refresh-menu-label">{option.label}</span>
                  {isActive && option.value !== -1 && <CheckIcon className="auto-refresh-check" fontSize="small" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Dialog 
        open={isDialogOpen} 
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Custom Auto-Refresh Interval</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Interval (minutes)"
            type="number"
            fullWidth
            variant="outlined"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Enter minutes"
            helperText="Enter a positive number of minutes"
            inputProps={{ min: 1, step: 1 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            onClick={handleDialogSave} 
            variant="contained" 
            color="primary"
            disabled={!customValue || parseInt(customValue) <= 0}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

import { useState, useRef, useEffect } from 'react';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import RouterIcon from '@mui/icons-material/Router';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import HttpIcon from '@mui/icons-material/Http';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export type PingType = 'tcp' | 'icmp' | 'via-proxy';

interface PingTypeControlProps {
  pingType: PingType;
  onPingTypeChange: (type: PingType) => void;
  viaProxyUrl: string;
  onViaProxyUrlChange: (url: string) => void;
}

export function PingTypeControl({ pingType, onPingTypeChange, viaProxyUrl, onViaProxyUrlChange }: PingTypeControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(viaProxyUrl);
  const [isTextChanging, setIsTextChanging] = useState(false);
  const [displayLabel, setDisplayLabel] = useState('TCP Ping');
  const menuRef = useRef<HTMLDivElement>(null);
  const prevPingTypeRef = useRef<PingType>(pingType);

  const pingOptions: Array<{
    type: PingType;
    icon: React.ReactNode;
    label: string;
    description: string;
  }> = [
    { 
      type: 'tcp', 
      icon: <RouterIcon />, 
      label: 'TCP Ping',
      description: 'Connection time to proxy port'
    },
    { 
      type: 'icmp', 
      icon: <WifiTetheringIcon />, 
      label: 'ICMP Ping',
      description: 'Network latency (may be blocked)'
    },
    { 
      type: 'via-proxy', 
      icon: <HttpIcon />, 
      label: 'Via Proxy',
      description: 'HTTP request through proxy'
    }
  ];

  // Animate text change when ping type changes
  useEffect(() => {
    const currentOption = pingOptions.find(opt => opt.type === pingType);
    const newLabel = currentOption?.label || 'TCP Ping';
    
    if (prevPingTypeRef.current !== pingType && displayLabel !== newLabel) {
      setIsTextChanging(true);
      
      // Fade out
      setTimeout(() => {
        setDisplayLabel(newLabel);
      }, 150);
      
      // Fade in
      setTimeout(() => {
        setIsTextChanging(false);
      }, 300);
    }
    
    prevPingTypeRef.current = pingType;
  }, [pingType]);

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

  const handlePingTypeClick = (type: PingType) => {
    onPingTypeChange(type);
    // Don't close menu - keep it open for multiple selections
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempUrl(viaProxyUrl);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setTempUrl(viaProxyUrl);
  };

  const handleDialogSave = () => {
    onViaProxyUrlChange(tempUrl);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="ping-type-control-wrapper" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="ping-type-toggle-btn"
          title="Select ping type"
        >
          <NetworkCheckIcon />
          <span className={isTextChanging ? 'text-changing' : ''}>{displayLabel}</span>
          <KeyboardArrowDownIcon className={`arrow-icon ${isOpen ? 'open' : ''}`} />
        </button>

        {shouldRender && (
          <div className={`ping-type-menu ${isOpen && !isClosing ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
            <div className="ping-type-menu-header">
              <span>Ping Type</span>
              {pingType === 'via-proxy' && (
                <button 
                  className="ping-type-settings-btn"
                  onClick={handleSettingsClick}
                  title="Configure Via Proxy URL"
                >
                  <SettingsIcon fontSize="small" />
                </button>
              )}
            </div>
            
            {pingOptions.map(({ type, icon, label, description }, index) => {
              const isActive = pingType === type;

              return (
                <button
                  key={type}
                  onClick={() => handlePingTypeClick(type)}
                  className={`ping-type-menu-item ${isActive ? 'active' : ''}`}
                  style={{ animationDelay: isClosing ? '0s' : `${index * 0.05}s` }}
                >
                  <span className="ping-type-menu-icon">{icon}</span>
                  <div className="ping-type-menu-content">
                    <span className="ping-type-menu-label">{label}</span>
                    <span className="ping-type-menu-description">{description}</span>
                  </div>
                  {isActive && <span className="ping-type-check">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Dialog 
        open={isDialogOpen} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Configure Via Proxy URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Test URL"
            type="url"
            fullWidth
            variant="outlined"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="https://www.gstatic.com/generate_204"
            helperText="URL to test proxy connectivity (should return 204 No Content)"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

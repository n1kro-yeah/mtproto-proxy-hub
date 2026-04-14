import { useState, useRef, useEffect } from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface HideOfflineControlProps {
  hideOffline: boolean;
  onToggle: (hide: boolean) => void;
}

export function HideOfflineControl({ hideOffline, onToggle }: HideOfflineControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isTextChanging, setIsTextChanging] = useState(false);
  const [displayText, setDisplayText] = useState(hideOffline ? 'Show All' : 'Hide Offline');
  const menuRef = useRef<HTMLDivElement>(null);
  const prevHideOfflineRef = useRef(hideOffline);

  // Animate text change when hideOffline changes
  useEffect(() => {
    const newText = hideOffline ? 'Show All' : 'Hide Offline';
    
    if (prevHideOfflineRef.current !== hideOffline && displayText !== newText) {
      setIsTextChanging(true);
      
      // Fade out
      setTimeout(() => {
        setDisplayText(newText);
      }, 150); // Half of animation duration
      
      // Fade in
      setTimeout(() => {
        setIsTextChanging(false);
      }, 300); // Full animation duration
    }
    
    prevHideOfflineRef.current = hideOffline;
  }, [hideOffline, displayText]);

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

  const handleToggle = () => {
    onToggle(!hideOffline);
    // Keep menu open to allow user to see the changes
  };

  return (
    <div className="hide-offline-control-wrapper" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className={`hide-offline-toggle-btn ${hideOffline ? 'active' : ''}`}
        title="Hide offline proxies"
      >
        {hideOffline ? <VisibilityOffIcon /> : <VisibilityIcon />}
        <span className={isTextChanging ? 'text-changing' : ''}>{displayText}</span>
      </button>

      {shouldRender && (
        <div className={`hide-offline-menu ${isOpen && !isClosing ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
          <div className="hide-offline-menu-header">
            <span>Display Options</span>
          </div>
          
          <label className="hide-offline-switch">
            <input
              type="checkbox"
              checked={hideOffline}
              onChange={handleToggle}
            />
            <span className="slider"></span>
            <span className="label-text">Hide Offline Proxies</span>
          </label>

          <div className="hide-offline-info">
            {hideOffline 
              ? 'Offline proxies are hidden' 
              : 'All proxies are visible'}
          </div>
        </div>
      )}
    </div>
  );
}

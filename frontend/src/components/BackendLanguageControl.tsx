import { useState, useRef, useEffect } from 'react';
import CodeIcon from '@mui/icons-material/Code';
import CheckIcon from '@mui/icons-material/Check';

export type BackendLanguage = 'python' | 'csharp';

interface BackendLanguageControlProps {
  language: BackendLanguage;
  onLanguageChange: (language: BackendLanguage) => void;
}

export function BackendLanguageControl({ language, onLanguageChange }: BackendLanguageControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTextChanging, setIsTextChanging] = useState(false);
  const [displayLabel, setDisplayLabel] = useState(language === 'python' ? 'Python' : 'C#');
  const menuRef = useRef<HTMLDivElement>(null);
  const prevLanguageRef = useRef(language);

  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      setIsTextChanging(true);
      setTimeout(() => {
        setDisplayLabel(language === 'python' ? 'Python' : 'C#');
        setTimeout(() => {
          setIsTextChanging(false);
        }, 150);
      }, 150);
    }
    prevLanguageRef.current = language;
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = (selectedLanguage: BackendLanguage) => {
    onLanguageChange(selectedLanguage);
    setIsOpen(false);
  };

  return (
    <div className="backend-language-control" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-backend-language"
        title="Backend Language (Developer)"
      >
        <CodeIcon />
        <span className={isTextChanging ? 'text-changing' : ''}>{displayLabel}</span>
      </button>

      {isOpen && (
        <div className="backend-language-menu">
          <button
            onClick={() => handleLanguageSelect('python')}
            className={`menu-item ${language === 'python' ? 'active' : ''}`}
          >
            <span>Python</span>
            {language === 'python' && <CheckIcon className="check-icon" />}
          </button>
          <button
            onClick={() => handleLanguageSelect('csharp')}
            className={`menu-item ${language === 'csharp' ? 'active' : ''}`}
          >
            <span>C#</span>
            {language === 'csharp' && <CheckIcon className="check-icon" />}
          </button>
        </div>
      )}
    </div>
  );
}

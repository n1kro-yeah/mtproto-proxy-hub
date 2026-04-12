import { type Language } from '../locales/translations';
import LanguageIcon from '@mui/icons-material/Language';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  const toggleLanguage = () => {
    onLanguageChange(language === 'en' ? 'ru' : 'en');
  };

  return (
    <button onClick={toggleLanguage} className="language-toggle" title={language === 'en' ? 'Switch to Russian (Beta)' : 'Переключить на английский (Бета)'}>
      <LanguageIcon />
      <span className="language-slider">
        <span className={`language-option ${language === 'en' ? 'active' : ''}`}>EN</span>
        <span className={`language-option ${language === 'ru' ? 'active' : ''}`}>RU</span>
        <span className={`language-slider-indicator ${language === 'ru' ? 'right' : 'left'}`}></span>
      </span>
      <span className="beta-badge">BETA</span>
    </button>
  );
}

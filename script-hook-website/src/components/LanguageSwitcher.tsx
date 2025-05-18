import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../context/I18nContext';
import './LanguageSwitcher.css';

// 语言切换器组件
const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, supportedLanguages, changeLanguage, isSwitching } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 关闭下拉菜单的点击外部事件处理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 处理语言切换
  const handleLanguageChange = (lang: string) => {
    if (lang === currentLanguage || isSwitching) {
      setIsOpen(false);
      return;
    }
    
    changeLanguage(lang).then(() => {
      setIsOpen(false);
    });
  };

  // 添加调试信息
  console.log('Language switcher rendering', { currentLanguage, supportedLanguages });

  return (
    <div className={`language-switcher ${isSwitching ? 'switching' : ''}`} ref={dropdownRef} data-testid="language-switcher">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('language.switchLanguage')}
        aria-expanded={isOpen}
        disabled={isSwitching}
      >
        <div className="current-language">
          {currentLanguage === 'zh' ? '中文' : 'English'}
        </div>
        <span className={`arrow-down ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown" role="menu">
          {supportedLanguages.map(lang => (
            <button 
              key={lang.code}
              className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isSwitching || currentLanguage === lang.code}
              aria-selected={currentLanguage === lang.code}
              role="menuitem"
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 
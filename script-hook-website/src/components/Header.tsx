import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [currentLang, setCurrentLang] = useState(i18n.language.split('-')[0]);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // 支持的语言
  const languages = [
    { code: 'zh', name: '简体中文' },
    { code: 'en', name: 'English' }
  ];

  // 切换语言函数
  const handleLanguageChange = (langCode: string) => {
    console.log("切换语言到:", langCode);
    i18n.changeLanguage(langCode).then(() => {
      setCurrentLang(langCode);
      setIsLangMenuOpen(false);
      
      // 更新HTML标签
      document.documentElement.setAttribute('lang', langCode);
      
      // 更新meta标签
      document.title = t('html.title');
      const metaDesc = document.getElementById('meta-description');
      if (metaDesc) {
        metaDesc.setAttribute('content', t('html.description'));
      }
      
      // 更新社交媒体元数据
      const updateMetaTag = (id: string, attr: string, value: string) => {
        const tag = document.getElementById(id);
        if (tag) tag.setAttribute(attr, value);
      };
      
      updateMetaTag('og-title', 'content', t('html.title'));
      updateMetaTag('og-description', 'content', t('html.description'));
      updateMetaTag('twitter-title', 'content', t('html.title'));
      updateMetaTag('twitter-description', 'content', t('html.description'));
      
      // 存储用户语言选择
      localStorage.setItem('language', langCode);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // 计算当前活跃部分
      const sections = [
        'features',
        'installation',
        'support',
        'community'
      ];
      
      // 找到视口中可见的部分
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // 当元素上边缘在视口的上半部分时设为活跃
          return rect.top <= 150 && rect.bottom >= 0;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <a href="/">
            <img src="./images/logo.png" alt="JS Script Hook Logo" className="site-logo transparent-bg" />
          </a>
        </div>
        
        <div className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <nav className={`main-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#features" className={activeSection === 'features' ? 'active' : ''}>{t('nav.features')}</a></li>
            <li><a href="#installation" className={activeSection === 'installation' ? 'active' : ''}>{t('nav.installation')}</a></li>
            <li><a href="#support" className={activeSection === 'support' ? 'active' : ''}>{t('nav.support')}</a></li>
            <li><a href="#community" className={activeSection === 'community' ? 'active' : ''}>{t('nav.community')}</a></li>
          </ul>
          
          {/* 直接在这里实现语言切换器，确保它显示 */}
          <div className="language-switcher">
            <button 
              className="language-button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              aria-label={t('language.switchLanguage')}
              aria-expanded={isLangMenuOpen}
            >
              <div className="current-language">
                {currentLang === 'zh' ? '中文' : 'English'}
              </div>
              <span className={`arrow-down ${isLangMenuOpen ? 'open' : ''}`}>▼</span>
            </button>
            
            {isLangMenuOpen && (
              <div className="language-dropdown" role="menu">
                {languages.map(lang => (
                  <button 
                    key={lang.code}
                    className={`language-option ${currentLang === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                    aria-selected={currentLang === lang.code}
                    role="menuitem"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
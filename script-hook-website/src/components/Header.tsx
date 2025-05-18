import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // 计算当前活跃部分
      const sections = [
        'features',
        'installation',
        'support',
        'star-history',
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
            <img src="/images/logo.png" alt="JS Script Hook Logo" className="site-logo transparent-bg" />
          </a>
        </div>
        
        <div className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <nav className={`main-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#features" className={activeSection === 'features' ? 'active' : ''}>功能</a></li>
            <li><a href="#installation" className={activeSection === 'installation' ? 'active' : ''}>安装</a></li>
            <li><a href="#support" className={activeSection === 'support' ? 'active' : ''}>支持</a></li>
            <li><a href="#star-history" className={activeSection === 'star-history' ? 'active' : ''}>Star历史</a></li>
            <li><a href="#community" className={activeSection === 'community' ? 'active' : ''}>交流群</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
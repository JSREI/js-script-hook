import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <nav className={`main-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#features">功能</a></li>
            <li><a href="#installation">安装</a></li>
            <li><a href="#examples">示例</a></li>
            <li><a href="#support">支持</a></li>
            <li><a href="#community">交流群</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
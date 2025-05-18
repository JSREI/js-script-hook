import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>
              <a href="https://github.com/JSREI/js-script-hook" target="_blank" rel="noopener noreferrer" className="footer-title-link">
                JS Script Hook
              </a>
            </h4>
            <p>{t('footer.description')}</p>
          </div>
          
          <div className="footer-section">
            <h4>{t('footer.links.title')}</h4>
            <ul>
              <li><a href="https://github.com/JSREI/js-script-hook/issues" target="_blank" rel="noopener noreferrer">{t('footer.links.issues')}</a></li>
              <li><a href="https://github.com/JSREI/js-script-hook/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">{t('footer.links.license')}</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>{t('footer.resources.title')}</h4>
            <ul>
              <li><a href="#installation">{t('footer.resources.installation')}</a></li>
              <li><a href="https://github.com/JSREI/js-script-hook#readme" target="_blank" rel="noopener noreferrer">{t('footer.resources.documentation')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} <a href="https://github.com/JSREI/js-script-hook" target="_blank" rel="noopener noreferrer">JS Script Hook</a>. {t('footer.copyright')}</p>
          <p>{t('footer.developedBy')} <a href="https://github.com/JSREI" target="_blank" rel="noopener noreferrer">JSREI</a> {t('footer.team')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
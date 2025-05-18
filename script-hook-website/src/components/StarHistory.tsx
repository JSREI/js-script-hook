import React from 'react';
import { useTranslation } from 'react-i18next';
import './StarHistory.css';

const StarHistory: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section id="star-history" className="star-history-section">
      <div className="container">
        <div className="section-header">
          <h2>{t('starHistory.title')}</h2>
          <p>{t('starHistory.description')}</p>
        </div>
        
        <div className="star-history-content">
          <div className="star-chart">
            <img 
              src="https://starchart.cc/JSREI/js-script-hook.svg" 
              alt={t('starHistory.chartAlt')} 
              className="star-chart-image"
            />
          </div>
          
          <div className="star-action">
            <p>{t('starHistory.likeCta')}</p>
            <a 
              href="https://github.com/JSREI/js-script-hook" 
              target="_blank" 
              rel="noopener noreferrer"
              className="star-button"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
              </svg>
              {t('starHistory.starButton')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StarHistory; 
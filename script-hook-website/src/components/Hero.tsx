import React from 'react';
import { useTranslation } from 'react-i18next';
import './Hero.css';
import Monitor from './Monitor';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>JS Script Hook</h1>
          <p className="subtitle">{t('hero.subtitle')}</p>
          <div className="hero-badges">
            <img src="https://img.shields.io/greasyfork/dt/419533" alt={t('hero.badges.downloads')} />
            <img src="https://img.shields.io/greasyfork/rating-count/419533" alt={t('hero.badges.rating')} />
            <img src="https://img.shields.io/github/license/JSREI/js-script-hook" alt={t('hero.badges.license')} />
            <img src="https://img.shields.io/github/v/release/JSREI/js-script-hook" alt={t('hero.badges.release')} />
          </div>
          <p className="description">
            {t('hero.description')}
          </p>
          <div className="hero-buttons">
            <a href="#installation" className="btn btn-primary">{t('hero.buttons.quickStart')}</a>
            <a href="https://github.com/JSREI/js-script-hook" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{t('hero.buttons.github')}</a>
            <a href="https://www.bilibili.com/video/BV12BrkYGEHv/" target="_blank" rel="noopener noreferrer" className="btn btn-video">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="video-icon">
                <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              {t('hero.buttons.watchDemo')}
            </a>
          </div>
        </div>
        <div className="hero-image">
          <Monitor 
            imageUrl="./images/ezgif-5-191ba6b41b.gif" 
            imageAlt={t('hero.monitor.imageAlt')}
            title={t('hero.monitor.title')}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero; 
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './DetailedFeatures.css';

const DetailedFeatures: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'interface' | 'console' | 'breakpoint'>('interface');

  const getTabContent = (tab: 'interface' | 'console' | 'breakpoint') => {
    const items = [
      {
        title: t(`detailedFeatures.${tab}.${tab === 'interface' ? 'globalConfig' : tab === 'console' ? 'interfaceAnalysis' : 'requestAnalysis'}.title`),
        points: t(`detailedFeatures.${tab}.${tab === 'interface' ? 'globalConfig' : tab === 'console' ? 'interfaceAnalysis' : 'requestAnalysis'}.points`, { returnObjects: true }) as string[]
      },
      {
        title: t(`detailedFeatures.${tab}.${tab === 'interface' ? 'breakpointConfig' : tab === 'console' ? 'targetFilter' : 'responseExtraction'}.title`),
        points: t(`detailedFeatures.${tab}.${tab === 'interface' ? 'breakpointConfig' : tab === 'console' ? 'targetFilter' : 'responseExtraction'}.points`, { returnObjects: true }) as string[]
      }
    ];

    return {
      title: t(`detailedFeatures.${tab}.title`),
      description: t(`detailedFeatures.${tab}.description`),
      image: tab === 'interface' 
        ? "https://github.com/JSREI/js-script-hook/raw/main/README.assets/image-20250109024541404.png"
        : tab === 'console'
        ? "https://github.com/JSREI/js-script-hook/raw/main/README.assets/image-20250109024829101.png"
        : "https://github.com/JSREI/js-script-hook/raw/main/README.assets/image-20250109024918866.png",
      items
    };
  };

  const renderTabContent = () => {
    const content = getTabContent(activeTab);
    
    return (
      <div className="detailed-content">
        <div className="content-container">
          <div className="content-text">
            <h3>{content.title}</h3>
            <p className="content-description">{content.description}</p>
            
            {content.items.map((item, index) => (
              <div key={index} className="feature-item">
                <h4>{item.title}</h4>
                <ul>
                  {item.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="content-image">
            <img src={content.image} alt={content.title} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="detailed-features" className="detailed-features">
      <div className="container">
        <div className="section-header">
          <h2>{t('detailedFeatures.title')}</h2>
          <p>{t('detailedFeatures.description')}</p>
        </div>
        
        <div className="tabs">
          <button 
            className={activeTab === 'interface' ? 'active' : ''} 
            onClick={() => setActiveTab('interface')}
          >
            {t('detailedFeatures.tabs.interface')}
          </button>
          <button 
            className={activeTab === 'console' ? 'active' : ''} 
            onClick={() => setActiveTab('console')}
          >
            {t('detailedFeatures.tabs.console')}
          </button>
          <button 
            className={activeTab === 'breakpoint' ? 'active' : ''} 
            onClick={() => setActiveTab('breakpoint')}
          >
            {t('detailedFeatures.tabs.breakpoint')}
          </button>
        </div>
        
        {renderTabContent()}
      </div>
    </section>
  );
};

export default DetailedFeatures; 
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Features.css';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: '🔌',
      title: t('features.items.scriptInterception.title'),
      description: t('features.items.scriptInterception.description')
    },
    {
      icon: '⚡',
      title: t('features.items.jsonpParsing.title'),
      description: t('features.items.jsonpParsing.description')
    },
    {
      icon: '🛠️',
      title: t('features.items.breakpointControl.title'),
      description: t('features.items.breakpointControl.description')
    },
    {
      icon: '🔍',
      title: t('features.items.dataExtraction.title'),
      description: t('features.items.dataExtraction.description')
    },
    {
      icon: '🧩',
      title: t('features.items.hookStrategies.title'),
      description: t('features.items.hookStrategies.description')
    },
    {
      icon: '📦',
      title: t('features.items.stealthMode.title'),
      description: t('features.items.stealthMode.description')
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <h2>{t('features.title')}</h2>
          <p>{t('features.description')}</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 
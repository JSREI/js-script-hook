import React from 'react';
import { useTranslation } from 'react-i18next';
import './CommunityGroup.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const CommunityGroup: React.FC = () => {
  const { t } = useTranslation();
  
  const groups = [
    {
      title: t('community.groups.wechat.title'),
      image: 'https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20241016230653669.png',
      description: t('community.groups.wechat.description')
    },
    {
      title: t('community.groups.personalWechat.title'),
      image: 'https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20231030132026541-7614065.png',
      description: t('community.groups.personalWechat.description')
    },
    {
      title: t('community.groups.telegram.title'),
      image: 'https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20241016231143315.png',
      description: t('community.groups.telegram.description'),
      link: 'https://t.me/jsreijsrei'
    }
  ];

  return (
    <section id="community" className="community-section">
      <div className="container">
        <div className="section-header">
          <h2>{t('community.title')}</h2>
          <p>{t('community.description')}</p>
        </div>
        
        <div className="community-groups">
          {groups.map((group, index) => (
            <div key={index} className="community-group-item">
              <div className="group-header">
                <h3>{group.title}</h3>
              </div>
              
              <div className="group-content">
                <div className="qr-code-wrapper">
                  <Zoom>
                    <img 
                      src={group.image} 
                      alt={t('community.qrCode', { group: group.title })} 
                      className="qr-code-image"
                    />
                  </Zoom>
                </div>
              </div>
              
              <div className="group-footer">
                <p className="group-description">
                  {group.link ? (
                    <>
                      <a href={group.link} target="_blank" rel="noopener noreferrer">{t('community.clickHere')}</a>
                      {t('community.orScanCode')}
                    </>
                  ) : (
                    group.description
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityGroup; 
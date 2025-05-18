import React from 'react';
import './CommunityGroup.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const CommunityGroup: React.FC = () => {
  const groups = [
    {
      title: '微信交流群',
      image: 'https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20241016230653669.png',
      description: '扫码加入逆向技术微信交流群'
    },
    {
      title: '个人微信',
      image: 'https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20231030132026541-7614065.png',
      description: '群二维码过期，可加此微信发送【逆向群】'
    },
    {
      title: 'Telegram交流群',
      image: 'https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20241016231143315.png',
      description: '点击或扫码加入TG交流群',
      link: 'https://t.me/jsreijsrei'
    }
  ];

  return (
    <section id="community" className="community-section">
      <div className="container">
        <div className="section-header">
          <h2>逆向技术交流群</h2>
          <p>加入我们的交流群，获取最新信息与技术支持</p>
        </div>
        
        <div className="community-groups">
          {groups.map((group, index) => (
            <div key={index} className="community-group-item">
              <h3>{group.title}</h3>
              <div className="qr-code-wrapper">
                <Zoom>
                  <img 
                    src={group.image} 
                    alt={`${group.title}二维码`} 
                    className="qr-code-image"
                  />
                </Zoom>
              </div>
              <p className="group-description">
                {group.link ? (
                  <>
                    <a href={group.link} target="_blank" rel="noopener noreferrer">点此</a>
                    或扫码{group.description.split('点击或扫码')[1]}
                  </>
                ) : (
                  group.description
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityGroup; 
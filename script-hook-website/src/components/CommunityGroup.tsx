import React from 'react';
import './CommunityGroup.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const CommunityGroup: React.FC = () => {
  return (
    <section id="community" className="community-section">
      <div className="container">
        <div className="section-header">
          <h2>逆向技术交流群</h2>
          <p>加入我们的交流群，获取最新信息与技术支持</p>
        </div>
        
        <div className="community-content">
          <div className="qr-group">
            <div className="qr-item">
              <h3>微信交流群</h3>
              <div className="qr-image-container">
                <Zoom>
                  <img 
                    src="https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20241016230653669.png" 
                    alt="微信交流群二维码" 
                    className="qr-image"
                  />
                </Zoom>
              </div>
              <p>扫码加入逆向技术微信交流群</p>
            </div>
            
            <div className="qr-item">
              <h3>个人微信</h3>
              <div className="qr-image-container">
                <Zoom>
                  <img 
                    src="https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20231030132026541-7614065.png" 
                    alt="个人微信二维码" 
                    className="qr-image"
                  />
                </Zoom>
              </div>
              <p>群二维码过期，可加此微信发送【逆向群】</p>
            </div>
            
            <div className="qr-item">
              <h3>Telegram交流群</h3>
              <div className="qr-image-container">
                <Zoom>
                  <img 
                    src="https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20241016231143315.png" 
                    alt="Telegram群二维码" 
                    className="qr-image"
                  />
                </Zoom>
              </div>
              <p><a href="https://t.me/jsreijsrei" target="_blank" rel="noopener noreferrer">点此</a>或扫码加入TG交流群</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityGroup; 
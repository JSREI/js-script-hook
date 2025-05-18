import React from 'react';
import './Support.css';

const Support: React.FC = () => {
  return (
    <section id="support" className="support">
      <div className="container">
        <div className="section-header">
          <h2>支持与贡献</h2>
          <p>加入我们的社区，共同推动项目发展</p>
        </div>

        <div className="support-grid">
          {/* 问题反馈 */}
          <div className="support-card">
            <div className="card-header">
              <h3>问题反馈</h3>
              <svg className="icon" viewBox="0 0 24 24" width="24" height="24">
                <path d="M20 3H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.7 11.5h1.7v1.7h-1.7v-1.7zm0-7.3h1.7v5.7h-1.7V7.2z" fill="currentColor" />
              </svg>
            </div>
            <p>遇到问题时，请通过GitHub Issues进行反馈。这有助于我们追踪和解决问题，同时也方便其他用户查阅。</p>
            <div className="button-container">
              <a href="https://github.com/JSREI/js-script-hook/issues/new" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                创建Issue
              </a>
            </div>
          </div>

          {/* 贡献者墙 */}
          <div className="support-card">
            <div className="card-header">
              <h3>贡献者</h3>
              <svg className="icon" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
              </svg>
            </div>
            <p>感谢所有为项目做出贡献的开发者。欢迎提交PR，提升产品功能。</p>
            <div className="contributors-wall">
              <img src="https://contrib.nn.ci/api?repo=JSREI/js-script-hook" alt="Contributors" />
            </div>
          </div>

          {/* 交流群 */}
          <div className="support-card">
            <div className="card-header">
              <h3>交流群</h3>
              <svg className="icon" viewBox="0 0 24 24" width="24" height="24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" fill="currentColor" />
              </svg>
            </div>
            <p>加入我们的逆向技术交流群，与其他开发者分享经验、解决问题。</p>
            <div className="qrcode-container">
              <div className="qrcode-item">
                <img src="https://github.com/JSREI/.github/raw/main/profile/README.assets/image-20241016230653669.png" alt="微信群二维码" />
                <p>微信群</p>
              </div>
              <div className="qrcode-item">
                <img src="https://github.com/JSREI/.github/raw/main/profile/README.assets/image-20241016231143315.png" alt="Telegram群二维码" />
                <p>Telegram群</p>
              </div>
            </div>
          </div>

          {/* Star历史 */}
          <div className="support-card">
            <div className="card-header">
              <h3>Star历史</h3>
              <svg className="icon" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" />
              </svg>
            </div>
            <p>项目自创建以来的GitHub星标增长趋势。感谢社区的持续支持！</p>
            <div className="star-history">
              <img src="https://starchart.cc/JSREI/js-script-hook.svg" alt="Star History Chart" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support; 
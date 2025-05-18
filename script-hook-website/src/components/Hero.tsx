import React from 'react';
import './Hero.css';
import Monitor from './Monitor';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>JS Script Hook</h1>
          <p className="subtitle">专为Web逆向分析设计的JavaScript请求拦截工具</p>
          <div className="hero-badges">
            <img src="https://img.shields.io/greasyfork/dt/419533" alt="Greasy Fork Downloads" />
            <img src="https://img.shields.io/greasyfork/rating-count/419533" alt="Greasy Fork Rating" />
            <img src="https://img.shields.io/github/license/JSREI/js-script-hook" alt="License" />
            <img src="https://img.shields.io/github/v/release/JSREI/js-script-hook" alt="GitHub Release" />
          </div>
          <p className="description">
            一个专注于辅助Web逆向工程的轻量级JavaScript库，精准拦截和分析script请求与JSONP调用，帮助您快速定位关键接口，简化逆向分析流程，提升调试效率。
          </p>
          <div className="hero-buttons">
            <a href="#installation" className="btn btn-primary">快速开始</a>
            <a href="https://github.com/JSREI/js-script-hook" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">GitHub</a>
            <a href="https://www.bilibili.com/video/BV12BrkYGEHv/" target="_blank" rel="noopener noreferrer" className="btn btn-video">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="video-icon">
                <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              观看演示视频
            </a>
          </div>
        </div>
        <div className="hero-image">
          <Monitor 
            imageUrl="./images/ezgif-5-191ba6b41b.gif" 
            imageAlt="JS Script Hook 功能演示"
            title="核心功能演示"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero; 
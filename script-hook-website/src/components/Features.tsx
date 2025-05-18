import React from 'react';
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
  const features = [
    {
      icon: '🔌',
      title: 'Script请求拦截',
      description: '精准拦截网页中所有动态加载的script元素，协助逆向分析数据交互流程。'
    },
    {
      icon: '⚡',
      title: 'JSONP逆向解析',
      description: '专为逆向分析JSONP请求设计，自动捕获回调函数及参数，揭示接口数据结构。'
    },
    {
      icon: '🛠️',
      title: '精确断点控制',
      description: '根据URL特征智能设置断点，定位关键请求和回调函数，简化逆向分析流程。'
    },
    {
      icon: '🔍',
      title: '接口数据提取',
      description: '实时监控并分析请求和响应数据，轻松获取接口参数结构，提升逆向效率。'
    },
    {
      icon: '🧩',
      title: '多样Hook策略',
      description: '支持代理函数与重声明函数两种钩子实现，灵活应对各类反调试场景。'
    },
    {
      icon: '📦',
      title: '隐蔽监控模式',
      description: '智能过滤和精确日志，最小化工具特征，有效规避网站的反逆向检测机制。'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <h2>主要功能</h2>
          <p>JS Script Hook专为Web逆向分析设计，帮助您高效识别与提取关键请求数据</p>
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
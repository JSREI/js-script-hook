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
      title: 'Script钩子',
      description: '自动拦截和监控页面中的Script元素，跟踪脚本加载和执行过程。'
    },
    {
      icon: '⚡',
      title: 'JSONP分析',
      description: '特别针对JSONP请求进行分析，自动检测和监控回调函数的执行。'
    },
    {
      icon: '🛠️',
      title: '动态断点',
      description: '根据配置的URL模式和条件，在特定的JSONP回调处自动设置断点。'
    },
    {
      icon: '🔍',
      title: '调试增强',
      description: '提供请求和响应的详细分析，帮助理解网站API交互和数据流。'
    },
    {
      icon: '🧩',
      title: '灵活配置',
      description: '支持两种钩子实现方式：代理函数和重声明函数，适应不同场景需求。'
    },
    {
      icon: '📦',
      title: '性能优化',
      description: '智能日志系统，仅在必要时输出信息，最小化对网站性能的影响。'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <h2>主要功能</h2>
          <p>JS Script Hook提供了多种强大的功能，帮助您分析和调试复杂的Web应用</p>
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
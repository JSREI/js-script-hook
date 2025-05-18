import React, { useState } from 'react';
import './DetailedFeatures.css';

const DetailedFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interface' | 'console' | 'breakpoint'>('interface');

  const tabContent = {
    interface: {
      title: "界面设置",
      description: "JS Script Hook提供了直观的配置界面，可根据您的需求进行个性化设置。",
      image: "https://github.com/JSREI/js-script-hook/raw/main/README.assets/image-20250109024541404.png",
      items: [
        {
          title: "全局配置",
          points: [
            "界面语言：支持简体中文和English，自由切换。",
            "响应断点Hook方式：支持代理函数和重声明函数两种方式。",
            "Hook Flag前缀：自定义前缀，个性化您的开发环境。",
            "选择性忽略请求：可忽略.js文件或非JSONP请求。"
          ]
        },
        {
          title: "断点配置",
          points: [
            "灵活启用/禁用：可随时切换断点状态。",
            "URL匹配方式：提供多种匹配模式，精确控制断点触发。",
            "请求与响应断点：分别控制请求发出前和回调函数执行时的断点。",
            "JSONP回调识别：内置智能推测引擎，可选手动配置。"
          ]
        }
      ]
    },
    console: {
      title: "控制台打印",
      description: "捕获所有script请求和响应，以表格形式在控制台清晰展示。",
      image: "https://github.com/JSREI/js-script-hook/raw/main/README.assets/image-20250109024829101.png",
      items: [
        {
          title: "信息展示",
          points: [
            "请求URL：完整显示脚本请求的地址。",
            "JSONP标识：自动识别并标记JSONP请求。",
            "回调函数：显示JSONP回调函数名称。",
            "时间戳：记录请求发起的精确时间。"
          ]
        },
        {
          title: "筛选功能",
          points: [
            "根据全局设置自动筛选日志输出。",
            "可选忽略.js后缀的普通脚本文件。",
            "可选只关注JSONP类型的请求。",
            "控制台信息整洁清晰，便于分析。"
          ]
        }
      ]
    },
    breakpoint: {
      title: "断点功能",
      description: "提供强大的断点设置功能，帮助开发者精确定位和分析脚本执行过程。",
      image: "https://github.com/JSREI/js-script-hook/raw/main/README.assets/image-20250109024918866.png",
      items: [
        {
          title: "请求断点",
          points: [
            "在脚本请求发出前触发断点。",
            "访问请求上下文信息，包括URL和参数。",
            "结合URL匹配规则，精确控制断点触发条件。",
            "便于分析请求参数加密等场景。"
          ]
        },
        {
          title: "响应断点",
          points: [
            "在JSONP回调函数执行时触发断点。",
            "查看响应数据结构和内容。",
            "支持两种断点方式：代理函数或直接修改函数体。",
            "适用于响应数据处理和解析场景。"
          ]
        }
      ]
    }
  };

  const renderTabContent = () => {
    const content = tabContent[activeTab];
    
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
          <h2>产品详解</h2>
          <p>探索JS Script Hook的强大功能与详细使用方法</p>
        </div>
        
        <div className="tabs">
          <button 
            className={activeTab === 'interface' ? 'active' : ''} 
            onClick={() => setActiveTab('interface')}
          >
            界面设置
          </button>
          <button 
            className={activeTab === 'console' ? 'active' : ''} 
            onClick={() => setActiveTab('console')}
          >
            控制台打印
          </button>
          <button 
            className={activeTab === 'breakpoint' ? 'active' : ''} 
            onClick={() => setActiveTab('breakpoint')}
          >
            断点功能
          </button>
        </div>
        
        {renderTabContent()}
      </div>
    </section>
  );
};

export default DetailedFeatures; 
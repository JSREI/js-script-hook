import React, { useState } from 'react';
import './DetailedFeatures.css';

const DetailedFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interface' | 'console' | 'breakpoint'>('interface');

  const tabContent = {
    interface: {
      title: "界面设置",
      description: "JS Script Hook提供针对Web逆向工程优化的配置界面，灵活设置拦截策略。",
      image: "https://github.com/JSREI/js-script-hook/raw/main/README.assets/image-20250109024541404.png",
      items: [
        {
          title: "全局配置",
          points: [
            "界面语言：支持简体中文和English，适应不同使用场景。",
            "Hook策略选择：根据目标网站的防护机制，选择最合适的拦截方式。",
            "自定义Hook标识：减少特征识别风险，规避反调试检测。",
            "精细请求过滤：针对性监控特定请求，优化逆向分析效率。"
          ]
        },
        {
          title: "断点配置",
          points: [
            "智能断点控制：快速启用/禁用特定URL的断点。",
            "多模式URL匹配：支持精确、前缀、后缀、正则等多种匹配方式。",
            "双向断点机制：拦截请求发起和数据返回两个关键节点。",
            "自动JSONP识别：内置回调参数推断引擎，快速定位关键函数。"
          ]
        }
      ]
    },
    console: {
      title: "请求监控",
      description: "全方位捕获script和JSONP请求，直观展示数据流，便于逆向分析接口调用。",
      image: "https://github.com/JSREI/js-script-hook/raw/main/README.assets/image-20250109024829101.png",
      items: [
        {
          title: "接口数据分析",
          points: [
            "请求URL解析：完整记录并分析接口地址及参数结构。",
            "JSONP识别标记：自动区分普通script和JSONP请求。",
            "回调函数提取：精确识别并显示数据处理函数。",
            "请求时序记录：分析请求间的逻辑关系和调用顺序。"
          ]
        },
        {
          title: "目标请求过滤",
          points: [
            "智能过滤系统：聚焦关键请求，减少干扰信息。",
            "静态资源排除：可选忽略普通js文件，专注数据接口。",
            "JSONP请求聚焦：精准定位数据交互通道。",
            "清晰日志展示：结构化记录接口信息，便于追踪分析。"
          ]
        }
      ]
    },
    breakpoint: {
      title: "逆向断点",
      description: "精确定位关键接口和数据处理函数，深入分析请求参数和响应数据结构。",
      image: "https://github.com/JSREI/js-script-hook/raw/main/README.assets/image-20250109024918866.png",
      items: [
        {
          title: "请求参数分析",
          points: [
            "请求前拦截：捕获脚本加载前的关键时刻，分析参数构造过程。",
            "上下文信息获取：完整访问请求环境和参数生成逻辑。",
            "目标精准定位：根据URL特征智能触发断点。",
            "参数加密分析：便于逆向分析参数加密算法和签名生成机制。"
          ]
        },
        {
          title: "响应数据提取",
          points: [
            "回调函数拦截：精确捕获JSONP数据处理时刻。",
            "响应内容解析：直观查看接口返回的完整数据结构。",
            "双模式断点支持：灵活应对不同反调试场景。",
            "数据处理跟踪：分析网站对返回数据的后续处理逻辑。"
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
          <h2>逆向分析工具箱</h2>
          <p>全方位支持Web逆向工程的专业工具，简化接口分析与数据提取流程</p>
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
            请求监控
          </button>
          <button 
            className={activeTab === 'breakpoint' ? 'active' : ''} 
            onClick={() => setActiveTab('breakpoint')}
          >
            逆向断点
          </button>
        </div>
        
        {renderTabContent()}
      </div>
    </section>
  );
};

export default DetailedFeatures; 
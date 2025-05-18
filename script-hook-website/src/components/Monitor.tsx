import React, { useState, useRef, useEffect } from 'react';
import './Monitor.css';

interface MonitorProps {
  imageUrl: string;
  imageAlt?: string;
  title?: string;
}

const Monitor: React.FC<MonitorProps> = ({ 
  imageUrl, 
  imageAlt = "功能演示", 
  title = "核心功能演示" 
}) => {
  // 添加电源开关状态
  const [isPowerOn, setIsPowerOn] = useState(true);
  // 跟踪图片高度
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  // 切换电源状态
  const togglePower = () => {
    setIsPowerOn(!isPowerOn);
  };

  // 当图片加载完成时，存储它的高度
  useEffect(() => {
    const updateHeight = () => {
      if (imageRef.current) {
        setImageHeight(imageRef.current.offsetHeight);
      }
    };

    // 如果图片已经加载了
    if (imageRef.current && imageRef.current.complete) {
      updateHeight();
    }

    // 图片加载完成后设置高度
    const currentImage = imageRef.current;
    if (currentImage) {
      currentImage.addEventListener('load', updateHeight);
      
      return () => {
        currentImage.removeEventListener('load', updateHeight);
      };
    }
  }, [imageUrl]);

  return (
    <div className="monitor-wrapper">
      <div className="simple-monitor">
        {/* 显示器框架 */}
        <div className="monitor-frame">
          {/* 屏幕内容 - 保持尺寸一致 */}
          <div className={`monitor-screen ${isPowerOn ? 'power-on' : 'power-off'}`}>
            {/* 无论开关状态如何，都保持图片在DOM中，只是在关闭时隐藏它 */}
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt={imageAlt} 
              className={`demo-gif ${!isPowerOn ? 'invisible' : ''}`}
              style={{ display: isPowerOn ? 'block' : 'none' }}
            />
            
            {/* 关闭时显示黑屏，高度与图片完全一致 */}
            {!isPowerOn && (
              <div 
                className="black-screen" 
                style={{ height: `${imageHeight}px` }}
              ></div>
            )}
          </div>
        </div>
        
        {/* 底部控制区域 - 包含铭牌和电源按钮 */}
        <div className="monitor-controls">
          {/* 铭牌 */}
          <div className="brand-badge">
            <a href="https://github.com/JSREI" target="_blank" rel="noopener noreferrer" className="brand-link">
              JSREI
            </a>
            <span> - </span>
            <a href="https://github.com/JSREI/js-script-hook" target="_blank" rel="noopener noreferrer" className="brand-link">
              SCRIPT HOOK
            </a>
          </div>
          
          {/* 电源按钮 */}
          <button 
            className={`power-button ${isPowerOn ? 'on' : 'off'}`}
            onClick={togglePower}
            aria-label={isPowerOn ? "关闭显示器" : "打开显示器"}
            title={isPowerOn ? "关闭显示器" : "打开显示器"}
          >
            <span className="power-indicator"></span>
          </button>
        </div>
        
        {/* 显示器底座 */}
        <div className="monitor-stand">
          <div className="stand-neck"></div>
          <div className="stand-base"></div>
        </div>
      </div>
    </div>
  );
};

export default Monitor; 
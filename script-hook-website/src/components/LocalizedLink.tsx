import React from 'react';
import { getLocalizedLink } from '../utils/urlUtils';

interface LocalizedLinkProps {
  linkKey: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  title?: string;
  onClick?: () => void;
}

/**
 * 本地化链接组件
 * 根据当前语言环境自动选择合适的链接URL
 */
const LocalizedLink: React.FC<LocalizedLinkProps> = ({
  linkKey,
  children,
  className,
  target = '_blank',
  rel = 'noopener noreferrer',
  title,
  onClick
}) => {
  const url = getLocalizedLink(linkKey);
  
  // 如果没有找到对应的链接，则返回一个span而不是a标签
  if (!url) {
    console.warn(`No URL found for key: ${linkKey}`);
    return <span className={className}>{children}</span>;
  }
  
  // 使用本地化链接创建a标签
  return (
    <a
      href={url}
      className={className}
      target={target}
      rel={rel}
      title={title}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default LocalizedLink; 
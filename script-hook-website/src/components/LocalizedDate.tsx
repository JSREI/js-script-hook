import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, getRelativeTime } from '../utils/dateUtils';

interface LocalizedDateProps {
  date: Date | string | number;
  format?: 'full' | 'short' | 'relative';
  className?: string;
  showTime?: boolean;
}

/**
 * 本地化日期组件
 * 支持完整日期、短日期和相对时间显示
 */
const LocalizedDate: React.FC<LocalizedDateProps> = ({
  date,
  format = 'full',
  className,
  showTime = false
}) => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'zh' ? 'zh-CN' : 'en-US';
  
  let formattedDate: string;
  
  try {
    const dateObj = new Date(date);
    
    if (format === 'relative') {
      formattedDate = getRelativeTime(dateObj);
    } else {
      // 选择日期格式化选项
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: format === 'full' ? 'long' : 'short',
        day: 'numeric'
      };
      
      // 如果需要显示时间
      if (showTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }
      
      formattedDate = new Intl.DateTimeFormat(locale, options).format(dateObj);
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    formattedDate = new Date(date).toLocaleString();
  }
  
  return <span className={className}>{formattedDate}</span>;
};

export default LocalizedDate; 
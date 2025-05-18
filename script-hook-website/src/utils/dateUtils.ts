import i18next from 'i18next';

/**
 * 根据当前语言格式化日期
 * Format date based on current language
 */
export const formatDate = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  const language = i18next.language.split('-')[0];
  
  try {
    // 使用Intl.DateTimeFormat进行本地化格式化
    return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  } catch (error) {
    // 降级处理，使用基本格式
    return dateObj.toLocaleDateString();
  }
};

/**
 * 根据当前语言获取相对时间描述（例如：3天前）
 * Get relative time description based on current language (e.g., 3 days ago)
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  const language = i18next.language.split('-')[0];
  
  try {
    // 使用Intl.RelativeTimeFormat进行相对时间的本地化
    const rtf = new Intl.RelativeTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', { 
      numeric: 'auto' 
    });
    
    if (diffInSeconds < 60) {
      return rtf.format(-Math.floor(diffInSeconds), 'second');
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
  } catch (error) {
    // 降级处理，返回格式化的日期
    return formatDate(dateObj);
  }
};

/**
 * 本地化数字格式
 * Localize number format
 */
export const formatNumber = (num: number): string => {
  const language = i18next.language.split('-')[0];
  
  try {
    return new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : 'en-US').format(num);
  } catch (error) {
    return num.toString();
  }
}; 
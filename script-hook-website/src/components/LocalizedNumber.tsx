import React from 'react';
import { useTranslation } from 'react-i18next';

interface LocalizedNumberProps {
  value: number;
  type?: 'decimal' | 'percent' | 'currency' | 'compact';
  currencyCode?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  className?: string;
}

/**
 * 本地化数字组件
 * 支持不同的数字格式化选项和本地化显示
 */
const LocalizedNumber: React.FC<LocalizedNumberProps> = ({
  value,
  type = 'decimal',
  currencyCode = 'USD',
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
  className
}) => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'zh' ? 'zh-CN' : 'en-US';
  
  let formattedValue: string;
  
  try {
    switch (type) {
      case 'percent':
        formattedValue = new Intl.NumberFormat(locale, { 
          style: 'percent',
          minimumFractionDigits,
          maximumFractionDigits
        }).format(value);
        break;
        
      case 'currency':
        formattedValue = new Intl.NumberFormat(locale, { 
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits,
          maximumFractionDigits
        }).format(value);
        break;
        
      case 'compact':
        formattedValue = new Intl.NumberFormat(locale, { 
          notation: 'compact',
          compactDisplay: 'short',
          minimumFractionDigits,
          maximumFractionDigits
        }).format(value);
        break;
        
      case 'decimal':
      default:
        formattedValue = new Intl.NumberFormat(locale, {
          minimumFractionDigits,
          maximumFractionDigits
        }).format(value);
        break;
    }
  } catch (error) {
    console.error('Number formatting error:', error);
    formattedValue = value.toString();
  }
  
  return <span className={className}>{formattedValue}</span>;
};

export default LocalizedNumber; 
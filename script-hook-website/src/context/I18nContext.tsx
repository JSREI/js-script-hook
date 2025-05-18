import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface I18nContextType {
  /**
   * 当前语言
   */
  currentLanguage: string;
  
  /**
   * 支持的语言列表
   */
  supportedLanguages: { code: string; name: string }[];
  
  /**
   * 切换语言
   */
  changeLanguage: (lang: string) => Promise<void>;
  
  /**
   * 语言是否正在切换中
   */
  isSwitching: boolean;
  
  /**
   * 设置文档方向 (RTL/LTR)
   */
  setDocumentDirection: (lang: string) => void;
}

// 支持的语言列表
export const supportedLanguages = [
  { code: 'zh', name: '简体中文' },
  { code: 'en', name: 'English' }
];

// 创建上下文
const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * i18n上下文提供者组件
 */
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [isSwitching, setIsSwitching] = useState(false);
  
  // 获取当前语言
  const currentLanguage = i18n.language.split('-')[0];
  
  /**
   * 设置文档的方向 (RTL/LTR)
   * 如果将来添加阿拉伯语等RTL语言，这将非常有用
   */
  const setDocumentDirection = useCallback((lang: string) => {
    // 目前只有中文和英文，都是LTR方向
    document.documentElement.setAttribute('dir', 'ltr');
    
    // 如果未来添加RTL语言，如阿拉伯语，可以这样处理:
    // const rtlLanguages = ['ar', 'he', 'ur'];
    // document.documentElement.setAttribute('dir', rtlLanguages.includes(lang) ? 'rtl' : 'ltr');
  }, []);
  
  /**
   * 切换语言并更新相关设置
   */
  const changeLanguage = useCallback(async (lang: string) => {
    if (lang === currentLanguage || isSwitching) {
      return;
    }
    
    setIsSwitching(true);
    
    try {
      // 存储用户语言选择
      localStorage.setItem('language', lang);
      
      // 切换i18next语言
      await i18n.changeLanguage(lang);
      
      // 更新HTML标签
      document.documentElement.setAttribute('lang', lang);
      
      // 设置文档方向
      setDocumentDirection(lang);
      
      // 更新社交媒体元数据
      const updateMetaTag = (id: string, attr: string, value: string) => {
        const tag = document.getElementById(id);
        if (tag) tag.setAttribute(attr, value);
      };
      
      // 使用新语言的翻译更新元数据
      const t = i18n.getFixedT(lang);
      document.title = t('html.title');
      
      updateMetaTag('meta-description', 'content', t('html.description'));
      updateMetaTag('og-title', 'content', t('html.title'));
      updateMetaTag('og-description', 'content', t('html.description'));
      updateMetaTag('twitter-title', 'content', t('html.title'));
      updateMetaTag('twitter-description', 'content', t('html.description'));
      
      // 更新noscript消息
      const noscriptElement = document.getElementById('noscript-message');
      if (noscriptElement) {
        noscriptElement.textContent = t('html.noscript');
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsSwitching(false);
    }
  }, [currentLanguage, i18n, isSwitching, setDocumentDirection]);
  
  // 初始化时设置文档方向
  useEffect(() => {
    setDocumentDirection(currentLanguage);
  }, [currentLanguage, setDocumentDirection]);

  // 提供上下文值
  const contextValue: I18nContextType = {
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    isSwitching,
    setDocumentDirection
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

/**
 * 使用i18n上下文的Hook
 */
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export default I18nContext; 
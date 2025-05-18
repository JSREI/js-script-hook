import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import WorkflowDiagram from './components/WorkflowDiagram';
import FeatureTree from './components/FeatureTree';
import DetailedFeatures from './components/DetailedFeatures';
import Installation from './components/Installation';
import Support from './components/Support';
import CommunityGroup from './components/CommunityGroup';
import Footer from './components/Footer';
import GitHubStarButton from './components/GitHubStarButton';
import { I18nProvider } from './context/I18nContext';
import './App.css';

// 滚动恢复组件，防止路由切换时的滚动问题
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    // 只有当没有hash值或hash值为空时，才滚动到顶部
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  
  return null;
};

// 封装主页面内容为一个组件
const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();

  // 更新文档标题和meta描述 - 重构后，将由I18nContext处理
  useEffect(() => {
    document.title = t('html.title');
    
    // 更新meta描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('html.description'));
    }

    // 更新noscript消息
    const noscriptElement = document.getElementById('noscript-message');
    if (noscriptElement) {
      noscriptElement.textContent = t('html.noscript');
    }

    // 更新社交媒体元数据
    const updateMetaTag = (id: string, attr: string, value: string) => {
      const tag = document.getElementById(id);
      if (tag) tag.setAttribute(attr, value);
    };
    
    updateMetaTag('og-title', 'content', t('html.title'));
    updateMetaTag('og-description', 'content', t('html.description'));
    updateMetaTag('twitter-title', 'content', t('html.title'));
    updateMetaTag('twitter-description', 'content', t('html.description'));

    // 更新语言标签
    document.documentElement.setAttribute('lang', i18n.language);
  }, [t, i18n.language]);

  return (
    <>
      <GitHubStarButton />
      <Header />
      <Hero />
      <Features />
      <WorkflowDiagram />
      <FeatureTree />
      <DetailedFeatures />
      <Installation />
      <Support />
      <CommunityGroup />
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  // 禁用滚动恢复
  useEffect(() => {
    // 如果存在 history.scrollRestoration 属性，则禁用自动滚动恢复
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // 防止滚动跳跃
    let isScrolling = false;
    let scrollTimeout: number | null = null;
    
    const handleScroll = () => {
      isScrolling = true;
      
      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout);
      }
    };
  }, []);

  return (
    <I18nProvider>
      <Router>
        <div className="app">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* 添加其他路由，如果未来需要子页面 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </I18nProvider>
  );
};

export default App; 
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  );
};

export default App; 
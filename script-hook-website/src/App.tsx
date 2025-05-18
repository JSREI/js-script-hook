import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import WorkflowDiagram from './components/WorkflowDiagram';
import FeatureTree from './components/FeatureTree';
import DetailedFeatures from './components/DetailedFeatures';
import Installation from './components/Installation';
import Support from './components/Support';
import StarHistory from './components/StarHistory';
import CommunityGroup from './components/CommunityGroup';
import Footer from './components/Footer';
import GitHubStarButton from './components/GitHubStarButton';
import './App.css';

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
  return (
    <Router>
      <div className="app">
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
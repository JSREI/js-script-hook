import React from 'react';
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

const App: React.FC = () => {
  return (
    <div className="app">
      <GitHubStarButton />
      <Header />
      <Hero />
      <Features />
      <WorkflowDiagram />
      <FeatureTree />
      <DetailedFeatures />
      <Installation />
      <Support />
      <StarHistory />
      <CommunityGroup />
      <Footer />
    </div>
  );
};

export default App; 
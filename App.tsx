import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Area from './components/Area';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Pericias from './components/Pericias';

const App: React.FC = () => {
  const [page, setPage] = useState<'home' | 'pericias'>('home');

  const handleNavigate = (targetPage: 'home' | 'pericias') => {
    setPage(targetPage);
    window.scrollTo(0, 0);
  }

  return (
    <div className="bg-brand-dark text-brand-light min-h-screen font-sans">
      <Header 
        currentPage={page}
        onNavigateHome={() => handleNavigate('home')}
        onNavigatePericias={() => handleNavigate('pericias')}
      />
      {page === 'home' ? (
        <>
          <main>
            <Hero />
            <About />
            <Services />
            <Area />
            <Contact />
          </main>
          <Footer />
        </>
      ) : (
        <Pericias />
      )}
    </div>
  );
};

export default App;

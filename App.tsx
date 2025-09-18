import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Area from './components/Area';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Pericias from './components/Pericias';
import type { Pericia } from './types';
import { dbController } from './api/dbController';

const App: React.FC = () => {
  const [page, setPage] = useState<'home' | 'pericias'>('home');
  const [periciasData, setPericiasData] = useState<Pericia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNavigateHome = () => {
    setPage('home');
    window.scrollTo(0, 0);
  }

  const handleNavigatePericias = async () => {
    setPage('pericias');
    window.scrollTo(0, 0);
    setIsLoading(true);
    setError(null);
    try {
      await dbController.connect();
      const data = await dbController.fetchPericias();
      setPericiasData(data);
    } catch (err) {
      setError('Falha ao buscar os dados das perícias.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-brand-dark text-brand-light min-h-screen font-sans">
      <Header 
        currentPage={page}
        onNavigateHome={handleNavigateHome}
        onNavigatePericias={handleNavigatePericias}
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
        <Pericias pericias={periciasData} isLoading={isLoading} error={error} />
      )}
    </div>
  );
};

export default App;

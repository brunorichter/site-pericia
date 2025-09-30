import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Area from './components/Area';
import Contact from './components/Contact';

const HomePage: React.FC = () => {
  return (
    <div className="bg-brand-dark text-brand-light min-h-screen font-sans">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Area />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <HomePage />
    </React.StrictMode>
  );
}
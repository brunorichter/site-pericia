import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Area from '../components/Area';
import Contact from '../components/Contact';

export default function HomePage() {
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
}
import React, { useState, useEffect } from 'react';
import { LOGO_BASE64 } from '../constants';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    setIsHomePage(window.location.pathname === '/');
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll(); 
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-dark shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center space-x-3 cursor-pointer">
          <img src={LOGO_BASE64} alt="Richter Logo" className="h-12 w-auto" />
        </a>
        
        {isHomePage && (
          <nav className="hidden md:flex space-x-8">
            <a href="#sobre" className="text-brand-gray hover:text-brand-cyan-400 transition duration-300">Sobre</a>
            <a href="#servicos" className="text-brand-gray hover:text-brand-cyan-400 transition duration-300">Serviços</a>
            <a href="#atuacao" className="text-brand-gray hover:text-brand-cyan-400 transition duration-300">Área de Atuação</a>
            <a href="#contato" className="text-brand-gray hover:text-brand-cyan-400 transition duration-300">Contato</a>
          </nav>
        )}

        <a 
          href="/pericias"
          className="hidden md:inline-block bg-brand-cyan-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-cyan-600 transition duration-300 shadow-md"
        >
          Login
        </a>
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import { LOGO_BASE64 } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark-secondary border-t border-gray-800">
      <div className="container mx-auto px-6 py-8 text-center text-brand-gray">
        <img src={LOGO_BASE64} alt="Richter Logo" className="h-12 w-auto mx-auto mb-4 opacity-50" />
        <p>Richter Perícia Técnica em Engenharia Elétrica</p>
        <p>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;

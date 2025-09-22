import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center bg-cover bg-center" style={{backgroundImage: "linear-gradient(rgba(26, 32, 44, 0.8), rgba(26, 32, 44, 0.8)), url('https://picsum.photos/id/1018/1600/900')"}}>
      <div className="container mx-auto px-6 z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 animate-fade-in-down">
          Perícia Técnica Judicial em Engenharia Elétrica
        </h1>
        <p className="text-lg md:text-xl text-brand-light mb-8 max-w-3xl mx-auto animate-fade-in-up">
          Análises precisas e laudos técnicos imparciais para a resolução de conflitos judiciais e extrajudiciais no Rio Grande do Sul.
        </p>
        <a 
          href="#contato" 
          className="bg-brand-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-cyan-600 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Entre em Contato
        </a>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-brand-dark to-transparent"></div>
    </section>
  );
};

export default Hero;

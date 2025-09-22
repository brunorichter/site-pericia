import React from 'react';
import { LOGO_BASE64 } from '../constants';

const About: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-brand-dark-secondary">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-white mb-4">Compromisso com a Verdade e a Técnica</h2>
            <div className="w-24 h-1 bg-brand-cyan-500 mb-6"></div>
            <p className="text-brand-gray mb-4">
              Atuando como perito judicial e assistente técnico, nosso trabalho é pautado pela imparcialidade, rigor técnico e profundo conhecimento em engenharia elétrica. A missão é fornecer ao Judiciário e às partes envolvidas subsídios técnicos claros, objetivos e fundamentados para a correta tomada de decisão.
            </p>
            <p className="text-brand-gray">
              Com vasta experiência em sistemas elétricos de potência, instalações industriais e prediais, e normas regulamentadoras, oferecemos um serviço de excelência, focado em elucidar as causas e consequências de eventos complexos, garantindo a justiça e a segurança.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center items-center p-8 bg-brand-dark rounded-lg shadow-2xl">
            <img src={LOGO_BASE64} alt="Richter Logo" className="max-w-xs w-full"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
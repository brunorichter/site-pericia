import React from 'react';
import { MapPinIcon } from './Icons';

const Area = (): JSX.Element => {
  return (
    <section id="atuacao" className="py-20 bg-brand-dark-secondary">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center text-brand-cyan-400 mb-6">
            <MapPinIcon />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Atuação em Todo o Rio Grande do Sul</h2>
          <div className="w-24 h-1 bg-brand-cyan-500 mx-auto mb-6"></div>
          <p className="text-lg text-brand-gray">
            Com base no centro do Rio Grande do Sul, oferecemos nossos serviços de perícia e assistência técnica em engenharia elétrica para todas as comarcas do estado, garantindo agilidade e presença onde for necessário.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Area;
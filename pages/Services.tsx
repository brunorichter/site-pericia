
import React from 'react';
import { FileTextIcon, ZapIcon, SearchIcon, ShieldIcon, BriefcaseIcon, CheckSquareIcon } from '../components/Icons';

const services = [
  {
    icon: <FileTextIcon />,
    title: "Laudos Técnicos Judiciais",
    description: "Elaboração de laudos periciais detalhados e conclusivos em processos que demandam conhecimento técnico em engenharia elétrica."
  },
  {
    icon: <BriefcaseIcon />,
    title: "Assistência Técnica em Processos",
    description: "Acompanhamento completo do processo, formulação de quesitos, manifestação sobre laudos e suporte técnico para advogados e partes."
  },
  {
    icon: <ZapIcon />,
    title: "Análise de Falhas e Sinistros",
    description: "Investigação de causas de acidentes elétricos, queima de equipamentos, incêndios e interrupções de energia."
  },
  {
    icon: <SearchIcon />,
    title: "Vistorias e Inspeções",
    description: "Inspeção de instalações elétricas, medições de grandezas e verificação de conformidade com normas técnicas e regulamentadoras (NR-10, NBRs)."
  },
  {
    icon: <CheckSquareIcon />,
    title: "Pareceres Técnicos Extrajudiciais",
    description: "Elaboração de pareceres para mediações, arbitragens e para embasar decisões antes da judicialização de um conflito."
  },
  {
    icon: <ShieldIcon />,
    title: "Consultoria em Segurança Elétrica",
    description: "Análise de riscos, adequação à NR-10 e implementação de medidas de proteção para ambientes industriais e comerciais."
  },
];

const Services: React.FC = () => {
  return (
    <section id="servicos" className="py-20 bg-brand-dark">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Nossas Soluções</h2>
        <div className="w-24 h-1 bg-brand-cyan-500 mx-auto mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-brand-dark-secondary p-8 rounded-lg shadow-lg text-left transform hover:-translate-y-2 transition duration-300 border border-transparent hover:border-brand-cyan-500">
              <div className="text-brand-cyan-400 mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-brand-gray">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

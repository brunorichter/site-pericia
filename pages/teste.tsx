import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Area from '../components/Area';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import DetalhesModal from '../components/DetalhesModal';
import Pericias from '../components/Pericias';
import {
  MapPinIcon,
  FileTextIcon,
  ZapIcon,
  SearchIcon,
  ShieldIcon,
  BriefcaseIcon,
  CheckSquareIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  XIcon,
} from '../components/Icons';
import type { JudicialProcess } from '../types';
import { ProcessStatus, JusticeType, PericiaType } from '../types';

const samplePericia: JudicialProcess = {
  id: '1',
  processNumber: '0001234-56.2024.8.21.7000',
  plaintiff: 'Empresa Exemplo Ltda',
  defendant: 'Ricardo Lima',
  city: 'Porto Alegre',
  status: ProcessStatus.ELABORACAO_LAUDO,
  justiceType: JusticeType.PARTICULAR,
  periciaType: PericiaType.LOCAL,
  startDate: '2025-10-01',
  caseValue: 125000,
  feesCharged: [
    { id: 'fee-1', date: '2025-10-05', amount: 12000 },
  ],
  feesReceived: [
    { id: 'payment-1', date: '2025-10-15', amount: 10000, taxes: 1000, total: 11000, source: 'Depósito Bancário' },
  ],
  description: 'Processo de demonstração para verificar o comportamento dos componentes de perícia e modal de detalhes.',
};

const icons = [
  { Component: MapPinIcon, label: 'MapPinIcon' },
  { Component: FileTextIcon, label: 'FileTextIcon' },
  { Component: ZapIcon, label: 'ZapIcon' },
  { Component: SearchIcon, label: 'SearchIcon' },
  { Component: ShieldIcon, label: 'ShieldIcon' },
  { Component: BriefcaseIcon, label: 'BriefcaseIcon' },
  { Component: CheckSquareIcon, label: 'CheckSquareIcon' },
  { Component: MailIcon, label: 'MailIcon' },
  { Component: PhoneIcon, label: 'PhoneIcon' },
  { Component: PlusIcon, label: 'PlusIcon' },
  { Component: XIcon, label: 'XIcon' },
];

export default function TestePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-brand-dark text-brand-light min-h-screen font-sans">
      <Header />

      <div className="pt-24">
        <section className="container mx-auto px-6 py-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-brand-cyan-400 uppercase tracking-[0.3em] text-sm mb-4">Página de Teste</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Demonstração de Componentes</h1>
            <p className="text-brand-gray text-lg sm:text-xl">
              Esta página reúne os componentes da pasta <code className="text-brand-cyan-300">components</code> para facilitar a visualização e testes rápidos.
            </p>
          </div>
        </section>

        <Hero />
        <About />
        <Services />
        <Area />
        <Contact />

        <section className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Ícones do Sistema</h2>
              <p className="text-brand-gray">Exemplo de todos os ícones exportados em <code className="text-brand-cyan-300">components/Icons.tsx</code>.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {icons.map(({ Component, label }) => (
                <div key={label} className="rounded-3xl border border-gray-700/60 bg-brand-dark-secondary p-6 text-center">
                  <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gray/10 text-brand-cyan-400">
                    <Component />
                  </div>
                  <p className="text-sm text-brand-light">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="rounded-3xl border border-gray-700/60 bg-brand-dark-secondary p-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Demonstração da Modal de Detalhes</h2>
                <p className="text-brand-gray">Clique no botão abaixo para abrir o componente <code className="text-brand-cyan-300">DetalhesModal</code>.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-3 bg-brand-cyan-500 hover:bg-brand-cyan-600 text-white font-semibold py-3 px-6 rounded-full transition"
              >
                Abrir Modal
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-gray-700/50 bg-brand-dark p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Dados de Exemplo</h3>
                <ul className="space-y-3 text-brand-gray text-sm">
                  <li><strong>Processo:</strong> {samplePericia.processNumber}</li>
                  <li><strong>Autor:</strong> {samplePericia.plaintiff}</li>
                  <li><strong>Réu:</strong> {samplePericia.defendant}</li>
                  <li><strong>Cidade:</strong> {samplePericia.city}</li>
                  <li><strong>Status:</strong> {samplePericia.status}</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-gray-700/50 bg-brand-dark p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Campos de Demonstração</h3>
                <p className="text-brand-gray text-sm leading-relaxed">
                  A modal permite visualizar e editar os campos básicos da perícia, incluindo descrição, valores e status. Use o botão abaixo para abrir e testar a interação.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Demonstração de Perícias</h2>
            <p className="text-brand-gray">O componente <code className="text-brand-cyan-300">Pericias</code> também está incluso para mostrar a tabela e a ação de ver detalhes.</p>
          </div>
          <Pericias pericias={[samplePericia]} isLoading={false} error={null} />
        </section>
      </div>

      <Footer />

      {showModal && (
        <DetalhesModal
          pericia={samplePericia}
          onClose={() => setShowModal(false)}
          onSave={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

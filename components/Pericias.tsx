
import React, { useState, useEffect } from 'react';
import { PlusIcon } from './Icons';
import DetalhesModal from './DetalhesModal';
import type { Pericia } from '../types';

interface PericiasProps {
  pericias: Pericia[];
  isLoading: boolean;
  error: string | null;
}

export const getStatusClass = (status: string) => {
  switch (status) {
    case 'Em Andamento':
      return 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30';
    case 'Concluído':
      return 'bg-green-400/20 text-green-300 border border-green-400/30';
    case 'Pendente':
      return 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30';
    case 'Arquivado':
      return 'bg-gray-400/20 text-gray-300 border border-gray-400/30';
    default:
      return 'bg-gray-200/20 text-gray-300 border border-gray-200/30';
  }
};

const Pericias: React.FC<PericiasProps> = ({ pericias, isLoading, error }) => {
  const [periciasList, setPericiasList] = useState<Pericia[]>(pericias);
  const [selectedPericia, setSelectedPericia] = useState<Pericia | null>(null);

  useEffect(() => {
    setPericiasList(pericias);
  }, [pericias]);

  const handleOpenModal = (pericia: Pericia) => {
    setSelectedPericia(pericia);
  };

  const handleCloseModal = () => {
    setSelectedPericia(null);
  };

  const handleSavePericia = (updatedPericia: Pericia) => {
    // This updates the local state for immediate feedback.
    // In a real app, you'd also send this update to the backend.
    const updatedList = periciasList.map(p => (p.id === updatedPericia.id ? updatedPericia : p));
    setPericiasList(updatedList);
  };
  
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={5} className="text-center p-8 text-brand-gray">
            <div className="flex justify-center items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-brand-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Conectando ao banco e buscando dados...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={5} className="text-center p-8 text-red-400">
            {error}
          </td>
        </tr>
      );
    }
    
    if (periciasList.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center p-8 text-brand-gray">
            Nenhuma perícia encontrada. A tabela está vazia.
          </td>
        </tr>
      );
    }

    return periciasList.map((pericia) => (
      <tr key={pericia.id} className="hover:bg-gray-800/60 transition-colors duration-200">
        <td className="p-4 text-brand-gray font-mono text-sm">{pericia.id}</td>
        <td className="p-4 text-brand-light text-sm">{pericia.cliente}</td>
        <td className="p-4">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(pericia.status)}`}>
            {pericia.status}
          </span>
        </td>
        <td className="p-4 text-brand-gray text-sm">{new Date(pericia.abertura).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
        <td className="p-4 text-center">
          <button 
            onClick={() => handleOpenModal(pericia)}
            className="text-brand-cyan-400 hover:text-white font-semibold py-1 px-3 rounded-md transition duration-300 hover:bg-brand-cyan-500/50 border border-brand-cyan-400/50 hover:border-brand-cyan-400 text-sm"
          >
            Ver Detalhes
          </button>
        </td>
      </tr>
    ));
  };


  return (
    <>
      <main className="container mx-auto px-6 py-28 md:py-32">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Painel de Perícias</h1>
          <button 
            title="Adicionar Nova Perícia"
            className="bg-brand-cyan-500 hover:bg-brand-cyan-600 text-white rounded-full p-2 transition-all duration-300 shadow-lg transform hover:scale-110"
            onClick={() => alert('Funcionalidade para adicionar nova perícia a ser implementada.')}
          >
            <PlusIcon />
          </button>
        </div>
        <div className="w-24 h-1 bg-brand-cyan-500 mb-8"></div>
        
        <div className="bg-brand-dark-secondary rounded-lg shadow-lg overflow-hidden border border-gray-700/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="p-4 font-semibold text-brand-light tracking-wider uppercase text-xs">Nº Processo</th>
                  <th className="p-4 font-semibold text-brand-light tracking-wider uppercase text-xs">Cliente</th>
                  <th className="p-4 font-semibold text-brand-light tracking-wider uppercase text-xs">Status</th>
                  <th className="p-4 font-semibold text-brand-light tracking-wider uppercase text-xs">Data de Abertura</th>
                  <th className="p-4 font-semibold text-brand-light tracking-wider uppercase text-xs text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {renderTableContent()}
              </tbody>
            </table>
          </div>
        </div>
        {!isLoading && !error && periciasList.length > 0 && (
            <p className="text-center text-brand-gray text-sm mt-8">
              Dados carregados do sistema.
            </p>
        )}
      </main>

      {selectedPericia && (
        <DetalhesModal 
          pericia={selectedPericia}
          onClose={handleCloseModal}
          onSave={handleSavePericia}
        />
      )}
    </>
  );
};

export default Pericias;

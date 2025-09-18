
import React, { useState } from 'react';
import { PlusIcon } from './Icons';
import DetalhesModal from './DetalhesModal';

export interface Pericia {
  id: string;
  cliente: string;
  status: 'Em Andamento' | 'Concluído' | 'Pendente' | 'Arquivado';
  abertura: string;
  autor: string;
  reu: string;
  cidade: string;
  vara: string;
  descricao: string;
  valorCausa: number;
  honorarios: number;
  pagamentosRecebidos: number;
}

const mockPericias: Pericia[] = [
  { 
    id: '5050706-41.2022.8.21.0010', 
    cliente: 'Tribunal de Justiça do RS', 
    status: 'Em Andamento', 
    abertura: '2023-10-26',
    autor: 'João da Silva',
    reu: 'Companhia de Energia Elétrica S.A.',
    cidade: 'Porto Alegre',
    vara: '1ª Vara Cível',
    descricao: 'Análise de medição de consumo de energia em unidade residencial após alegação de faturamento incorreto.',
    valorCausa: 15000.00,
    honorarios: 3500.00,
    pagamentosRecebidos: 1750.00
  },
  { 
    id: '5001234-56.2023.8.21.0008', 
    cliente: 'Empresa de Energia XYZ', 
    status: 'Concluído', 
    abertura: '2023-09-15',
    autor: 'Maria Oliveira',
    reu: 'Construtora Predial Ltda.',
    cidade: 'Canoas',
    vara: '3ª Vara Cível',
    descricao: 'Verificação de nexo causal entre obra civil e danos à rede de distribuição subterrânea.',
    valorCausa: 120000.00,
    honorarios: 8000.00,
    pagamentosRecebidos: 8000.00
  },
  { 
    id: '5098765-43.2023.8.21.0019', 
    cliente: 'Advocacia & Associados', 
    status: 'Concluído', 
    abertura: '2023-08-01',
    autor: 'Carlos Pereira',
    reu: 'Seguradora Confiança S.A.',
    cidade: 'Novo Hamburgo',
    vara: '2ª Vara Empresarial',
    descricao: 'Investigação de sinistro de incêndio em instalação industrial para apuração de causa elétrica.',
    valorCausa: 500000.00,
    honorarios: 15000.00,
    pagamentosRecebidos: 15000.00
  },
  { 
    id: '5011223-34.2023.8.21.0023', 
    cliente: 'Condomínio Residencial Central', 
    status: 'Pendente', 
    abertura: '2023-11-05',
    autor: 'Condomínio Residencial Central',
    reu: 'Instaladora Elétrica Rápida',
    cidade: 'São Leopoldo',
    vara: 'Vara Única',
    descricao: 'Auditoria de conformidade da instalação elétrica do condomínio com as normas NBR 5410.',
    valorCausa: 25000.00,
    honorarios: 4500.00,
    pagamentosRecebidos: 0.00
  },
  { 
    id: '5022334-45.2022.8.21.0021', 
    cliente: 'Indústria Metalúrgica do Sul', 
    status: 'Arquivado', 
    abertura: '2022-07-20',
    autor: 'Ministério Público do Trabalho',
    reu: 'Indústria Metalúrgica do Sul',
    cidade: 'Caxias do Sul',
    vara: '1ª Vara do Trabalho',
    descricao: 'Análise de acidente de trabalho envolvendo choque elétrico e conformidade com a NR-10.',
    valorCausa: 75000.00,
    honorarios: 6000.00,
    pagamentosRecebidos: 6000.00
  },
  { 
    id: '5033445-56.2023.8.21.0048', 
    cliente: 'Tribunal de Justiça do RS', 
    status: 'Em Andamento', 
    abertura: '2023-11-01',
    autor: 'José Santos',
    reu: 'Fabricante de Equipamentos Eletrônicos Ltda.',
    cidade: 'Pelotas',
    vara: '4ª Vara Cível',
    descricao: 'Análise de falha em equipamento eletrônico de alto valor, supostamente causada por defeito de fabricação.',
    valorCausa: 45000.00,
    honorarios: 5000.00,
    pagamentosRecebidos: 2500.00
  },
];

const getStatusClass = (status: string) => {
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

const Pericias: React.FC = () => {
  const [selectedPericia, setSelectedPericia] = useState<Pericia | null>(null);

  const handleOpenModal = (pericia: Pericia) => {
    setSelectedPericia(pericia);
  };

  const handleCloseModal = () => {
    setSelectedPericia(null);
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
                {mockPericias.map((pericia) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-center text-brand-gray text-sm mt-8">
          Esta é uma visualização de exemplo. Os dados são fictícios.
        </p>
      </main>

      {selectedPericia && (
        <DetalhesModal 
          pericia={selectedPericia}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Pericias;
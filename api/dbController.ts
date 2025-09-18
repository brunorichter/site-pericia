import type { Pericia } from '../types';

// This is a fictitious data source, simulating a database fetch.
const mockDatabaseData: Pericia[] = [
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

/**
 * Simulates connecting to a database and fetching records.
 * In a real application, this would be an API call to a backend server.
 * The .env file would be read by the backend server, not the frontend.
 */
export const dbController = {
  connect: (): Promise<void> => {
    console.log('Simulating database connection using settings from .env...');
    return new Promise(resolve => setTimeout(() => {
      console.log('Connection successful.');
      resolve();
    }, 500));
  },
  fetchPericias: (): Promise<Pericia[]> => {
    console.log('Fetching data from "pericias" table...');
    return new Promise(resolve => setTimeout(() => {
      console.log('Data fetched.');
      resolve(mockDatabaseData);
    }, 1500));
  }
};

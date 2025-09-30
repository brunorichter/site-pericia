import type { NextApiRequest, NextApiResponse } from 'next';
import type { Pericia } from '../../types';

const periciasMockData: Pericia[] = [
  {
    id: '00123/2023',
    cliente: 'Empresa de Energia Elétrica S.A.',
    status: 'Em Andamento',
    abertura: '2023-10-26',
    autor: 'João da Silva',
    reu: 'Companhia de Seguros Confiança',
    cidade: 'Porto Alegre',
    vara: '10ª Vara Cível',
    descricao: 'Análise de falha em transformador de distribuição que resultou em interrupção de fornecimento para área industrial. A perícia visa determinar a causa raiz da falha, se por defeito de fabricação, manutenção inadequada ou fator externo.',
    valorCausa: 150000.00,
    honorarios: 7500.00,
    pagamentosRecebidos: 3750.00,
  },
  {
    id: '00456/2024',
    cliente: 'Construtora Edificar Ltda.',
    status: 'Concluído',
    abertura: '2024-01-15',
    autor: 'Condomínio Residencial Flores',
    reu: 'Construtora Edificar Ltda.',
    cidade: 'Canoas',
    vara: '3ª Vara Cível',
    descricao: 'Vistoria em instalações elétricas de áreas comuns de condomínio recém-entregue. Verificação de conformidade com o projeto original e com as normas NBR 5410. Laudo concluído e entregue em juízo.',
    valorCausa: 45000.00,
    honorarios: 4000.00,
    pagamentosRecebidos: 4000.00,
  },
  {
    id: '00789/2024',
    cliente: 'Indústria Metalúrgica Pesada S.A.',
    status: 'Pendente',
    abertura: '2024-03-02',
    autor: 'Pedro Antunes (ex-funcionário)',
    reu: 'Indústria Metalúrgica Pesada S.A.',
    cidade: 'São Leopoldo',
    vara: '2ª Vara do Trabalho',
    descricao: 'Perícia de periculosidade em ambiente industrial. Análise das atividades do reclamante e exposição a riscos elétricos, conforme NR-10 e NR-16. Aguardando agendamento de vistoria técnica no local.',
    valorCausa: 80000.00,
    honorarios: 6200.00,
    pagamentosRecebidos: 0.00,
  },
   {
    id: '01011/2022',
    cliente: 'Shopping Center Metrópole',
    status: 'Arquivado',
    abertura: '2022-08-20',
    autor: 'Lojista A',
    reu: 'Shopping Center Metrópole',
    cidade: 'Porto Alegre',
    vara: '15ª Vara Cível',
    descricao: 'Disputa sobre medição de consumo de energia elétrica em loja do shopping. Perícia concluiu que a medição estava correta. Processo arquivado após acordo entre as partes.',
    valorCausa: 25000.00,
    honorarios: 2500.00,
    pagamentosRecebidos: 2500.00,
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pericia[]>
) {
  // Simulate network delay
  setTimeout(() => {
    res.status(200).json(periciasMockData);
  }, 1000);
}
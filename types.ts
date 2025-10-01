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

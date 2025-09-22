export type PericiaStatus =
  | 'Aguardando'
  | 'Fazer Laudo'
  | 'Fazer Honorários'
  | 'Contestação Valor'
  | 'Esclarecimentos'
  | 'Concluído'
  | 'Arquivado';

export interface Pericia {
  id: string;
  cliente: string;
  status: PericiaStatus;
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

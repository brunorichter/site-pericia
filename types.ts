// FIX: Removed incorrect self-import of `ProcessStatus`.
export enum ProcessStatus {
  ENVIAR_PROPOSTA = 'Enviar Proposta',
  ATRASO = 'Atraso',
  AGUARDANDO_RESPOSTA = 'Aguardando Resposta',
  ELABORACAO_LAUDO = 'Elaboração Laudo',
  PERICIA_MARCADA = 'Perícia Marcada',
  AGUARDANDO_PAGAMENTO = 'Aguardando Pagamento',
  ARQUIVADO = 'Arquivado',
}

export enum JusticeType {
  AJG = 'AJG',
  PARTICULAR = 'Particular',
}

export enum PericiaType {
  LOCAL = 'Local',
  DOCUMENTAL = 'Documental',
}


export interface FeeProposal {
  id: string;
  date: string;
  amount: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  source: string;
}

export interface JudicialProcess {
  id: string;
  processNumber: string;
  plaintiff: string;
  defendant: string;
  city: string;
  status: ProcessStatus;
  justiceType: JusticeType;
  periciaType: PericiaType;
  startDate: string;
  caseValue: number;
  feesCharged: FeeProposal[];
  feesReceived: Payment[];
  description: string;
}
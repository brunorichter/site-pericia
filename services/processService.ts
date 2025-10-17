import { JudicialProcess, ProcessStatus, FeeProposal, Payment, JusticeType, PericiaType } from '../types';

let mockProcesses: JudicialProcess[] = [
  {
    id: '1',
    processNumber: '001/2023-A',
    plaintiff: 'João da Silva',
    defendant: 'Empresa de Telefonia S.A.',
    city: 'Porto Alegre',
    status: ProcessStatus.ELABORACAO_LAUDO,
    justiceType: JusticeType.PARTICULAR,
    periciaType: PericiaType.DOCUMENTAL,
    startDate: '2023-01-15',
    caseValue: 50000.00,
    feesCharged: [{ id: 'fc1', date: '2023-01-10', amount: 5000.00 }],
    feesReceived: [{ id: 'fr1', date: '2023-02-01', amount: 2500.00, source: 'Adiantamento' }],
    description: 'Perícia técnica para avaliação de falhas na prestação de serviço de internet.'
  },
  {
    id: '2',
    processNumber: '002/2023-B',
    plaintiff: 'Maria Oliveira',
    defendant: 'Construtora Predial Ltda.',
    city: 'Canoas',
    status: ProcessStatus.AGUARDANDO_PAGAMENTO,
    justiceType: JusticeType.PARTICULAR,
    periciaType: PericiaType.LOCAL,
    startDate: '2022-11-20',
    caseValue: 120000.00,
    feesCharged: [{ id: 'fc2', date: '2022-11-15', amount: 8000.00 }],
    feesReceived: [
        { id: 'fr2', date: '2022-12-01', amount: 4000.00, source: 'Primeira parcela' },
        { id: 'fr3', date: '2023-01-05', amount: 4000.00, source: 'Segunda parcela' }
    ],
    description: 'Laudo pericial sobre vícios construtivos em imóvel residencial.'
  },
    {
    id: '3',
    processNumber: '003/2024-C',
    plaintiff: 'Carlos Pereira',
    defendant: 'Banco Financeiro S.A.',
    city: 'São Leopoldo',
    status: ProcessStatus.ENVIAR_PROPOSTA,
    justiceType: JusticeType.AJG,
    periciaType: PericiaType.DOCUMENTAL,
    startDate: '2024-02-10',
    caseValue: 75000.00,
    feesCharged: [
        { id: 'fc3', date: '2024-02-05', amount: 6000.00 },
        { id: 'fc4', date: '2024-02-08', amount: 6500.00 },
    ],
    feesReceived: [],
    description: 'Análise de contratos bancários e juros abusivos.'
  },
   {
    id: '4',
    processNumber: '004/2021-D',
    plaintiff: 'Ana Costa',
    defendant: 'Seguradora Confiança',
    city: 'Novo Hamburgo',
    status: ProcessStatus.ARQUIVADO,
    justiceType: JusticeType.PARTICULAR,
    periciaType: PericiaType.LOCAL,
    startDate: '2021-06-30',
    caseValue: 30000.00,
    feesCharged: [{ id: 'fc5', date: '2021-06-20', amount: 3000.00 }],
    feesReceived: [{ id: 'fr4', date: '2021-07-15', amount: 3000.00, source: 'Pagamento integral' }],
    description: 'Avaliação de danos em veículo sinistrado.'
  },
  {
    id: '5',
    processNumber: '005/2024-E',
    plaintiff: 'Roberto Dias',
    defendant: 'Companhia de Energia Elétrica',
    city: 'Gravataí',
    status: ProcessStatus.ATRASO,
    justiceType: JusticeType.AJG,
    periciaType: PericiaType.LOCAL,
    startDate: '2024-01-05',
    caseValue: 25000.00,
    feesCharged: [{ id: 'fc6', date: '2024-01-10', amount: 2500.00 }],
    feesReceived: [],
    description: 'Perícia em medidor de energia com suspeita de irregularidade.'
  },
  {
    id: '6',
    processNumber: '006/2023-F',
    plaintiff: 'Fernanda Lima',
    defendant: 'Administradora de Condomínios',
    city: 'Porto Alegre',
    status: ProcessStatus.AGUARDANDO_RESPOSTA,
    justiceType: JusticeType.PARTICULAR,
    periciaType: PericiaType.DOCUMENTAL,
    startDate: '2023-12-01',
    caseValue: 15000.00,
    feesCharged: [{ id: 'fc7', date: '2023-12-05', amount: 1800.00 }],
    feesReceived: [],
    description: 'Análise de prestação de contas do condomínio.'
  },
  {
    id: '7',
    processNumber: '007/2024-G',
    plaintiff: 'Lucas Martins',
    defendant: 'Oficina Mecânica Express',
    city: 'Canoas',
    status: ProcessStatus.PERICIA_MARCADA,
    justiceType: JusticeType.AJG,
    periciaType: PericiaType.LOCAL,
    startDate: '2024-03-15',
    caseValue: 8000.00,
    feesCharged: [{ id: 'fc8', date: '2024-03-20', amount: 1500.00 }],
    feesReceived: [{ id: 'fr5', date: '2024-03-25', amount: 750.00, source: 'Adiantamento' }],
    description: 'Verificação de reparos realizados em motor de veículo.'
  }
];

const simulateDelay = <T,>(data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), 500));


export const getProcesses = async (): Promise<JudicialProcess[]> => {
    try {
        const res = await fetch('/api/processes');
        if (!res.ok) return mockProcesses;
        const json = await res.json();
        if (json?.ok && Array.isArray(json.data)) {
            return json.data as JudicialProcess[];
        }
        return mockProcesses;
    } catch {
        return mockProcesses;
    }
};

export const getProcessById = async (id: string): Promise<JudicialProcess | undefined> => {
    try {
        const res = await fetch(`/api/processes/${id}`);
        if (res.ok) {
            const json = await res.json();
            if (json?.ok && json.data) return json.data as JudicialProcess;
        }
    } catch {}
    const process = mockProcesses.find(p => p.id === id);
    return simulateDelay(process);
};

export const saveProcess = async (process: JudicialProcess): Promise<JudicialProcess> => {
    if (process.id && process.id !== 'new') {
        try {
            const res = await fetch(`/api/processes/${process.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(process),
            });
            if (res.ok) return process;
        } catch {}
        // Fallback to mock update if API not available
        mockProcesses = mockProcesses.map(p => p.id === process.id ? process : p);
        return simulateDelay(process);
    } else {
        // Create via API when available
        try {
            const res = await fetch('/api/processes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(process),
            });
            if (res.ok) {
                const json = await res.json();
                if (json?.ok && json.data) return json.data as JudicialProcess;
            }
        } catch {}
        // Fallback mock creation
        const newProcess = { ...process, id: new Date().getTime().toString() };
        mockProcesses.push(newProcess);
        return simulateDelay(newProcess);
    }
};

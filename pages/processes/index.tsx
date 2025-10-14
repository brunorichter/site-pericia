
import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/authContext';
import { getProcesses } from '../../services/processService';
import { JudicialProcess, ProcessStatus, Payment, JusticeType, PericiaType } from '../../types';

// --- Modal Component ---
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
            <div className="bg-brand-dark rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-brand-dark rounded-t-lg z-10">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none" aria-label="Fechar">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-scale { animation: fade-in-scale 0.2s forwards ease-out; }
            `}</style>
        </div>
    );
};

// --- Payment Report Modal ---
interface ReportPayment extends Payment {
    processNumber: string;
}

interface ReportMonth {
    monthName: string;
    payments: ReportPayment[];
    total: number;
}

interface ReportData {
    months: ReportMonth[];
    grandTotal: number;
}

interface PaymentReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    processes: JudicialProcess[];
}

const PaymentReportModal: React.FC<PaymentReportModalProps> = ({ isOpen, onClose, processes }) => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [reportData, setReportData] = useState<ReportData | null>(null);

    const handleGenerateReport = () => {
        const filteredPayments: ReportPayment[] = [];
        processes.forEach(process => {
            process.feesReceived.forEach(payment => {
                if (new Date(payment.date + 'T00:00:00').getFullYear() === year) {
                    filteredPayments.push({ ...payment, processNumber: process.processNumber });
                }
            });
        });

        if (filteredPayments.length === 0) {
            setReportData({ months: [], grandTotal: 0 });
            return;
        }

        const groupedByMonth: { [key: number]: ReportPayment[] } = {};
        filteredPayments.forEach(payment => {
            const month = new Date(payment.date + 'T00:00:00').getMonth();
            if (!groupedByMonth[month]) {
                groupedByMonth[month] = [];
            }
            groupedByMonth[month].push(payment);
        });

        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const months: ReportMonth[] = [];
        let grandTotal = 0;

        Object.keys(groupedByMonth).map(monthKeyStr => {
            const monthKey = parseInt(monthKeyStr);
            const monthPayments = groupedByMonth[monthKey].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const monthTotal = monthPayments.reduce((sum, p) => sum + p.amount, 0);
            grandTotal += monthTotal;

            months.push({
                monthName: monthNames[monthKey],
                payments: monthPayments,
                total: monthTotal,
            });
        });

        months.sort((a, b) => monthNames.indexOf(a.monthName) - monthNames.indexOf(b.monthName));

        setReportData({ months, grandTotal });
    };
    
    const handleClose = () => {
        setReportData(null); // Reset report data on close
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Relatório de Pagamentos">
            <div className="space-y-4">
                <div className="flex items-end space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label htmlFor="reportYear" className="block text-sm font-medium text-gray-700">Ano</label>
                        <input
                            type="number"
                            id="reportYear"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="YYYY"
                        />
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        className="bg-brand-cyan-500 hover:bg-brand-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    >
                        Gerar Relatório 
                    </button>
                </div>

                {reportData && (
                    <div className="mt-6">
                        {reportData.months.length > 0 ? (
                            <div className="space-y-6">
                                {reportData.months.map(monthData => (
                                    <div key={monthData.monthName}>
                                        <h4 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b">{monthData.monthName}</h4>
                                        <ul className="space-y-2 mb-3">
                                            {monthData.payments.map(p => (
                                                <li key={p.id} className="grid grid-cols-4 gap-4 items-center text-sm p-2 rounded-md hover:bg-gray-50">
                                                    <span className="text-gray-600">{new Date(p.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                                    <span className="text-gray-800 font-medium col-span-2">{p.processNumber} - {p.source}</span>
                                                    <span className="text-green-700 font-semibold text-right">{p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="text-right font-bold text-gray-800 pr-2">
                                            Subtotal Mês: {monthData.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-8 pt-4 border-t-2 text-right">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Total Anual: {reportData.grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </h3>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">Nenhum pagamento encontrado para o ano de {year}.</p>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};


const statusColors: { [key in ProcessStatus]: string } = {
    [ProcessStatus.ENVIAR_PROPOSTA]: 'bg-yellow-100 text-yellow-800',
    [ProcessStatus.ATRASO]: 'bg-red-100 text-red-800',
    [ProcessStatus.AGUARDANDO_RESPOSTA]: 'bg-blue-100 text-blue-800',
    [ProcessStatus.ELABORACAO_LAUDO]: 'bg-violet-100 text-violet-800',
    [ProcessStatus.PERICIA_MARCADA]: 'bg-amber-100 text-amber-800',
    [ProcessStatus.AGUARDANDO_PAGAMENTO]: 'bg-green-100 text-green-800',
    [ProcessStatus.ARQUIVADO]: 'bg-gray-200 text-gray-800',
};

const justiceTypeColors: { [key in JusticeType]: string } = {
    [JusticeType.AJG]: 'bg-red-100 text-red-800',
    [JusticeType.PARTICULAR]: 'bg-green-100 text-green-800',
};

const periciaTypeColors: { [key in PericiaType]: string } = {
    [PericiaType.LOCAL]: 'bg-yellow-100 text-yellow-800',
    [PericiaType.DOCUMENTAL]: 'bg-blue-100 text-blue-800',
};

const Badge: React.FC<{ text: string; colorClass: string }> = ({ text, colorClass }) => (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
        {text}
    </span>
);


const ProcessCard: React.FC<{ process: JudicialProcess }> = ({ process }) => (
    <Link href={`/processes/${process.id}`} className="block">
        <div className="bg-brand-dark-secondary rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white mb-2">{process.processNumber}</h3>
                     <Badge text={process.status} colorClass={statusColors[process.status]} />
                </div>
                 <div className="flex items-center space-x-2 mb-4">
                    <Badge text={process.justiceType} colorClass={justiceTypeColors[process.justiceType]} />
                    <Badge text={process.periciaType} colorClass={periciaTypeColors[process.periciaType]} />
                </div>
                <p className="text-sm text-gray-200 mb-1"><span className="font-semibold">Autor:</span> {process.plaintiff}</p>
                <p className="text-sm text-gray-200"><span className="font-semibold">Réu:</span> {process.defendant}</p>
                 <p className="text-sm text-gray-200 mt-2"><span className="font-semibold">Cidade:</span> {process.city}</p>
            </div>
            <div className="mt-4 pt-2 pb-2 ml-auto rounded-lg relative inset-0 w-2/5 border-gray-200 text-center bg-brand-cyan-500 text-white font-bold hover:underline">
                Ver Detalhes
            </div>
        </div>
    </Link>
);


const ProcessListPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [processes, setProcesses] = useState<JudicialProcess[]>([]);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setReportModalOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            const fetchProcesses = async () => {
                setLoading(true);
                const data = await getProcesses();
                setProcesses(data);
                setLoading(false);
            };
            fetchProcesses();
        }
    }, [isAuthenticated, router]);
    
    if (!isAuthenticated) {
        return <div className="text-center p-10">Redirecionando para o login...</div>;
    }

    if (loading) {
        return <div className="text-center p-10">Carregando processos...</div>;
    }

    return (
        <div className="bg-brand-dark min-h-screen">
            <div className="container mx-auto px-6 py-10 bg-brand-dark">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Lista de Processos</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setReportModalOpen(true)}
                            className="bg-brand-cyan-500 hover:bg-brand-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-sm"
                        >
                            Relatório Pagamentos
                        </button>
                        <Link
                            href="/processes/new"
                            className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-sm"
                        >
                            + Adicionar Processo
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processes.map(process => (
                        <ProcessCard key={process.id} process={process} />
                    ))}
                </div>
                <PaymentReportModal 
                    isOpen={isReportModalOpen}
                    onClose={() => setReportModalOpen(false)}
                    processes={processes}
                />
            </div>
        </div>
    );
};

export default ProcessListPage;

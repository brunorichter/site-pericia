
import React, { useState, useEffect, ReactNode } from 'react';
import type { GetServerSideProps } from 'next';
import { isRequestAuthenticated, redirectToLogin } from '../../lib/auth-server';
import Header from '../../components/Header';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FileText, Plus } from 'lucide-react';
import { getProcesses, getProcessPayments } from '../../services/processService';
import { JudicialProcess, ProcessStatus, Payment } from '../../types';
import { Combobox } from '../../components/ui/combobox';
import ProcessCard from '../../components/ProcessCard';

// --- Modal Component ---
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
            <div className="bg-gray-200 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
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
    processAuthor?: string;
}

interface ReportMonth {
    monthName: string;
    payments: ReportPayment[];
    total: number;
    amount: number;
    taxes: number;
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
    const [paymentsByProcess, setPaymentsByProcess] = useState<Record<string, Payment[]>>({});
    const [isLoadingPayments, setIsLoadingPayments] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        let cancelled = false;

        const fetchPayments = async () => {
            setIsLoadingPayments(true);
            setLoadError(null);
            try {
                const entries = await Promise.all(processes.map(async (process) => {
                    const processId = process.id;
                    if (!processId || processId === 'new') {
                        return [processId ?? '', process.feesReceived ?? []] as const;
                    }
                    const payments = await getProcessPayments(processId);
                    if (payments.length > 0) {
                        return [processId, payments] as const;
                    }
                    return [processId, process.feesReceived ?? []] as const;
                }));

                if (cancelled) {
                    return;
                }

                const map: Record<string, Payment[]> = {};
                entries.forEach(([id, payments]) => {
                    if (id) {
                        map[id] = payments;
                    }
                });
                setPaymentsByProcess(map);
            } catch (error) {
                if (!cancelled) {
                    setLoadError('Não foi possível carregar os pagamentos do banco de dados.');
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingPayments(false);
                }
            }
        };

        fetchPayments();

        return () => {
            cancelled = true;
        };
    }, [isOpen, processes]);

    const handleGenerateReport = () => {
        const filteredPayments: ReportPayment[] = [];
        processes.forEach(process => {
            const payments = paymentsByProcess[process.id] ?? process.feesReceived ?? [];
            payments.forEach(payment => {
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
            const monthPayments = groupedByMonth[monthKey].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const monthAmount = monthPayments.reduce((sum, p) => sum + p.amount, 0);
            const monthTaxes = monthPayments.reduce((sum, p) => sum + (p.taxes || 0), 0);
            const monthTotal = monthPayments.reduce((sum, p) => sum + p.total, 0);
            grandTotal += monthTotal;

            months.push({
                monthName: monthNames[monthKey],
                payments: monthPayments,
                total: monthTotal,
                amount: monthAmount,
                taxes: monthTaxes,
            });
        });

        months.sort((a, b) => monthNames.indexOf(a.monthName) - monthNames.indexOf(b.monthName));

        setReportData({ months, grandTotal });
    };

    const handleClose = () => {
        setReportData(null);
        setPaymentsByProcess({});
        setLoadError(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Relatório de Pagamentos">
            <div className="space-y-4">
                {isLoadingPayments && (
                    <p className="text-sm text-gray-200 bg-gray-800 p-2 rounded">Carregando pagamentos...</p>
                )}
                {loadError && (
                    <p className="text-sm text-red-400 bg-red-900 bg-opacity-30 p-2 rounded">{loadError}</p>
                )}
                <div className="flex items-end space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label htmlFor="reportYear" className="block text-sm font-medium text-gray-700">Ano</label>
                        <input
                            type="number"
                            id="reportYear"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value, 10) || new Date().getFullYear())}
                            className="mt-1 p-2 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="YYYY"
                        />
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={isLoadingPayments}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-300 hover:border-cyan-400 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FileText className="h-4 w-4" aria-hidden="true" />
                        {isLoadingPayments ? 'Carregando...' : 'Gerar Relatório'}
                    </button>
                </div>

                {reportData && (
                    <div className="mt-6">
                        {reportData.months.length > 0 ? (
                            <div className="space-y-6">
                                {reportData.months.map(monthData => (
                                    <div key={monthData.monthName}>
                                        <h4 className="text-xl font-semibold text-brand-cyan-700 mb-3 pb-2 border-b">{monthData.monthName}</h4>
                                        <ul className="space-y-2 mb-3">
                                            {monthData.payments.map(p => (
                                                <li key={p.id} className="grid grid-cols-6 gap-4 items-center text-sm p-2 rounded-md bg-gray-100 hover:bg-gray-50">
                                                    <span className="text-gray-600 border">{new Date(p.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                                    <span className="text-gray-800 border font-medium col-span-2">{p.processNumber} - {p.source}</span>
                                                    <span className="text-gray-900 border font-semibold text-right">{p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                    <span className="text-red-700 border font-semibold text-right">{`- ${p.taxes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</span>
                                                    <span className="text-green-700 border font-semibold text-right">{p.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="grid grid-cols-6 gap-4 items-center text-lg p-2 rounded-md bg-gray-100 hover:bg-gray-50 font-bold">
                                            <span className="col-span-3">Subtotal Mês: </span>
                                            <span className="col-span-1 font-normal text-right">{monthData.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                            <span className="col-span-1 font-normal text-right">{monthData.taxes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                            <span className="col-span-1 font-bold text-right">{monthData.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
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

const statusFilterOptions = [
    { value: 'all', label: 'Todos' },
    ...Object.values(ProcessStatus).map((status) => ({
        value: status,
        label: status,
    })),
] as { value: ProcessStatus | 'all'; label: string }[];

const ProcessListPage: React.FC = () => {
    const router = useRouter();
    const [processes, setProcesses] = useState<JudicialProcess[]>([]);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProcessStatus | 'all'>('all');

    useEffect(() => {
        const fetchProcesses = async () => {
            setLoading(true);
            const data = await getProcesses();
            setProcesses(data);
            setLoading(false);
        };
        fetchProcesses();
    }, [router]);

    const filteredProcesses = processes.filter((process) => {
        const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
        if (!matchesStatus) {
            return false;
        }
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;

        const number = process.processNumber?.toLowerCase() ?? '';
        const plaintiff = process.plaintiff?.toLowerCase() ?? '';
        const defendant = process.defendant?.toLowerCase() ?? '';

        return number.includes(term) || plaintiff.includes(term) || defendant.includes(term);
    });

    if (loading) {
        return <div className="text-center p-10">Carregando processos...</div>;
    }

    return (
        <>
        <Header />
        <div className="bg-brand-dark min-h-screen pt-20 md:pt-24">
            <div className="container mx-auto px-6 py-10 bg-brand-dark">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Lista de Processos</h1>
                        <p className="text-sm text-brand-cyan-100/80 mt-1 text-white">Filtre por número do processo ou partes para localizar rapidamente.</p>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-3 w-full md:w-auto">
                        <Combobox
                            className="w-full md:w-60"
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value as ProcessStatus | 'all')}
                            options={statusFilterOptions}
                            placeholder="Selecione o status"
                            searchPlaceholder="Buscar status..."
                        />
                        <div className="relative flex-1 min-w-[240px]">
                            <label htmlFor="process-search" className="sr-only">Buscar processos</label>
                            <input
                                id="process-search"
                                type="text"
                                placeholder="Buscar por número, autor ou réu"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-2xl border border-brand-cyan-500/50 bg-brand-dark-secondary/70 px-5 py-3 text-sm text-white placeholder:text-brand-cyan-100/60 focus:border-brand-cyan-400 focus:outline-none focus:ring-2 focus:ring-brand-cyan-500/40 transition"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-brand-cyan-100/60">
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <circle cx="9" cy="9" r="6" />
                                    <line x1="14" y1="14" x2="18" y2="18" />
                                </svg>
                            </span>
                        </div>
                        <button
                            onClick={() => setReportModalOpen(true)}
                            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-slate-600/80 bg-slate-900/80 px-5 text-sm font-semibold text-slate-100 shadow-sm shadow-black/20 ring-1 ring-white/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        >
                            <FileText className="h-4 w-4" aria-hidden="true" />
                            Relatório Pagamentos
                        </button>
                        <Link
                            href="/processes/new"
                            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-400/15 px-5 text-sm font-semibold text-emerald-50 shadow-sm shadow-black/20 ring-1 ring-white/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/45 hover:bg-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            Adicionar Processo
                        </Link>
                    </div>
                </div>
                {filteredProcesses.length ? (
                    <div className="mt-4 flex flex-col gap-4">
                        {filteredProcesses.map(process => (
                            <ProcessCard key={process.id} process={process} href={`/processes/${process.id}`} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 rounded-3xl border border-dashed border-brand-cyan-500/40 bg-brand-dark-secondary/80 p-10 text-center text-white">
                        Nenhum processo encontrado para os filtros selecionados{searchTerm ? ` e o termo "${searchTerm}"` : ''}.
                    </div>
                )}
                <PaymentReportModal 
                    isOpen={isReportModalOpen}
                    onClose={() => setReportModalOpen(false)}
                    processes={processes}
                />
            </div>
        </div>
        </>
    );
};

export default ProcessListPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if (!isRequestAuthenticated(ctx)) {
        return redirectToLogin(ctx);
    }
    return { props: {} };
};

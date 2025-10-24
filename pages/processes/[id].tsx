
import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import type { GetServerSideProps } from 'next';
import { isRequestAuthenticated, redirectToLogin } from '../../lib/auth-server';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { getProcessById, saveProcess } from '../../services/processService';
import { JudicialProcess, ProcessStatus, FeeProposal, Payment, JusticeType, PericiaType } from '../../types';

const applyProcessNumberMask = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 20);
    if (digitsOnly.length <= 7) return digitsOnly;
    if (digitsOnly.length <= 9) return `${digitsOnly.slice(0, 7)}-${digitsOnly.slice(7)}`;
    if (digitsOnly.length <= 13) return `${digitsOnly.slice(0, 7)}-${digitsOnly.slice(7, 9)}.${digitsOnly.slice(9)}`;
    if (digitsOnly.length <= 14) return `${digitsOnly.slice(0, 7)}-${digitsOnly.slice(7, 9)}.${digitsOnly.slice(9, 13)}.${digitsOnly.slice(13)}`;
    if (digitsOnly.length <= 16) return `${digitsOnly.slice(0, 7)}-${digitsOnly.slice(7, 9)}.${digitsOnly.slice(9, 13)}.${digitsOnly.slice(13, 14)}.${digitsOnly.slice(14)}`;
    return `${digitsOnly.slice(0, 7)}-${digitsOnly.slice(7, 9)}.${digitsOnly.slice(9, 13)}.${digitsOnly.slice(13, 14)}.${digitsOnly.slice(14, 16)}.${digitsOnly.slice(16)}`;
};

// --- Modal Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <div className="flex justify-between items-center p-5 border-b sticky top-0 text  bg-cyan-800 rounded-t-lg">
                    <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
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
// --- Proposta de Honorarios Modal --- 
const FeesChargedModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    proposals: FeeProposal[];
    onUpdate: (proposals: FeeProposal[]) => void;
}> = ({ isOpen, onClose, proposals, onUpdate }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');

    const [editingProposal, setEditingProposal] = useState<FeeProposal | null>(null);

    const resetForm = () => {
        setDate(new Date().toISOString().split('T')[0]);
        setAmount('');
        setEditingProposal(null);
    };

    const handleEditClick = (proposal: FeeProposal) => {
        setEditingProposal(proposal);
        setDate(proposal.date);
        setAmount(String(proposal.amount));

    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && amount) {
            if(editingProposal) {
                // Update
                const updatedProposals = proposals.map(p => 
                    p.id === editingProposal.id ? { ...p, date, amount: parseFloat(amount) } : p
                );
                onUpdate(updatedProposals);
            } else {
                // Add new
                const newProposal: FeeProposal = { id: new Date().getTime().toString(), date, amount: parseFloat(amount) };
                onUpdate([...proposals, newProposal]);
            }
            resetForm();
        }
    };
    
    const handleRemove = (id: string) => {
        onUpdate(proposals.filter(p => p.id !== id));
        if (editingProposal?.id === id) {
            resetForm();
        }
    };

    const sortedProposals = [...proposals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Propostas de Honorarios">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b">
                <div>
                    <label htmlFor="proposalDate" className="block text-sm font-medium text-gray-700">Data</label>
                    <input type="date" id="proposalDate" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
                <div>
                    <label htmlFor="proposalAmount" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                    <input type="number" step="0.01" id="proposalAmount" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="Ex: 5000.00" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
                <div className="self-end flex space-x-2">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">{editingProposal ? 'Atualizar' : 'Adicionar'}</button>
                    {editingProposal && <button type="button" onClick={resetForm} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300">Cancelar</button>}
                </div>
            </form>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Propostas Adicionadas</h4>
            <ul className="space-y-3">
                {sortedProposals.length > 0 ? sortedProposals.map(p => (
                    <li key={p.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                        <div>
                            <span className="font-semibold">{new Date(p.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>: 
                            <span className="text-green-700 ml-2">{p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        <div>
                            <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:text-blue-700 font-semibold mr-4">Editar</button>
                            <button onClick={() => handleRemove(p.id)} className="text-red-500 hover:text-red-700 font-semibold">Remover</button>
                        </div>
                    </li>
                )) : <p className="text-gray-500">Nenhuma proposta adicionada.</p>}
            </ul>
        </Modal>
    );
};

// --- Recebimento de Honorarios Modal ---
const FeesReceivedModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    processId?: string;
    payments: Payment[];
    onUpdate: (payments: Payment[]) => void;
}> = ({ isOpen, onClose, processId, payments, onUpdate }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [taxes, setTaxes] = useState('');
    const [total, setTotal] = useState('');
    const [source, setSource] = useState('');
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const canPersist = Boolean(processId && processId !== 'new');
    const latestOnUpdate = useRef(onUpdate);

    useEffect(() => {
        latestOnUpdate.current = onUpdate;
    }, [onUpdate]);

    useEffect(() => {
        if (!amount && !taxes) {
            setTotal('');
            return;
        }

        const amountValue = parseFloat(amount) || 0;
        const taxesValue = parseFloat(taxes) || 0;
        const calculatedTotal = amountValue - taxesValue;

        setTotal(Number.isFinite(calculatedTotal) ? calculatedTotal.toFixed(2) : '');
    }, [amount, taxes]);

    useEffect(() => {
        if (!isOpen || !canPersist) return;
        let cancelled = false;
        const fetchPayments = async () => {
            setIsLoading(true);
            setApiError(null);
            try {
                const res = await fetch(`/api/processes/${processId}/payments`);
                if (cancelled) return;
                if (res.status === 204) {
                    return;
                }
                if (!res.ok) throw new Error('Erro ao carregar pagamentos');
                const json = await res.json();
                if (!cancelled && json?.ok && Array.isArray(json.data)) {
                    latestOnUpdate.current(json.data as Payment[]);
                }
            } catch (error) {
                if (!cancelled) {
                    setApiError('Nao foi possivel carregar os pagamentos do banco.');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };
        fetchPayments();
        return () => {
            cancelled = true;
            setIsLoading(false);
        };
    }, [isOpen, canPersist, processId]);

    const resetForm = () => {
        setDate(new Date().toISOString().split('T')[0]);
        setAmount('');
        setTaxes('');
        setTotal('');
        setSource('');
        setEditingPayment(null);
    };

    const handleEditClick = (payment: Payment) => {
        setEditingPayment(payment);
        setDate(payment.date);
        setAmount(payment.amount.toString());
        setTaxes(payment.taxes?.toString() ?? '0');
        setTotal(payment.total?.toString() ?? '');
        setSource(payment.source);
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !amount || !source) return;

        setIsSubmitting(true);
        setApiError(null);

        const amountValue = Number(amount) || 0;
        const taxesValue = Number(taxes) || 0;
        const totalValue = Number(total) || amountValue - taxesValue;
        const trimmedSource = source.trim();
        const fallbackId = editingPayment ? editingPayment.id : new Date().getTime().toString();
        const basePayment: Payment = {
            id: fallbackId,
            date,
            amount: amountValue,
            taxes: taxesValue,
            total: totalValue,
            source: trimmedSource,
        };

        let persistedPayment: Payment | null = null;
        let shouldFallback = !canPersist;

        if (!shouldFallback) {
            try {
                const endpoint = editingPayment
                    ? `/api/processes/${processId}/payments/${editingPayment.id}`
                    : `/api/processes/${processId}/payments`;
                const method = editingPayment ? 'PUT' : 'POST';
                const res = await fetch(endpoint, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        source: trimmedSource,
                        amount: amountValue,
                        taxes: taxesValue,
                        total: totalValue,
                        date,
                    }),
                });

                if (res.status === 204) {
                    shouldFallback = true;
                } else if (!res.ok) {
                    throw new Error('Erro ao salvar pagamento');
                } else {
                    const json = await res.json();
                    if (json?.ok) {
                        persistedPayment = json.data ?? null;
                    } else {
                        shouldFallback = true;
                    }
                }
            } catch (error) {
                setApiError('Não foi possível salvar o pagamento no banco.');
                setIsSubmitting(false);
                return;
            }
        }

        const paymentToApply = persistedPayment ?? basePayment;
        if (editingPayment) {
            const updatedPayments = payments.map(p =>
                p.id === editingPayment.id ? { ...paymentToApply, id: editingPayment.id } : p
            );
            onUpdate(updatedPayments);
        } else {
            onUpdate([...payments, paymentToApply]);
        }

        resetForm();
        setIsSubmitting(false);
        if (shouldFallback) {
            setApiError('Os dados foram atualizados localmente, mas o banco não retornou confirmação.');
        }
    };
    
    const handleRemove = async (id: string) => {
        setApiError(null);
        let removalSucceeded = !canPersist;
        if (canPersist) {
            try {
                const res = await fetch(`/api/processes/${processId}/payments/${id}`, { method: 'DELETE' });
                if (res.status === 204) {
                    removalSucceeded = true;
                } else if (res.ok || res.status === 404) {
                    removalSucceeded = true;
                } else {
                    throw new Error('Erro ao remover');
                }
            } catch (error) {
                setApiError('Não foi possível remover o pagamento do banco.');
                return;
            }
        }

        if (removalSucceeded) {
            onUpdate(payments.filter(p => p.id !== id));
            if (editingPayment?.id === id) {
                resetForm();
            }
        }
    };

    const sortedPayments = [...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
                <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Recebimentos de Honorarios">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                <div>
                    <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">Data</label>
                    <input type="date" id="paymentDate" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
                <div className="md:col-span-3">
                    <label htmlFor="paymentSource" className="block text-sm font-medium text-gray-700">Origem / Descricao</label>
                    <input type="text" id="paymentSource" value={source} onChange={e => setSource(e.target.value)} required placeholder="Ex: Adiantamento" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div> 
                <div>
                    <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">Valor Depositado</label>
                    <input type="number" step="0.01" id="paymentAmount" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="Ex: 2500.00" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
                <div>
                    <label htmlFor="paymentTaxes" className="block text-sm font-medium text-gray-700">Imposto Retido</label>
                    <input type="number" step="0.01" id="paymentTaxes" value={taxes} onChange={e => setTaxes(e.target.value)} required placeholder="Ex: 250.00" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
                <div>
                    <label htmlFor="paymentTotal" className="block text-sm font-medium text-gray-700">Valor Total</label>
                    <input type="number" step="0.01" id="paymentTotal" value={total} readOnly required placeholder="Ex: 2250.00" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"/>
                </div>
                
                <div className="md:col-span-4 self-end flex space-x-2">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-blue-300">{editingPayment ? (isSubmitting ? 'Atualizando...' : 'Atualizar') : (isSubmitting ? 'Adicionando...' : 'Adicionar')}</button>
                    {editingPayment && <button type="button" onClick={resetForm} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300">Cancelar</button>}
                </div>
            </form>
            {apiError && <p className="text-sm text-red-600 mb-4">{apiError}</p>}
            {isLoading ? (
                <p className="text-gray-500">Carregando pagamentos...</p>
            ) : (
                <>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Pagamentos Recebidos</h4>
                    <ul className="space-y-3">
                        {sortedPayments.length > 0 ? sortedPayments.map(p => (
                            <li key={p.id} className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 p-3 rounded-md gap-2">
                                <div>
                                    <span className="font-semibold">{new Date(p.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span> - {p.source}
                                    <span className="block text-sm text-gray-600">Deposito: {p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} | Imposto: {p.taxes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} | Total: {p.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:text-blue-700 font-semibold">Editar</button>
                                    <button onClick={() => handleRemove(p.id)} className="text-red-500 hover:text-red-700 font-semibold">Remover</button>
                                </div>
                            </li>
                        )) : <p className="text-gray-500">Nenhum pagamento recebido.</p>}
                    </ul>
                </>
            )}
        </Modal>
    );
};

// --- Main Page Component ---

const ProcessDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [process, setProcess] = useState<JudicialProcess | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFeesChargedModalOpen, setFeesChargedModalOpen] = useState(false);
    const [isFeesReceivedModalOpen, setFeesReceivedModalOpen] = useState(false);
    
    const isNew = id === 'new';

    const fetchProcess = useCallback(async () => {
        if (typeof id !== 'string') return;
        
        if (!isNew) {
            setLoading(true);
            const data = await getProcessById(id);
            if(data) setProcess(data);
            else router.push('/processes');
            setLoading(false);
        } else {
            setProcess({
                id: 'new',
                processNumber: '',
                plaintiff: '',
                defendant: '',
                city: '',
                status: ProcessStatus.ENVIAR_PROPOSTA,
                justiceType: JusticeType.PARTICULAR,
                periciaType: PericiaType.LOCAL,
                startDate: new Date().toISOString().split('T')[0],
                caseValue: 0,
                feesCharged: [],
                feesReceived: [],
                description: ''
            });
            setLoading(false);
        }
    }, [id, isNew, router]);
    
    useEffect(() => {
        if (router.isReady) {
            fetchProcess();
        }
    }, [router, router.isReady, fetchProcess]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (process) {
             const updatedValue =
                name === 'processNumber'
                    ? applyProcessNumberMask(value)
                    : name === 'caseValue'
                    ? parseFloat(value) || 0
                    : value;
             setProcess({ ...process, [name]: updatedValue });
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (process) {
            setIsSaving(true);
            await saveProcess(process);
            setIsSaving(false);
            router.push('/processes');
        }
    };

    const getLatestFeeCharged = (): number => {
        if (!process || process.feesCharged.length === 0) return 0;
        const sorted = [...process.feesCharged].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return sorted[0].amount;
    };

    const getTotalFeesReceived = (): number => {
        if (!process || process.feesReceived.length === 0) return 0;
        return process.feesReceived.reduce((sum, payment) => sum + (payment.total ?? payment.amount), 0);
    };
    
    if (loading) return <div className="text-center p-10">Carregando dados do processo...</div>;
    if (!process) return <div className="text-center p-10">Carregando...</div>;

    return (
        <>
            <Header />
            <div className="bg-brand-dark min-h-screen pt-20 md:pt-24">
                <div className="p-8 rounded-xl shadow-[4px_0_8px_0_rgba(209,213,219,1)] hover:shadow-[4px_0_8px_0_rgba(255,255,255,1)] transition-shadow duration-300 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6 border-b pb-4">
                    {isNew ? 'Adicionar Novo Processo' : `Processo: ${process.processNumber}`}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="processNumber" className="block text-sm font-medium text-gray-300">Número do Processo</label>
                                <input type="text" name="processNumber" id="processNumber" value={process.processNumber} onChange={handleChange} required className="flex-grow px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm bg-brand-dark-secondary text-white focus:border-cyan-100 focus:ring-cyan-500 sm:text-sm" placeholder="5006383-06.2025.8.21.0087" maxLength={25}/>
                            </div>
                            <div>
                                <label htmlFor="plaintiff" className="block text-sm font-medium text-gray-300">Autor</label>
                                <input type="text" name="plaintiff" id="plaintiff" value={process.plaintiff} onChange={handleChange} required className="flex-grow px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm bg-brand-dark-secondary text-white focus:border-cyan-100 focus:ring-cyan-500 sm:text-sm"/>
                            </div>
                            <div>
                                <label htmlFor="defendant" className="block text-sm font-medium text-gray-300">Réu</label>
                                <input type="text" name="defendant" id="defendant" value={process.defendant} onChange={handleChange} required className="flex-grow px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm bg-brand-dark-secondary text-white focus:border-cyan-100 focus:ring-cyan-500 sm:text-sm"/>
                            </div>
                             <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-300">Cidade</label>
                                <input type="text" name="city" id="city" value={process.city} onChange={handleChange} required className="flex-grow px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm bg-brand-dark-secondary text-white focus:border-cyan-100 focus:ring-cyan-500 sm:text-sm"/>
                            </div>
                             <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                                <select name="status" id="status" value={process.status} onChange={handleChange} className="flex-grow px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm bg-brand-dark-secondary text-white focus:border-cyan-100 focus:ring-cyan-500 sm:text-sm">
                                    {Object.values(ProcessStatus).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="caseValue" className="block text-sm font-medium text-gray-300">Valor da Causa (R$)</label>
                                <input type="number" step="0.01" name="caseValue" id="caseValue" value={process.caseValue} onChange={handleChange} className="flex-grow px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm bg-brand-dark-secondary text-white focus:border-cyan-100 focus:ring-cyan-500 sm:text-sm"/>
                                </div>
                        </div>
                        {/* Column 2 */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">Data Inicial</label>
                                <input type="date" name="startDate" id="startDate" value={process.startDate} onChange={handleChange} required className="flex-grow px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm bg-brand-dark-secondary text-white focus:border-cyan-100 focus:ring-cyan-500 sm:text-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Tipo de Perícia</label>
                                <div className="mt-2 flex space-x-4">
                                    {Object.values(PericiaType).map(type => (
                                        <div key={type} className="flex items-center">
                                            <input id={`pericia-${type}`} name="periciaType" type="radio" value={type} checked={process.periciaType === type} onChange={handleChange} className="flex-grow px-3 py-2 border block h-7 w-4 focus:ring-blue-500 text-blue-600 border-gray-300" />
                                            <label htmlFor={`pericia-${type}`} className="ml-3 block text-sm font-medium text-gray-300">{type}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                                                        <div>
                                <label className="block text-sm font-medium text-gray-300">Tipo de Processo</label>
                                <div className="mt-2 flex space-x-4">
                                    {Object.values(JusticeType).map(type => (
                                        <div key={type} className="flex items-center">
                                            <input id={`justica-${type}`} name="justicaType" type="radio" value={type} checked={process.justiceType === type} onChange={handleChange} className="flex-grow px-3 py-2 border block h-7 w-4 focus:ring-blue-500 text-blue-600 border-gray-300" />
                                            <label htmlFor={`justica-${type}`} className="ml-3 block text-sm font-medium text-gray-300">{type}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">Proposta de Honorarios (R$)</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="flex-grow px-3 py-2 border border-r-0 border-gray-300 bg-brand-dark-secondary text-white rounded-l-md sm:text-sm">
                                        {getLatestFeeCharged().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                    <button type="button" onClick={() => setFeesChargedModalOpen(true)} className="bg-gray-200 hover:bg-gray-300 px-4 rounded-r-md font-semibold text-sm">Gerenciar</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Honorarios Recebidos (R$)</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="flex-grow px-3 py-2 border border-r-0 border-gray-300 bg-brand-dark-secondary text-white rounded-l-md sm:text-sm">
                                        {getTotalFeesReceived().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                    <button type="button" onClick={() => setFeesReceivedModalOpen(true)} className="bg-gray-200 hover:bg-gray-300 px-4 rounded-r-md font-semibold text-sm">Gerenciar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descricao</label>
                        <textarea name="description" id="description" rows={4} value={process.description} onChange={handleChange} className="mt-1 block w-full border rounded-md px-4 py-2 bg-brand-dark-secondary text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
                        <button type="button" onClick={() => router.push('/processes')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-md transition duration-300">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 disabled:bg-cyan-300">{isSaving ? 'Salvando...' : 'Salvar Processo'}</button>
                    </div>
                </form>
            </div>
            </div>

            {/* Modals */}
            <FeesChargedModal 
                isOpen={isFeesChargedModalOpen}
                onClose={() => setFeesChargedModalOpen(false)}
                proposals={process.feesCharged}
                onUpdate={(updatedProposals) => setProcess({ ...process, feesCharged: updatedProposals })}
            />
            <FeesReceivedModal
                isOpen={isFeesReceivedModalOpen}
                onClose={() => setFeesReceivedModalOpen(false)}
                processId={typeof id === 'string' ? id : process?.id}
                payments={process.feesReceived}
                onUpdate={(updatedPayments) => setProcess({ ...process, feesReceived: updatedPayments })}
            />
        </>
    );
};

export default ProcessDetailPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if (!isRequestAuthenticated(ctx)) {
        return redirectToLogin(ctx);
    }
    return { props: {} };
};

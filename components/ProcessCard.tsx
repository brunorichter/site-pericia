import React from 'react';
import Link from 'next/link';
import { JudicialProcess, JusticeType, PericiaType, ProcessStatus } from '../types';

const statusColors: { [key in ProcessStatus]: string } = {
    [ProcessStatus.ENVIAR_PROPOSTA]: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
    [ProcessStatus.ATRASO]: 'border-red-400/25 bg-red-400/10 text-red-100',
    [ProcessStatus.AGUARDANDO_RESPOSTA]: 'border-sky-400/20 bg-sky-400/10 text-sky-100',
    [ProcessStatus.ELABORACAO_LAUDO]: 'border-violet-400/20 bg-violet-400/10 text-violet-100',
    [ProcessStatus.PERICIA_MARCADA]: 'border-orange-400/20 bg-orange-400/10 text-orange-100',
    [ProcessStatus.AGUARDANDO_PAGAMENTO]: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    [ProcessStatus.ARQUIVADO]: 'border-slate-400/20 bg-slate-400/10 text-slate-200',
    [ProcessStatus.RECUSADO]: 'border-slate-400/20 bg-slate-400/10 text-slate-200',
};

const justiceTypeColors: { [key in JusticeType]: string } = {
    [JusticeType.AJG]: 'border-red-400/20 bg-red-400/10 text-red-100',
    [JusticeType.PARTICULAR]: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    [JusticeType.MISTO]: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
};

const periciaTypeColors: { [key in PericiaType]: string } = {
    [PericiaType.LOCAL]: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
    [PericiaType.DOCUMENTAL]: 'border-sky-400/20 bg-sky-400/10 text-sky-100',
};

interface ProcessCardProps {
    process: JudicialProcess;
    href?: string;
    actionLabel?: string;
    className?: string;
}

const Badge: React.FC<{ text: string; colorClass: string }> = ({ text, colorClass }) => (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${colorClass}`}>
        {text}
    </span>
);

const ProcessNumberBadge: React.FC<{ number: string; className?: string }> = ({ number, className = '' }) => (
    <h3 className={`inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3.5 py-1.5 text-sm font-semibold tracking-wide text-cyan-50 shadow-sm shadow-black/20 ${className}`}>
        <span className="uppercase">{number}</span>
    </h3>
);

const ProcessCardContent: React.FC<Pick<ProcessCardProps, 'process' | 'actionLabel' | 'className'>> = ({
    process,
    actionLabel = 'Ver Detalhes',
    className = '',
}) => (
    <div className={`group relative w-full overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/85 p-5 shadow-lg shadow-black/25 ring-1 ring-white/[0.03] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-slate-900 md:p-6 ${className}`}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <ProcessNumberBadge number={process.processNumber} />
                    <Badge text={process.status} colorClass={`${statusColors[process.status]} uppercase tracking-wide`} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge text={process.justiceType} colorClass={justiceTypeColors[process.justiceType]} />
                    <Badge text={process.periciaType} colorClass={periciaTypeColors[process.periciaType]} />
                </div>
            </div>

            <div className="grid min-w-0 flex-[2] gap-3 text-sm text-slate-200 md:grid-cols-3">
                <p className="min-w-0">
                    <span className="block text-xs font-semibold uppercase text-slate-400">Autor</span>
                    <span className="block truncate text-slate-50">{process.plaintiff}</span>
                </p>
                <p className="min-w-0">
                    <span className="block text-xs font-semibold uppercase text-slate-400">Reu</span>
                    <span className="block truncate text-slate-50">{process.defendant}</span>
                </p>
                <p className="min-w-0">
                    <span className="block text-xs font-semibold uppercase text-slate-400">Cidade</span>
                    <span className="block truncate text-slate-50">{process.city}</span>
                </p>
            </div>

            <div className="flex shrink-0 justify-end lg:min-w-[150px]">
                <div className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600/80 bg-slate-800/90 px-5 py-2 text-sm font-semibold text-slate-100 shadow-sm shadow-black/20 transition-colors duration-300 group-hover:border-cyan-300/40 group-hover:bg-slate-800 sm:w-auto">
                    {actionLabel}
                    <span aria-hidden>{'>'}</span>
                </div>
            </div>
        </div>
    </div>
);

const ProcessCard: React.FC<ProcessCardProps> = ({ process, href, actionLabel, className }) => {
    const card = <ProcessCardContent process={process} actionLabel={actionLabel} className={className} />;

    if (!href) {
        return card;
    }

    return (
        <Link href={href} className="block w-full">
            {card}
        </Link>
    );
};

export default ProcessCard;

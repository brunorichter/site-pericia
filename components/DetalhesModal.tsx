import React, { useEffect, useState } from 'react';
import type { JudicialProcess } from '../types';
import { getStatusClass } from './Pericias';
import { XIcon } from './Icons';

interface DetalhesModalProps {
  pericia: JudicialProcess;
  onClose: () => void;
  onSave: (pericia: JudicialProcess) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const DetalhesModal = ({ pericia, onClose, onSave }:DetalhesModalProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<JudicialProcess>(pericia);

  useEffect(() => {
    setFormData(pericia);
    setIsEditing(false); // Reset edit mode when a new pericia is selected
  }, [pericia]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSaveClick = () => {
    onSave(formData);
    onClose();
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(pericia);
  };

  const renderField = (label: string, name: keyof JudicialProcess, type: string = 'text', isCurrency: boolean = false) => {
    const value = formData[name] as unknown;

    // Helper to compute a safe display value
    const getDisplayValue = (): string | number => {
      if (isCurrency) {
        if (typeof value === 'number') {
          return formatCurrency(value);
        }
        if (Array.isArray(value)) {
          // Sum arrays of objects with `amount` when present
          const total = value.reduce((sum: number, item: any) => sum + (typeof item?.amount === 'number' ? item.amount : 0), 0);
          return formatCurrency(total);
        }
        const numeric = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
        return Number.isFinite(numeric) ? formatCurrency(numeric) : '-';
      }

      if (Array.isArray(value)) {
        // Generic array display (count) to avoid [object Object]
        return `${value.length} item(s)`;
      }

      return (value ?? '-') as string | number;
    };

    if (isEditing) {
      if (type === 'textarea') {
        return (
          <div>
            <label className="block text-xs font-bold text-brand-gray uppercase mb-1">{label}</label>
            <textarea
              name={name}
              value={(formData[name] as unknown as string) ?? ''}
              onChange={handleChange}
              rows={4}
              className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 text-brand-light text-sm focus:ring-brand-cyan-500 focus:border-brand-cyan-500 transition"
            />
          </div>
        )
      }

      // Prevent editing for array-backed fields; show computed total/read-only
      if (Array.isArray(value)) {
        return (
          <div>
            <label className="block text-xs font-bold text-brand-gray uppercase mb-1">{label}</label>
            <p className="text-brand-light text-sm whitespace-pre-wrap min-h-[2.1rem] pt-2">
              {getDisplayValue()}
            </p>
          </div>
        )
      }

      return (
        <div>
          <label className="block text-xs font-bold text-brand-gray uppercase mb-1">{label}</label>
          <input
            type={type}
            name={name}
            value={(formData[name] as unknown as string | number) ?? ''}
            onChange={handleChange}
            className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 text-brand-light text-sm focus:ring-brand-cyan-500 focus:border-brand-cyan-500 transition"
          />
        </div>
      )
    }

    return (
      <div>
        <label className="block text-xs font-bold text-brand-gray uppercase mb-1">{label}</label>
        <p className="text-brand-light text-sm whitespace-pre-wrap min-h-[2.1rem] pt-2">
          {getDisplayValue()}
        </p>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-brand-dark-secondary rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700/50 flex justify-between items-center sticky top-0 bg-brand-dark-secondary z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Detalhes da Perícia</h2>
            <p className="text-brand-gray font-mono text-sm">Processo Nº {pericia.id}</p>
          </div>
          <button onClick={onClose} aria-label="Fechar modal" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700/50">
            <XIcon />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-gray uppercase mb-1">Cliente</label>
              <p className="text-brand-light text-sm">{pericia.defendant}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-gray uppercase mb-1">Status</label>
              {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 text-brand-light text-sm focus:ring-brand-cyan-500 focus:border-brand-cyan-500 transition"
                  >
                    <option>Em Andamento</option>
                    <option>Concluído</option>
                    <option>Pendente</option>
                    <option>Arquivado</option>
                  </select>
              ) : (
                <span className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(pericia.status)}`}>
                  {pericia.status}
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('Autor', 'plaintiff')}
            {renderField('Réu', 'defendant')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('Cidade', 'city')}
            {renderField('Vara', 'description')}
          </div>
          
          {renderField('Descrição', 'description', 'textarea')}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-700/50 pt-4">
            {renderField('Valor da Causa', 'caseValue', 'number', true)}
            {renderField('Honorários', 'feesReceived', 'number', true)}
            {renderField('Pagamentos Recebidos', 'feesCharged', 'number', true)}
          </div>
        </div>

        <div className="p-6 border-t border-gray-700/50 flex justify-end space-x-4 sticky bottom-0 bg-brand-dark-secondary z-10">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelClick}
                className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveClick}
                className="bg-brand-cyan-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-cyan-600 transition duration-300"
              >
                Salvar Alterações
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Fechar
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-brand-cyan-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-cyan-600 transition duration-300"
              >
                Editar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesModal;

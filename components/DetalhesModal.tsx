
import React, { useEffect, useState } from 'react';
import type { Pericia } from '../types';
import { getStatusClass } from './Pericias';
import { XIcon } from './Icons';

interface DetalhesModalProps {
  pericia: Pericia;
  onClose: () => void;
  onSave: (pericia: Pericia) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const DetalhesModal: React.FC<DetalhesModalProps> = ({ pericia, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Pericia>(pericia);

  // Sync formData if the initial pericia prop changes (e.g., when opening a different item)
  useEffect(() => {
    setFormData(pericia);
  }, [pericia]);

  // Effect for Escape key and body overflow
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
    const { name, value, type } = e.target;
    const isNumberInput = type === 'number';
    setFormData(prev => ({
      ...prev,
      [name]: isNumberInput ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(pericia);
    setIsEditing(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-brand-dark-secondary rounded-lg shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] border border-gray-700/50 transform animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700/50 sticky top-0 bg-brand-dark-secondary z-10">
          <div className="flex items-center gap-4">
            <h2 id="modal-title" className="text-2xl font-bold text-white">Detalhes do Processo</h2>
            {!isEditing && (
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(formData.status)}`}>
                {formData.status}
              </span>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="text-brand-gray hover:text-white transition-colors duration-200"
            aria-label="Fechar modal"
          >
            <XIcon />
          </button>
        </div>
        
        <div className="overflow-y-auto">
          <form className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="input-label">Número do Processo</label>
                <input type="text" readOnly value={formData.id} className="input-field-readonly" />
              </div>
              <div className="form-group">
                  <label className="input-label">Data Inicial</label>
                  <input type={isEditing ? 'date' : 'text'} readOnly={!isEditing} name="abertura" value={isEditing ? formData.abertura : new Date(formData.abertura).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} onChange={handleChange} className={isEditing ? 'input-field-editable' : 'input-field-readonly'}/>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group"><label className="input-label">Autor</label><input type="text" readOnly={!isEditing} name="autor" value={formData.autor} onChange={handleChange} className={isEditing ? 'input-field-editable' : 'input-field-readonly'} /></div>
              <div className="form-group"><label className="input-label">Réu</label><input type="text" readOnly={!isEditing} name="reu" value={formData.reu} onChange={handleChange} className={isEditing ? 'input-field-editable' : 'input-field-readonly'} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group"><label className="input-label">Cidade</label><input type="text" readOnly={!isEditing} name="cidade" value={formData.cidade} onChange={handleChange} className={isEditing ? 'input-field-editable' : 'input-field-readonly'} /></div>
              <div className="form-group"><label className="input-label">Vara</label><input type="text" readOnly={!isEditing} name="vara" value={formData.vara} onChange={handleChange} className={isEditing ? 'input-field-editable' : 'input-field-readonly'} /></div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                    <label className="input-label">Cliente</label>
                    <input type="text" readOnly={!isEditing} name="cliente" value={formData.cliente} onChange={handleChange} className={isEditing ? 'input-field-editable' : 'input-field-readonly'} />
                </div>
                <div className="form-group">
                    <label className="input-label">Status</label>
                    {isEditing ? (
                    <select name="status" value={formData.status} onChange={handleChange} className="input-field-editable">
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Arquivado">Arquivado</option>
                    </select>
                    ) : (
                    <input type="text" readOnly value={formData.status} className="input-field-readonly" />
                    )}
                </div>
            </div>
            <div className="form-group">
                <label className="input-label">Descrição</label>
                <textarea readOnly={!isEditing} name="descricao" value={formData.descricao} rows={4} onChange={handleChange} className={isEditing ? 'input-field-editable resize-y' : 'input-field-readonly resize-none'}></textarea>
            </div>
            <div className="border-t border-gray-700/50 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group"><label className="input-label">Valor da Causa</label>{isEditing ? (<input type="number" name="valorCausa" value={formData.valorCausa} onChange={handleChange} className="input-field-editable" />) : (<input type="text" readOnly value={formatCurrency(formData.valorCausa)} className="input-field-readonly" />)}</div>
              <div className="form-group"><label className="input-label">Honorários Cobrados</label>{isEditing ? (<input type="number" name="honorarios" value={formData.honorarios} onChange={handleChange} className="input-field-editable" />) : (<input type="text" readOnly value={formatCurrency(formData.honorarios)} className="input-field-readonly" />)}</div>
              <div className="form-group"><label className="input-label">Pagamentos Recebidos</label>{isEditing ? (<input type="number" name="pagamentosRecebidos" value={formData.pagamentosRecebidos} onChange={handleChange} className="input-field-editable" />) : (<input type="text" readOnly value={formatCurrency(formData.pagamentosRecebidos)} className="input-field-readonly" />)}</div>
            </div>
          </form>
        </div>
        <div className="flex justify-end items-center p-6 border-t border-gray-700/50 mt-auto bg-brand-dark-secondary sticky bottom-0 z-10">
          {isEditing ? (
            <div className="flex gap-4">
              <button onClick={handleCancel} className="btn btn-secondary">Cancelar</button>
              <button onClick={handleSave} className="btn btn-primary">Salvar Alterações</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">Editar</button>
          )}
        </div>
      </div>
       <style>{`
        .input-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: #a0aec0;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .input-field-readonly, .input-field-editable {
          width: 100%;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          color: #e2e8f0;
          font-size: 0.875rem;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field-readonly {
          background-color: #1a202c;
          border: 1px solid #4a5568;
          cursor: default;
        }
        .input-field-editable {
          background-color: #2d3748;
          border: 1px solid #a0aec0;
          cursor: text;
        }
        .input-field-editable:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 1px #06b6d4;
        }
        .btn {
          padding: 0.5rem 1.25rem;
          border-radius: 0.375rem;
          font-weight: 700;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-primary {
          background-color: #06b6d4;
          color: white;
          border: 1px solid #06b6d4;
        }
        .btn-primary:hover {
          background-color: #0891b2;
          border-color: #0891b2;
        }
        .btn-secondary {
          background-color: transparent;
          color: #a0aec0;
          border: 1px solid #4a5568;
        }
        .btn-secondary:hover {
          background-color: #4a5568;
          color: white;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes slide-in-up {
          from { transform: translateY(20px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DetalhesModal;

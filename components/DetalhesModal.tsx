
import React, { useEffect } from 'react';
import { Pericia } from './Pericias';
import { XIcon } from './Icons';

interface DetalhesModalProps {
  pericia: Pericia;
  onClose: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const DetalhesModal: React.FC<DetalhesModalProps> = ({ pericia, onClose }) => {
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-brand-dark-secondary rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700/50 transform animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700/50 sticky top-0 bg-brand-dark-secondary z-10">
          <h2 id="modal-title" className="text-2xl font-bold text-white">Detalhes do Processo</h2>
          <button 
            onClick={onClose} 
            className="text-brand-gray hover:text-white transition-colors duration-200"
            aria-label="Fechar modal"
          >
            <XIcon />
          </button>
        </div>
        <form className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-xs font-medium text-brand-gray mb-1 uppercase tracking-wider">Número do Processo</label>
              <input type="text" readOnly value={pericia.id} className="input-field" />
            </div>
            <div className="form-group">
                <label className="block text-xs font-medium text-brand-gray mb-1 uppercase tracking-wider">Data Inicial</label>
                <input type="text" readOnly value={new Date(pericia.abertura).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-xs font-medium text-brand-gray mb-1 uppercase tracking-wider">Autor</label>
              <input type="text" readOnly value={pericia.autor} className="input-field" />
            </div>
            <div className="form-group">
              <label className="block text-xs font-medium text-brand-gray mb-1 uppercase tracking-wider">Réu</label>
              <input type="text" readOnly value={pericia.reu} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-xs font-medium text-brand-gray mb-1 uppercase tracking-wider">Cidade</label>
              <input type="text" readOnly value={pericia.cidade} className="input-field" />
            </div>
            <div className="form-group">
              <label className="block text-xs font-medium text-brand-gray mb-1 uppercase tracking-wider">Vara</label>
              <input type="text" readOnly value={pericia.vara} className="input-field" />
            </div>
          </div>
          <div className="form-group">
            <label className="block text-xs font-medium text-brand-gray mb-1 uppercase tracking-wider">Descrição</label>
            <textarea readOnly value={pericia.descricao} rows={4} className="input-field resize-none"></textarea>
          </div>
          <div className="border-t border-gray-700/50 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="block text-xs font-medium text-brand-gray mb-1 uppercase tracking-wider">Valor da Causa</label>
              <input type="text" readOnly value={formatCurrency(pericia.valorCausa)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="block text-xs font-medium text-brand-gray mb-1 uppercase tracking-wider">Honorários Cobrados</label>
              <input type="text" readOnly value={formatCurrency(pericia.honorarios)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="block text-xs font-medium text-brand-gray mb-1 uppercase tracking-wider">Pagamentos Recebidos</label>
              <input type="text" readOnly value={formatCurrency(pericia.pagamentosRecebidos)} className="input-field" />
            </div>
          </div>
        </form>
      </div>
       <style>{`
        .form-group {
          position: relative;
        }
        .input-field {
          width: 100%;
          background-color: #1a202c;
          border: 1px solid #4a5568;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          color: #e2e8f0;
          font-size: 0.875rem;
          font-family: inherit;
          cursor: default;
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
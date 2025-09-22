import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Pericias from '../components/Pericias';
import type { Pericia } from '../types';

const PericiasPage: React.FC = () => {
  const [periciasData, setPericiasData] = useState<Pericia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPericias = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/pericias');
        if (!res.ok) {
          throw new Error('Falha ao buscar os dados da API.');
        }
        const data = await res.json();
        setPericiasData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
        setError(`Falha ao buscar os dados. ${errorMessage}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPericias();
  }, []);

  return (
    <div className="bg-brand-dark text-brand-light min-h-screen font-sans">
      <Header />
      <Pericias pericias={periciasData} isLoading={isLoading} error={error} />
    </div>
  );
};

export default PericiasPage;
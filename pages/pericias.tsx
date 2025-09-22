import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Pericias from '../components/Pericias';
import type { Pericia } from '../types';
import { periciasMockData } from './api/pericias';

const PericiasPage: React.FC = () => {
  const [periciasData, setPericiasData] = useState<Pericia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPericias = () => {
      setIsLoading(true);
      setError(null);
      // Simulate network delay for a better user experience
      setTimeout(() => {
        try {
          setPericiasData(periciasMockData);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
          setError(`Falha ao carregar os dados. ${errorMessage}`);
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
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

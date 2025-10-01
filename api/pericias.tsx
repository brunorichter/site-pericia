import React, { useState, useEffect } from 'react';
import Header from '../pages/Header';
// import Pericias from '../pages/Pericias';
import type { Pericia } from '../types';
import setPericiasList from './pericias/routes';


const PericiasPage: React.FC = () => {
  const [periciasData, setPericiasData] = useState<Pericia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const fetchPericias = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/pericias");
        if (!res.ok) throw new Error("Erro ao buscar perícias");
        const data = await res.json();
        setPericiasList(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPericias();
  }, []);
  return (
    <div className="bg-brand-dark text-brand-light min-h-screen font-sans">
    </div>
  );
};
export default PericiasPage;

import React, { useEffect, useState } from "react";
import type { Pericia } from "../../types";

const Pericias: React.FC = () => {
  const [, setPericiasList] = useState<Pericia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  if (isLoading) return `<p>Carregando…</p>`;
  if (error)     return `<p>Erro: ${error}</p>`;
  // ...renderização do componente...
};

export default Pericias;
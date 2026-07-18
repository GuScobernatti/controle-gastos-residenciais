import { useState, useEffect } from "react";

interface SummaryData {
  totalReceitas: number;
  totalDespesas: number;
  saldoGeral: number;
}

function SummaryCards(counter: { counter: number }) {
  const [data, setData] = useState({} as SummaryData);

  useEffect(() => {
    const fetchData = async () => {
      // Os totais são calculados e centralizados no Back-end via LINQ. O Front-end atua apenas como camada de apresentação, consumindo o objeto "resumoGeral".
      try {
        const response = await fetch("https://localhost:7125/api/people");
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const result = await response.json();
        setData(result.resumoGeral);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [counter]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
        <h3 className="text-gray-500 text-sm font-medium uppercase">
          Total de Receitas
        </h3>
        <p className="text-2xl font-bold text-green-600 mt-2">
          {data.totalReceitas?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }) || "R$ 0,00"}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
        <h3 className="text-gray-500 text-sm font-medium uppercase">
          Total de Despesas
        </h3>
        <p className="text-2xl font-bold text-red-600 mt-2">
          {data.totalDespesas?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }) || "R$ 0,00"}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
        <h3 className="text-gray-500 text-sm font-medium uppercase">
          Saldo Geral
        </h3>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {data.saldoGeral?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }) || "R$ 0,00"}
        </p>
      </div>
    </div>
  );
}

export default SummaryCards;

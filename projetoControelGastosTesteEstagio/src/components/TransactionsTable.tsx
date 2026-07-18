import { useState, useEffect } from "react";

interface InfoTransaction {
  id: number;
  description: string;
  amount: number;
  category: number;
  personName: string;
}

function TransactionsTable({ counter }: { counter: number }) {
  const [transactions, setTransactions] = useState([] as InfoTransaction[]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7125/api/transactions");
        if (!response.ok) {
          throw new Error("Erro ao buscar transações.");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchData();
  }, [counter]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-8">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Histórico Geral de Lançamentos
          </h2>
          <span className="text-sm text-gray-500">
            Todas as transações da residência
          </span>
        </div>

        <input
          type="text"
          placeholder="Pesquisar lançamento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="max-h-96 overflow-y-auto overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm uppercase border-b">
              <th className="p-4 font-semibold">Descrição</th>
              <th className="p-4 font-semibold">Valor</th>
              <th className="p-4 font-semibold text-center">Categoria</th>
              <th className="p-4 font-semibold text-center">Nome da Pessoa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* 
              Filtragem local (client-side) implementada para otimizar a performance da interface. 
              Isso evita o disparo de requisições desnecessárias ao servidor a cada nova letra digitada 
              na barra de pesquisa.
            */}
            {transactions
              .filter(
                (t) =>
                  t.description.toLowerCase().includes(search.toLowerCase()) ||
                  t.personName.toLowerCase().includes(search.toLowerCase()),
              )
              .map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {transaction.description}
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    {transaction.amount?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${Number(transaction.category) == 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {Number(transaction.category) == 0
                        ? "Receita"
                        : "Despesa"}
                    </span>
                  </td>
                  <td className="p-4 text-center text-gray-500 text-sm">
                    {transaction.personName}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          Nenhuma transação encontrada.
        </div>
      )}

      {transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.personName.toLowerCase().includes(search.toLowerCase()),
      ).length === 0 && (
        <div className="p-8 text-center text-gray-400">
          Nenhuma transação encontrada.
        </div>
      )}
    </div>
  );
}

export default TransactionsTable;

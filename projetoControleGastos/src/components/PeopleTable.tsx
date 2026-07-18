import { useState, useEffect } from "react";

interface InfoPeople {
  id: number;
  name: string;
  age: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

function PeopleTable({
  onOpenTransactionModal,
  onOpenAddPersonModal,
  getPersonId,
  counter,
  onSuccess,
}: {
  onOpenTransactionModal: () => void;
  onOpenAddPersonModal: () => void;
  getPersonId: (personId: number) => void;
  counter: number;
  onSuccess: () => void;
}) {
  const [people, setPeople] = useState([] as InfoPeople[]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7125/api/people");
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const result = await response.json();
        setPeople(result.pessoas);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [counter]);

  const handleDelete = async (personId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta pessoa?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7125/api/people/${personId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error("Erro ao excluir pessoa");
      }

      onSuccess();
      setPeople(people.filter((person) => person.id !== personId));
    } catch (error) {
      console.error("Erro ao excluir pessoa:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-8">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <input
          type="text"
          placeholder="Pesquisar pessoa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
          onClick={() => onOpenAddPersonModal()}
        >
          + Adicionar Pessoa
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm uppercase border-b">
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Idade</th>
              <th className="p-4 font-semibold">Receitas</th>
              <th className="p-4 font-semibold">Despesas</th>
              <th className="p-4 font-semibold">Saldo</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* 
              Filtragem local (client-side) implementada para otimizar a performance da interface. 
              Isso evita o disparo de requisições desnecessárias ao servidor a cada nova letra digitada 
              na barra de pesquisa.
            */}
            {people
              .filter((person) =>
                person.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((person) => (
                <tr
                  key={person.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {person.name}
                  </td>
                  <td className="p-4 text-gray-600">{person.age} anos</td>
                  <td className="p-4 text-green-600 font-medium">
                    {person?.totalReceitas?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) || "R$ 0,00"}
                  </td>
                  <td className="p-4 text-red-600 font-medium">
                    {person?.totalDespesas?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) || "R$ 0,00"}
                  </td>
                  <td className="p-4 text-blue-600 font-bold">
                    {person?.saldo?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) || "R$ 0,00"}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100 transition-colors text-sm font-medium cursor-pointer"
                      onClick={() => {
                        onOpenTransactionModal();
                        getPersonId(Number(person.id));
                      }}
                    >
                      + Transação
                    </button>
                    <button
                      className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition-colors text-sm font-medium cursor-pointer"
                      onClick={() => handleDelete(person.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PeopleTable;

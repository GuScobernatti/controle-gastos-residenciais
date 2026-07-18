import { useEffect, useActionState, useState } from "react";
import { Bounce, toast } from "react-toastify";

interface ActionState {
  message: string;
  sucesso: boolean;
  data?: any;
}

function AddTransactionModal({
  onClose,
  selectedPersonId,
  onSuccess,
}: {
  onClose: () => void;
  selectedPersonId: number | null;
  onSuccess: () => void;
}) {
  // Utilização do hook useActionState para gerenciar o ciclo de vida do formulário de forma nativa.
  // Ele gerencia o estado de ações de formulário eliminando a necessidade de criar múltiplos useState para cada estado, como loading, error, response, values, etc. Isso simplifica o código e melhora a legibilidade.
  const [response, formAction, isPending] = useActionState(
    async (prevState: ActionState | null, formData: FormData) => {
      try {
        const description = formData.get("description");
        const amount = Number(formData.get("amount"));
        const category = Number(formData.get("type"));
        const personId = Number(selectedPersonId);

        const res = await fetch("https://localhost:7125/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description, amount, category, personId }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          return {
            message: errorData.message || "Erro ao cadastrar transação.",
            sucesso: false,
          };
        }
        return {
          message: "Transação cadastrada com sucesso!",
          sucesso: true,
          data: await res.json(),
        };
      } catch (error) {
        console.error("Erro ao cadastrar transação:", error);
        return {
          message: "Erro de conexão com o servidor.",
          sucesso: false,
        };
      }
    },
    null,
  );

  const [personData, setPersonData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPersonId) return;

      // Busca os dados específicos da pessoa para aplicar regras de negócio visuais e condicionais diretamente na interface (ex: ocultar a categoria "Receita" para menores de 18 anos).
      try {
        const response = await fetch(
          `https://localhost:7125/api/people/${selectedPersonId}`,
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados da pessoa.");
        }
        const data = await response.json();
        setPersonData(data);
      } catch (error) {
        console.error("Erro ao buscar dados da pessoa:", error);
      }
    };

    fetchData();
  }, [selectedPersonId]);

  useEffect(() => {
    if (!response) return;

    if (response.sucesso) {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

      onSuccess();
    } else {
      toast.error(response.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [response]);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Nova Transação</h2>
          <button
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={() => {
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        {/* Exibe um aviso visual caso a pessoa selecionada seja menor de 18 anos, informando que apenas despesas podem ser registradas para menores de idade. */}
        {personData && personData.age < 18 && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
            Você está adicionando uma transação para{" "}
            <strong>
              {personData.name} ({personData.age} anos)
            </strong>
            . Menores de 18 anos só podem registrar despesas.
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              name="description"
              placeholder="Ex: Conta de Luz"
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor
              </label>
              <input
                type="number"
                name="amount"
                step="0.01"
                required
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                name="type"
                required
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                {/* Condição para exibir apenas a categoria "Despesa" para menores de 18 anos */}
                {personData && personData.age < 18 ? (
                  <option value="1">Despesa</option>
                ) : (
                  <>
                    <option value="0">Receita</option>
                    <option value="1">Despesa</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => {
                onClose();
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;

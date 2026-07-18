import { useActionState, useEffect } from "react";
import { Bounce, toast } from "react-toastify";

interface ActionState {
  message: string;
  sucesso: boolean;
  data?: any;
}

function AddPersonModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  // Utilização do hook useActionState para gerenciar o ciclo de vida do formulário de forma nativa.
  // Ele gerencia o estado de ações de formulário eliminando a necessidade de criar múltiplos useState para cada estado, como loading, error, response, values, etc. Isso simplifica o código e melhora a legibilidade.
  const [response, formAction, isPending] = useActionState(
    async (prevState: ActionState | null, formData: FormData) => {
      try {
        const name = formData.get("name");
        const age = Number(formData.get("age"));

        const res = await fetch("https://localhost:7125/api/people", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, age }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          return {
            message: errorData.message || "Erro ao cadastrar usuário.",
            sucesso: false,
          };
        }
        return {
          message: "Usuário cadastrado com sucesso!",
          sucesso: true,
          data: await res.json(),
        };
      } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return {
          message: "Erro de conexão com o servidor.",
          sucesso: false,
        };
      }
    },
    null,
  );

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
          <h2 className="text-xl font-bold text-gray-800">Nova Pessoa</h2>
          <button
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={() => {
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idade
            </label>
            <input
              type="number"
              name="age"
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPersonModal;

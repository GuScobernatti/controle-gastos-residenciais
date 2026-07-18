import { useState } from "react";
import SummaryCards from "./SummaryCards";
import PeopleTable from "./PeopleTable";
import AddPersonModal from "./AddPersonModal";
import AddTransactionModal from "./AddTransactionModal";
import TransactionTable from "./TransactionsTable";

function Home() {
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  // Variável de estado utilizada como re-renderizador automático de componentes.
  // Ao ser incrementada, força os componentes a refazerem o fetch na API sem a necessidade de forçar o reload da página.
  const [counter, setCounter] = useState(0);

  const handleSuccess = () => {
    setIsAddPersonModalOpen(false);
    setIsAddTransactionModalOpen(false);
    setCounter((prev) => prev + 1);
  };

  const getPersonId = (personId: number) => {
    setSelectedPersonId(personId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-800">
            Controle de Gastos Residencial
          </h1>
        </header>

        <SummaryCards counter={counter} />

        <PeopleTable
          onOpenTransactionModal={() => setIsAddTransactionModalOpen(true)}
          onOpenAddPersonModal={() => setIsAddPersonModalOpen(true)}
          getPersonId={getPersonId}
          counter={counter}
          onSuccess={handleSuccess}
        />

        <TransactionTable counter={counter} />
      </div>

      {isAddPersonModalOpen && (
        <AddPersonModal
          onClose={() => setIsAddPersonModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}

      {isAddTransactionModalOpen && (
        <AddTransactionModal
          onClose={() => setIsAddTransactionModalOpen(false)}
          selectedPersonId={selectedPersonId}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Home;

using System.Text.Json.Serialization;

namespace Expenses_Control.Models
{
    // Enum utilizado para facilitar a lógica de categorias entre Receita e Despesa, utilizando apenas os valores 0 e 1 para indicar a respectiva categoria.
    public enum TransactionType
    {
        Receita,
        Despesa
    }
    public class Transaction
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public TransactionType Category { get; set; }
        public int PersonId { get; set; }

        // Ignora a propriedade Person para evitar referência circular ao converter o objeto Transaction para JSON, uma vez que a classe Person também possui uma lista de Transactions.
        [JsonIgnore]
        public Person? Person { get; set; }
    }
}

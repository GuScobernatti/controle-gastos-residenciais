using Expenses_Control.Data;
using Expenses_Control.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Expenses_Control.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        public TransactionsController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public IActionResult Create([FromBody] Transaction transaction)
        {
            var person = _appDbContext.People.Find(transaction.PersonId);
            if (person == null)
            {
                return NotFound(new { message = "Pessoa não encontrada." });
            }

            // Regra de negócio exigida: Menores de 18 anos só podem registrar despesas.
            if (person.Age < 18 && transaction.Category == TransactionType.Receita)
            {
                return BadRequest(new { message = "Menores de idade não podem registrar receita. Apenas podem registrar despesas." });
            }

            _appDbContext.Transactions.Add(transaction);
            _appDbContext.SaveChanges();
            return Created("", transaction);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var transactions = _appDbContext.Transactions
        .Include(t => t.Person)
        // Formata o retorno para o front-end entregando apenas o Nome da pessoa em vez de carregar o objeto inteiro.
        .Select(t => new
        {
            t.Id,
            t.Description,
            t.Amount,
            t.Category,
            PersonName = t.Person!.Name
        })
        .ToList();

            return Ok(transactions);
        }
    }
}

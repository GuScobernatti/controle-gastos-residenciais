using Expenses_Control.Data;
using Expenses_Control.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Expenses_Control.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        public PeopleController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public IActionResult Create([FromBody] Person person)
        {
            // Lógica de validação para verificar se já existe uma pessoa com o mesmo nome (ignorando maiúsculas e minúsculas), usado como meio de convenção de sistemas.
            bool existingName = _appDbContext.People.Any(p => p.Name.ToLower() == person.Name.ToLower());

            if (existingName)
            {
                return BadRequest(new { message = "Já existe uma pessoa cadastrada com este nome." });
            }

            _appDbContext.People.Add(person);
            _appDbContext.SaveChanges();
            return Created("", person);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var people = _appDbContext.People.Include(p => p.Transactions).ToList();
            // O LINQ abaixo formata o retorno para o front-end, calculando dinamicamente o total de receitas, despesas e o saldo líquido baseado no histórico da pessoa.
            var listaFormatada = people.Select(p => new
            {
                p.Id,
                p.Name,
                p.Age,
                TotalReceitas = p.Transactions.Where(t => t.Category == TransactionType.Receita).Sum(t => t.Amount),
                TotalDespesas = p.Transactions.Where(t => t.Category == TransactionType.Despesa).Sum(t => t.Amount),
                Saldo = p.Transactions.Where(t => t.Category == TransactionType.Receita).Sum(t => t.Amount) -
                p.Transactions.Where(t => t.Category == TransactionType.Despesa).Sum(t => t.Amount)
            }).ToList();

            decimal totalPeopleIncome = listaFormatada.Sum(p => p.TotalReceitas);
            decimal totalPeopleExpense = listaFormatada.Sum(p => p.TotalDespesas);
            decimal totalPeopleBalance = totalPeopleIncome - totalPeopleExpense;

            return Ok(new
            {
                Pessoas = listaFormatada,
                ResumoGeral = new
                {
                    TotalReceitas = totalPeopleIncome,
                    TotalDespesas = totalPeopleExpense,
                    SaldoGeral = totalPeopleBalance
                }
            });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var person = _appDbContext.People
        .Include(p => p.Transactions)
        .FirstOrDefault(p => p.Id == id);

            if (person == null)
            {
                return NotFound(new { message = "Pessoa não encontrada." });
            }

            var pessoaFormatada = new
            {
                person.Id,
                person.Name,
                person.Age,
                TotalReceitas = person.Transactions.Where(t => t.Category == TransactionType.Receita).Sum(t => t.Amount),
                TotalDespesas = person.Transactions.Where(t => t.Category == TransactionType.Despesa).Sum(t => t.Amount),
                Saldo = person.Transactions.Where(t => t.Category == TransactionType.Receita).Sum(t => t.Amount) -
                        person.Transactions.Where(t => t.Category == TransactionType.Despesa).Sum(t => t.Amount)
            };

            return Ok(pessoaFormatada);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // Busca e remove todas as transações vinculadas à pessoa antes de excluí-la, garantindo a integridade do banco de dados e as exigências de negócio.
            var person = _appDbContext.People.Find(id);
            var personTransactions = _appDbContext.Transactions.Where(t => t.PersonId == id).ToList();
            
            if (person == null)
            {
                return NotFound(new { message = "Pessoa não encontrada." });
            }
            _appDbContext.People.Remove(person);
            _appDbContext.Transactions.RemoveRange(personTransactions);
            _appDbContext.SaveChanges();
            return NoContent();
        }
    }
}

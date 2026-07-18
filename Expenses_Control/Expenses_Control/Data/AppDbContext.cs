using Expenses_Control.Models;
using Microsoft.EntityFrameworkCore;

namespace Expenses_Control.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Person> People { get; set; }
    }
}

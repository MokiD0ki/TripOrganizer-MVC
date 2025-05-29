using Microsoft.EntityFrameworkCore;
using TripOrganizer.Models;

namespace TripOrganizer.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Trip> Trips { get; set; } = null!;
        public DbSet<TripParticipant> TripParticipants { get; set; } = null!;

        public DbSet<TripOwner> TripOwners { get; set; } = null!;
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TripOwner>()
                .HasKey(to => new { to.TripId, to.UserId });

            modelBuilder.Entity<TripOwner>()
                .HasOne(to => to.Trip)
                .WithMany(t => t.Owners)
                .HasForeignKey(to => to.TripId);

            modelBuilder.Entity<TripOwner>()
                .HasOne(to => to.User)
                .WithMany(u => u.TripsOwned)
                .HasForeignKey(to => to.UserId);
        }

    }
}

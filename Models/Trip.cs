using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace TripOrganizer.Models
{
    public class Trip
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Destination { get; set; } = string.Empty;

        [Required]
        [Range(1, 100)]
        public int Capacity { get; set; }

        public string Description { get; set; } = string.Empty;

        public int OwnerId { get; set; }

        [ValidateNever] // Ignore during model validation
        public User Owner { get; set; } = null!;
        
        public List<TripParticipant> Participants { get; set; } = new();

        public List<TripOwner> Owners { get; set; } = new();


    }
}
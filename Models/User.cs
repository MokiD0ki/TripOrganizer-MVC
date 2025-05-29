using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TripOrganizer.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
        
        public List<TripOwner> TripsOwned { get; set; } = new();

        // Trips the user signed up for
        public List<TripParticipant> TripParticipants { get; set; } = new();
    }
}
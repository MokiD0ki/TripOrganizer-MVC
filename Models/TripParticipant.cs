namespace TripOrganizer.Models
{
    public class TripParticipant
    {
        public int Id { get; set; }
        
        public int TripId { get; set; }
        public Trip Trip { get; set; } = null!;
        
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
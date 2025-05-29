namespace TripOrganizer.Models
{
    public class TripOwner
    {
        public int TripId { get; set; }
        public Trip Trip { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}

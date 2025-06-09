using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripOrganizer.Data;
using TripOrganizer.Models;

namespace TripOrganizer.Controllers
{
    [ApiController]
    [Route("api/trips")]
    public class TripsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TripsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetTrips()
        {
            var trips = await _context.Trips
                .Select(t => new {
                    t.Id,
                    t.Title,
                    t.Destination,
                    t.Date,
                    t.Capacity,
                    t.Description
                })
                .ToListAsync();

            return Ok(trips);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetTrip(int id)
        {
            var trip = await _context.Trips
                .Include(t => t.Participants)
                    .ThenInclude(tp => tp.User)
                .Include(t => t.Owner)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trip == null)
                return NotFound();

            var result = new
            {
                trip.Id,
                trip.Title,
                trip.Destination,
                trip.Date,
                trip.Capacity,
                trip.Description,
                Participants = trip.Participants
                    .Where(p => p.User != null)
                    .Select(p => p.User.Username)
                    .ToList(),
                Organizer = trip.Owner?.Username
            };

            return Ok(result);
        }
    }
}

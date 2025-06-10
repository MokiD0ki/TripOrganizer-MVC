using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TripOrganizer.Data;
using TripOrganizer.Models;

namespace TripOrganizer.Controllers
{
    [Route("api/trips")]
    [ApiController]
    public class TripsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TripsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTrips()
        {
            var trips = await _context.Trips
                .Include(t => t.Participants).ThenInclude(p => p.User)
                .Include(t => t.Owners).ThenInclude(o => o.User)
                .Include(t => t.Owner)
                .ToListAsync();

            var result = trips.Select(t => new
            {
                t.Id,
                t.Title,
                t.Destination,
                t.Capacity,
                Participants = t.Participants
                    .Where(p => p.User != null)
                    .Select(p => new { p.User.Id, p.User.Username })
                    .ToList(),
                Owners = t.Owners
                    .Where(o => o.User != null)
                    .Select(o => new { o.User.Id, o.User.Username })
                    .ToList()
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTrip(int id)
        {
            var trip = await _context.Trips
                .Include(t => t.Participants).ThenInclude(tp => tp.User)
                .Include(t => t.Owner)
                .Include(t => t.Owners).ThenInclude(o => o.User)
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
                Organizer = trip.Owner?.Username,
                Owners = trip.Owners.Where(o => o.User != null).Select(o => new { o.User.Id, o.User.Username }).ToList(),
                Participants = trip.Participants.Where(p => p.User != null).Select(p => new { p.User.Id, p.User.Username }).ToList()
            };

            return Ok(result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(int id, [FromBody] Trip updatedTrip)
        {
            if (id != updatedTrip.Id)
                return BadRequest();

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("nameidentifier"));
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);

            var existingTrip = await _context.Trips
                .Include(t => t.Owners)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (existingTrip == null)
                return NotFound();

            if (!existingTrip.Owners.Any(o => o.UserId == userId))
                return Forbid();

            existingTrip.Title = updatedTrip.Title;
            existingTrip.Destination = updatedTrip.Destination;
            existingTrip.Date = updatedTrip.Date;
            existingTrip.Capacity = updatedTrip.Capacity;
            existingTrip.Description = updatedTrip.Description;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateTrip([FromBody] Trip newTrip)
        {
            _context.Trips.Add(newTrip);
            await _context.SaveChangesAsync();

            _context.TripOwners.Add(new TripOwner
            {
                TripId = newTrip.Id,
                UserId = newTrip.OwnerId
            });
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTrip), new { id = newTrip.Id }, newTrip);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("nameidentifier"));
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);

            var trip = await _context.Trips
                .Include(t => t.Participants)
                .Include(t => t.Owners)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trip == null)
                return NotFound();

            if (!trip.Owners.Any(o => o.UserId == userId))
                return Forbid();

            _context.TripParticipants.RemoveRange(trip.Participants);
            _context.TripOwners.RemoveRange(trip.Owners);
            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost("{id}/join")]
        public async Task<IActionResult> JoinTrip(int id, [FromBody] JoinLeaveDto dto)
        {
            var trip = await _context.Trips.Include(t => t.Participants).FirstOrDefaultAsync(t => t.Id == id);
            if (trip == null) return NotFound();

            if (trip.Participants.Any(p => p.UserId == dto.UserId))
                return BadRequest("Already joined.");

            if (trip.Participants.Count >= trip.Capacity)
                return BadRequest("Trip is full.");

            _context.TripParticipants.Add(new TripParticipant { TripId = id, UserId = dto.UserId });
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost("{id}/leave")]
        public async Task<IActionResult> LeaveTrip(int id, [FromBody] JoinLeaveDto dto)
        {
            var participant = await _context.TripParticipants.FirstOrDefaultAsync(p => p.TripId == id && p.UserId == dto.UserId);
            if (participant == null) return NotFound();

            var trip = await _context.Trips.Include(t => t.Owners).FirstOrDefaultAsync(t => t.Id == id);
            if (trip != null && trip.OwnerId != dto.UserId)
            {
                var owner = trip.Owners.FirstOrDefault(o => o.UserId == dto.UserId);
                if (owner != null)
                {
                    _context.TripOwners.Remove(owner);
                }
            }

            _context.TripParticipants.Remove(participant);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost("{tripId}/owners/add")]
        public async Task<IActionResult> AddOwner(int tripId, [FromBody] JoinLeaveDto dto)
        {
            var trip = await _context.Trips
                .Include(t => t.Owners)
                .Include(t => t.Participants)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null) return NotFound();
            if (!trip.Participants.Any(p => p.UserId == dto.UserId)) return BadRequest("User is not a participant");
            if (trip.Owners.Any(o => o.UserId == dto.UserId)) return BadRequest("User is already an owner");

            _context.TripOwners.Add(new TripOwner { TripId = tripId, UserId = dto.UserId });
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost("{tripId}/owners/remove")]
        public async Task<IActionResult> RemoveOwner(int tripId, [FromBody] JoinLeaveDto dto)
        {
            var trip = await _context.Trips
                .Include(t => t.Owners)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null) return NotFound();
            if (!trip.Owners.Any(o => o.UserId == dto.UserId)) return BadRequest("User is not an owner");
            if (trip.OwnerId == dto.UserId) return BadRequest("Cannot remove primary owner");

            var ownerLink = trip.Owners.FirstOrDefault(o => o.UserId == dto.UserId);
            if (ownerLink != null)
            {
                _context.TripOwners.Remove(ownerLink);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        public class JoinLeaveDto
        {
            public int UserId { get; set; }
        }
    }
}

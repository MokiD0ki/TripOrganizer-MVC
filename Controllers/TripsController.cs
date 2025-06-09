using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using TripOrganizer.Data;
using TripOrganizer.Models;
using Microsoft.AspNetCore.Http;

namespace TripOrganizer.Controllers
{
    public class TripsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TripsController(ApplicationDbContext context)
        {
            _context = context;
        }


        // GET: Trips
        // public async Task<IActionResult> Index()
        // {
        //     var applicationDbContext = _context.Trips
        //         .Include(t => t.Owner)
        //         .Include(t => t.Participants)
        //             .ThenInclude(tp => tp.User)
        //         .Include(t => t.Owners)
        //             .ThenInclude(o => o.User);

        //     return View(await applicationDbContext.ToListAsync());   
        // }

        public IActionResult Index()
        {
            return NoContent(); // or Redirect(...) or a minimal response
        }



        // GET: Trips/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Trips == null)
            {
                return NotFound();
            }

            var trip = await _context.Trips
                .Include(t => t.Owner)
                .Include(t => t.Participants)
                    .ThenInclude(tp => tp.User)
                .Include(t => t.Owners)
                    .ThenInclude(o => o.User)
                .FirstOrDefaultAsync(m => m.Id == id);


            if (trip == null)
            {
                return NotFound();
            }

            return View(trip);
        }


        // GET: Trips/Create
        public IActionResult Create()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return RedirectToAction("Login", "Auth");
            }

            return View();
        }


        // POST: Trips/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Title,Date,Destination,Capacity,Description")] Trip trip)
        {
            var userId = HttpContext.Session.GetInt32("UserId");

                    // 🔍 Debug output
            Console.WriteLine("UserId: " + userId);
            Console.WriteLine("Model is valid: " + ModelState.IsValid);

            if (userId == null)
            {
                return RedirectToAction("Login", "Auth");
            }

            if (ModelState.IsValid)
            {
                trip.OwnerId = userId.Value;
                _context.Add(trip);
                await _context.SaveChangesAsync();

                _context.TripOwners.Add(new TripOwner
                {
                    TripId = trip.Id,
                    UserId = trip.OwnerId
                });
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }


            foreach (var key in ModelState.Keys)
            {
                var errors = ModelState[key].Errors;
                foreach (var error in errors)
                {
                    Console.WriteLine($"[ModelError] {key}: {error.ErrorMessage}");
                }
            }

            return View(trip);
        }



        // GET: Trips/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Trips == null)
            {
                return NotFound();
            }

            var userId = HttpContext.Session.GetInt32("UserId");

            var trip = await _context.Trips
                .Include(t => t.Owner) // Needed for "Created By" display
                .AsNoTracking()        // Ensures correct RowVersion behavior
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trip == null || userId == null || !_context.TripOwners.Any(o => o.TripId == trip.Id && o.UserId == userId))
            {
                return NotFound(); // prevents non-owners from editing
            }

            var users = await _context.Users.ToListAsync();

            // Ensure the current owner is in the list (in case of filtering)
            if (!users.Any(u => u.Id == trip.OwnerId))
            {
                var currentOwner = await _context.Users.FindAsync(trip.OwnerId);
                if (currentOwner != null)
                {
                    users.Add(currentOwner);
                }
            }

            ViewData["OwnerId"] = new SelectList(users, "Id", "Username", trip.OwnerId);



            return View(trip);
        }



        // POST: Trips/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Date,Destination,Capacity,Description,OwnerId")] Trip trip)
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            var existingTrip = await _context.Trips
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);

            if (existingTrip == null || !_context.TripOwners.Any(o => o.TripId == id && o.UserId == userId))
            {
                return RedirectToAction("Index");
            }

            if (ModelState.IsValid)
            {

                try
                {
                    _context.Attach(trip);
                    _context.Entry(trip).Property(t => t.Title).IsModified = true;
                    _context.Entry(trip).Property(t => t.Date).IsModified = true;
                    _context.Entry(trip).Property(t => t.Destination).IsModified = true;
                    _context.Entry(trip).Property(t => t.Capacity).IsModified = true;
                    _context.Entry(trip).Property(t => t.Description).IsModified = true;



                    await _context.SaveChangesAsync();
            

                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TripExists(trip.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            Console.WriteLine("ModelState is NOT valid!");
            foreach (var state in ModelState)
            {
                foreach (var error in state.Value.Errors)
                {
                    Console.WriteLine($"ModelState error in {state.Key}: {error.ErrorMessage}");
                }
            }


            // On validation errors, still show the creator's name
            trip.Owner = await _context.Users.FindAsync(existingTrip.OwnerId) ?? new User { Username = "Unknown" };
            return View(trip);
        }





        // GET: Trips/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Trips == null)
            {
                return NotFound();
            }

            var trip = await _context.Trips
                .Include(t => t.Owner)
                .FirstOrDefaultAsync(m => m.Id == id);

            var userId = HttpContext.Session.GetInt32("UserId");
            if (trip == null || userId == null || !_context.TripOwners.Any(o => o.TripId == trip.Id && o.UserId == userId))
            {
                return Forbid(); // Only co-owners can see the delete page
            }


            return View(trip);
        }


        // POST: Trips/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (_context.Trips == null || userId == null)
            {
                return Problem("Something went wrong or you're not logged in.");
            }

            var trip = await _context.Trips.FindAsync(id);
            if (trip == null || !_context.TripOwners.Any(o => o.TripId == trip.Id && o.UserId == userId))
            {
                return Forbid(); // Prevent deleting if not a co-owner
            }


            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(Index));
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Join(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return RedirectToAction("Login", "Auth");

            using var transaction = await _context.Database.BeginTransactionAsync();

            var trip = await _context.Trips
                .Include(t => t.Participants)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trip == null)
                return NotFound();

            // Check again within the transaction
            bool alreadyJoined = trip.Participants.Any(p => p.UserId == userId);
            if (alreadyJoined)
            {
                TempData["Error"] = "You have already joined this trip.";
                return RedirectToAction("Details", new { id });
            }

            if (trip.Participants.Count >= trip.Capacity)
            {
                TempData["Error"] = "This trip is already full.";
                return RedirectToAction("Details", new { id });
            }

            _context.TripParticipants.Add(new TripParticipant
            {
                TripId = id,
                UserId = userId.Value
            });

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return RedirectToAction("Details", new { id });
        }



        [HttpPost]
        public async Task<IActionResult> Leave(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return RedirectToAction("Login", "Auth");

            var participation = _context.TripParticipants
                .FirstOrDefault(tp => tp.UserId == userId && tp.TripId == id);

            if (participation != null)
            {
                _context.TripParticipants.Remove(participation);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction("Details", new { id });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GrantOwnership(int tripId, int userId)
        {
            var currentUserId = HttpContext.Session.GetInt32("UserId");

            // Ensure trip exists and current user is an owner
            var trip = await _context.Trips
                .Include(t => t.Owners)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null || !trip.Owners.Any(o => o.UserId == currentUserId))
            {
                TempData["Error"] = "You are not allowed to modify ownership.";
                return RedirectToAction("Details", new { id = tripId });
            }

            // Prevent adding the same owner twice
            bool alreadyOwner = await _context.TripOwners
                .AnyAsync(o => o.TripId == tripId && o.UserId == userId);

            if (alreadyOwner)
            {
                TempData["Error"] = "This user is already an owner.";
                return RedirectToAction("Details", new { id = tripId });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                TempData["Error"] = "User not found.";
                return RedirectToAction("Details", new { id = tripId });
            }

            _context.TripOwners.Add(new TripOwner
            {
                TripId = tripId,
                UserId = userId
            });

            await _context.SaveChangesAsync();

            TempData["Message"] = $"Ownership granted to {user.Username}.";
            return RedirectToAction("Details", new { id = tripId });
        }


        private bool TripExists(int id)
        {
          return (_context.Trips?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}

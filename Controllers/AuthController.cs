using Microsoft.AspNetCore.Mvc;
using TripOrganizer.Data;
using TripOrganizer.Models;
using System.Linq;

namespace TripOrganizer.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (_context.Users.Any(u => u.Username == user.Username))
            {
                return BadRequest("Username already exists.");
            }

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { user.Id, user.Username });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User credentials)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == credentials.Username && u.Password == credentials.Password);
            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            return Ok(new { user.Id, user.Username });
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using TripOrganizer.Data;
using TripOrganizer.Models;
using System.Linq;

namespace TripOrganizer.Controllers
{
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Auth/Register
        public IActionResult Register() => View();

        // POST: /Auth/Register
        [HttpPost]
        public IActionResult Register(User user)
        {
            if (_context.Users.Any(u => u.Username == user.Username))
            {
                ModelState.AddModelError("Username", "Username already exists.");
                return View();
            }

            _context.Users.Add(user);
            _context.SaveChanges();

            HttpContext.Session.SetInt32("UserId", user.Id);
            HttpContext.Session.SetString("Username", user.Username);

            return RedirectToAction("Index", "Trips");
        }

        public IActionResult Login() => View();

        [HttpPost]
        public IActionResult Login(string username, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username && u.Password == password);
            if (user == null)
            {
                ViewBag.Error = "Invalid credentials";
                return View();
            }

            HttpContext.Session.SetInt32("UserId", user.Id);
            HttpContext.Session.SetString("Username", user.Username);

            return RedirectToAction("Index", "Trips");
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }
    }
}

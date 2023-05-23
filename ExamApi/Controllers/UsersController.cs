using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExamApi.Models;
using Microsoft.AspNetCore.Identity;

namespace ExamApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ExamDbContext _context;

        public UsersController(ExamDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUser()
        {
          if (_context.User == null)
          {
              return NotFound();
          }
            return await _context.User.Include(x => x.UserLeaveBalance).Include(x => x.UserLeaveHistory).ToListAsync();
        }

        // GET: api/Users/reena
        [HttpGet("{userName}")]
        public async Task<ActionResult<User>> GetUser(string userName)
        {
          if (_context.User == null)
          {
              return NotFound();
          }
            var user = await _context.User.Include(x => x.UserLeaveBalance).Include(x => x.UserLeaveHistory).FirstOrDefaultAsync(x => x.UserName == userName);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, User user)
        {
            if (id != user.UserName)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
          if (_context.User == null)
          {
              return Problem("Entity set 'ExamDbContext.User'  is null.");
          }
            _context.User.Add(user);
            try
            {
                await _context.SaveChangesAsync();
                _context.UserLeaveBalance.Add(new UserLeaveBalance
                {
                    UserName = user.UserName
                });
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.UserName))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUser", new { id = user.UserName }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (_context.User == null)
            {
                return NotFound();
            }
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("login")]
        public async Task<ActionResult<User>> LoginUser(User user)
        {
            if (_context.User == null)
            {
                return Problem("Entity set 'ExamDbContext.User'  is null.");
            }
            var myUser = await _context.User.FirstOrDefaultAsync(u => u.UserName == user.UserName);

            if (myUser == null) return Unauthorized("Invalid Username");

            // if user exists then check the password.
            var isPasswordCorrect = myUser.Password == user.Password;
            if (!isPasswordCorrect) return Unauthorized("Invalid password");

            // if the user is found and password is correct, return the UserTokenDto.
            return myUser;
        }

        private bool UserExists(string id)
        {
            return (_context.User?.Any(e => e.UserName == id)).GetValueOrDefault();
        }
    }
}

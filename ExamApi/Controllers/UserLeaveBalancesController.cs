using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExamApi.Models;

namespace ExamApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserLeaveBalancesController : ControllerBase
    {
        private readonly ExamDbContext _context;

        public UserLeaveBalancesController(ExamDbContext context)
        {
            _context = context;
        }

        // GET: api/UserLeaveBalances
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserLeaveBalance>>> GetUserLeaveBalance()
        {
          if (_context.UserLeaveBalance == null)
          {
              return NotFound();
          }
            return await _context.UserLeaveBalance.ToListAsync();
        }

        // GET: api/UserLeaveBalances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserLeaveBalance>> GetUserLeaveBalance(string id)
        {
          if (_context.UserLeaveBalance == null)
          {
              return NotFound();
          }
            var userLeaveBalance = await _context.UserLeaveBalance.FindAsync(id);

            if (userLeaveBalance == null)
            {
                return NotFound();
            }

            return userLeaveBalance;
        }

        // PUT: api/UserLeaveBalances/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserLeaveBalance(string id, UserLeaveBalance userLeaveBalance)
        {
            if (id != userLeaveBalance.UserName)
            {
                return BadRequest();
            }

            _context.Entry(userLeaveBalance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserLeaveBalanceExists(id))
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

        // POST: api/UserLeaveBalances
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserLeaveBalance>> PostUserLeaveBalance(UserLeaveBalance userLeaveBalance)
        {
          if (_context.UserLeaveBalance == null)
          {
              return Problem("Entity set 'ExamDbContext.UserLeaveBalance'  is null.");
          }
            _context.UserLeaveBalance.Add(userLeaveBalance);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserLeaveBalanceExists(userLeaveBalance.UserName))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserLeaveBalance", new { id = userLeaveBalance.UserName }, userLeaveBalance);
        }

        // DELETE: api/UserLeaveBalances/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserLeaveBalance(string id)
        {
            if (_context.UserLeaveBalance == null)
            {
                return NotFound();
            }
            var userLeaveBalance = await _context.UserLeaveBalance.FindAsync(id);
            if (userLeaveBalance == null)
            {
                return NotFound();
            }

            _context.UserLeaveBalance.Remove(userLeaveBalance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserLeaveBalanceExists(string id)
        {
            return (_context.UserLeaveBalance?.Any(e => e.UserName == id)).GetValueOrDefault();
        }
    }
}

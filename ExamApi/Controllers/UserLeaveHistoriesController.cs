using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExamApi.Models;
using ExamApi.DTOs;

namespace ExamApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserLeaveHistoriesController : ControllerBase
    {
        private readonly ExamDbContext _context;

        public UserLeaveHistoriesController(ExamDbContext context)
        {
            _context = context;
        }

        // GET: api/UserLeaveHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserLeaveHistory>>> GetUserLeaveHistory()
        {
          if (_context.UserLeaveHistory == null)
          {
              return NotFound();
          }
            return await _context.UserLeaveHistory.ToListAsync();
        }

        // GET: api/UserLeaveHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserLeaveHistory>> GetUserLeaveHistory(int id)
        {
          if (_context.UserLeaveHistory == null)
          {
              return NotFound();
          }
            var userLeaveHistory = await _context.UserLeaveHistory.FindAsync(id);

            if (userLeaveHistory == null)
            {
                return NotFound();
            }

            return userLeaveHistory;
        }

        // PUT: api/UserLeaveHistories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserLeaveHistory(int id, LeaveApproval leaveApprovalDto)
        {
            var userLeaveHistory = await _context.UserLeaveHistory.FindAsync(id);
            userLeaveHistory.IsApproved = leaveApprovalDto.isApproved;
            _context.Entry(userLeaveHistory).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserLeaveHistoryExists(id))
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

        // POST: api/UserLeaveHistories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserLeaveHistory>> PostUserLeaveHistory(UserLeaveHistory userLeaveHistory)
        {
            if (_context.UserLeaveHistory == null)
            {
                return Problem("Entity set 'ExamDbContext.UserLeaveHistory'  is null.");
            }
            _context.UserLeaveHistory.Add(userLeaveHistory);
            await _context.SaveChangesAsync();

            var userLeaveBalance = await _context.UserLeaveBalance.FindAsync(userLeaveHistory.UserName);
            if(userLeaveBalance != null)
            {
                if (userLeaveHistory.LeaveType == "cl")
                {
                    userLeaveBalance.Cl = userLeaveBalance.Cl - userLeaveHistory.NumberOfDays;
                }
                else if (userLeaveHistory.LeaveType == "sl")
                {
                    userLeaveBalance.Sl = userLeaveBalance.Sl - userLeaveHistory.NumberOfDays;
                }
                else if (userLeaveHistory.LeaveType == "pl")
                {
                    userLeaveBalance.Pl = userLeaveBalance.Pl - userLeaveHistory.NumberOfDays;
                }
                _context.Entry(userLeaveBalance).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUserLeaveHistory", new { id = userLeaveHistory.Id }, userLeaveHistory);
        }

        // DELETE: api/UserLeaveHistories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserLeaveHistory(int id)
        {
            if (_context.UserLeaveHistory == null)
            {
                return NotFound();
            }
            var userLeaveHistory = await _context.UserLeaveHistory.FindAsync(id);
            if (userLeaveHistory == null)
            {
                return NotFound();
            }

            _context.UserLeaveHistory.Remove(userLeaveHistory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserLeaveHistoryExists(int id)
        {
            return (_context.UserLeaveHistory?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}

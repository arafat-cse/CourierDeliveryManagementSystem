using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCourierAPI.Attributes;
using WebCourierAPI.Models;
namespace WebCourierAPI.Controllers
{
    [EnableCors("Policy1")]
    [AuthAttribute("", "Bank")]
    [Route("api/[controller]")]
    [ApiController]
    public class BankController : ControllerBase
    {
        // GET: api/Bank
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bank>>> GetBanks()
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return await _context.Banks.ToListAsync();
        }
        // GET: api/Bank/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bank>> GetBank(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var bank = await _context.Banks.FindAsync(id);

            if (bank == null)
            {
                return NotFound();
            }

            return bank;
        }
        // POST: api/Bank
        [HttpPost]
        public async Task<ActionResult<Bank>> PostBank([FromBody] Bank bank)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            if (bank == null || string.IsNullOrEmpty(bank.BranchName))
            {
                return BadRequest("BranceName is required");
            }

            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }

            bank.CreateBy = user.UserName;
            bank.CreateDate = DateTime.UtcNow;

            _context.Banks.Add(bank);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBank), new { id = bank.BankId }, bank);
        }
        // PUT: api/Bank/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBank(int id, Bank bank)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            if (id != bank.BankId)
            {
                return BadRequest("Mismatch Bank Id");
            }
            var existingbank = await _context.Banks.FindAsync(id);
            if (existingbank == null) 
            { 
                return NotFound("Bank ID in not Found");
            }

            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }
            existingbank.BranchName = bank.BranchName;
            existingbank.CreateBy = user.UserName;
            existingbank.CreateDate = DateTime.UtcNow;

            existingbank.IsActive = bank.IsActive;



            _context.Entry(existingbank).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BankExists(id))
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
        // DELETE: api/Bank/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBank(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var bank = await _context.Banks.FindAsync(id);
            if (bank == null)
            {
                return NotFound();
            }

            _context.Banks.Remove(bank);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool BankExists(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return _context.Banks.Any(e => e.BankId == id);
        }
    }
}

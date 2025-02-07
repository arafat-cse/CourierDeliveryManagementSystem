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
    [AuthAttribute("", "Vans")]
    [Route("api/[controller]")]
    [ApiController]
    public class VansController : ControllerBase
    {
        

        // GET: api/Vans
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Van>>> GetVans()
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return await _context.Vans.ToListAsync();
        }

        // GET: api/Vans/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Van>> GetVan(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var van = await _context.Vans.FindAsync(id);

            if (van == null)
            {
                return NotFound();
            }

            return van;
        }

        // PUT: api/Vans/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVan(int id, Van van)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            if (id != van.VanId)
            {
                return BadRequest("Mismatched van ID.");
            }


            var existingvan = await _context.Vans.FindAsync(id);
            if (existingvan == null)
            {
                return NotFound("van not found.");
            }
            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }
            existingvan.VanId = van.VanId;
            existingvan.RegistrationNo = van.RegistrationNo;
            existingvan.UpdateBy = user.UserName;
            existingvan.UpdateDate = DateTime.UtcNow;

            //existingParcelType.ParcelTypeName = parcelType.ParcelTypeName;
            //existingParcelType.UpdateBy = parcelType.UpdateBy;
            //existingParcelType.UpdateDate = DateTime.UtcNow;
            existingvan.IsActive = van.IsActive;

            _context.Entry(existingvan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VanExists(id))
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

        // POST: api/Vans
        [HttpPost]
        public async Task<ActionResult<Van>> PostVan([FromBody] Van van)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            if (van == null)
            {
                return BadRequest("van  id is required.");
            }

            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }

            van.CreateBy = user.UserName;
            //van.CreateDate = DateTime.UtcNow;

            _context.Vans.Add(van);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVan), new { id = van.VanId }, van);
        }

        // DELETE: api/Vans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVan(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var van = await _context.Vans.FindAsync(id);
            if (van == null)
            {
                return NotFound();
            }

            _context.Vans.Remove(van);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool VanExists(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return _context.Vans.Any(e => e.VanId == id);
        }

    }
}

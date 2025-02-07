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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace WebCourierAPI.Controllers
{
    [EnableCors("Policy1")]
    [AuthAttribute("", "ParcelTypes")]
    [Route("api/[controller]")]
    [ApiController]
    public class ParcelTypesController : ControllerBase
    {
        //private readonly WebCorierApiContext _context;
        // GET: api/ParcelTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParcelType>>> GetParcelTypes()
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return await _context.ParcelTypes.ToListAsync();
        }

        // GET: api/ParcelTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ParcelType>> GetParcelType(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var parcelType = await _context.ParcelTypes.FindAsync(id);

            if (parcelType == null)
            {
                return NotFound();
            }

            return parcelType;
        }
        // PUT: api/ParcelTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParcelType(int id, ParcelType parcelType)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            if (id != parcelType.ParcelTypeId)
            {
                return BadRequest("Mismatched perceltype ID.");
            }


            var existingParcelType = await _context.ParcelTypes.FindAsync(id);
            if (existingParcelType == null)
            {
                return NotFound("percel not found.");
            }
            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }
            existingParcelType.ParcelTypeName = parcelType.ParcelTypeName;
            //existingParcelType.CreateBy = user.UserName;
            //existingParcelType.CreateDate = DateTime.UtcNow;

            //existingParcelType.ParcelTypeName = parcelType.ParcelTypeName;
            existingParcelType.UpdateBy = parcelType.UpdateBy;
            existingParcelType.UpdateDate = DateTime.UtcNow;
            existingParcelType.IsActive = parcelType.IsActive;

            _context.Entry(existingParcelType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParcelTypeExists(id))
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
        [HttpPost]
        public async Task<ActionResult<ParcelType>> PostParcelType([FromBody] ParcelType parcelType)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            if (parcelType == null || string.IsNullOrEmpty(parcelType.ParcelTypeName))
            {
                return BadRequest("Parcel type name is required.");
            }

            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }

            parcelType.CreateBy = user.UserName;
            parcelType.CreateDate = DateTime.UtcNow;

            _context.ParcelTypes.Add(parcelType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetParcelType), new { id = parcelType.ParcelTypeId }, parcelType);
        }

        // DELETE: api/ParcelTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParcelType(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            var parcelType = await _context.ParcelTypes.FindAsync(id);
            if (parcelType == null)
            {
                return NotFound();
            }

            _context.ParcelTypes.Remove(parcelType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ParcelTypeExists(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return _context.ParcelTypes.Any(e => e.ParcelTypeId == id);
        }
    }
}

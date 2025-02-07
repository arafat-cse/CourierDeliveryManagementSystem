using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http.Tracing;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCourierAPI.Attributes;
using WebCourierAPI.Models;

namespace WebCourierAPI.Controllers
{
    [EnableCors("Policy1")]
    [AuthAttribute("", "Parcels")]
    [Route("api/[controller]")]
    [ApiController]
    public class ParcelsController : ControllerBase
    {
        
        // GET: api/Parcels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Parcel>>> GetParcels()
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return await _context.Parcels.OrderDescending().ToListAsync();
        }     

        // GET: api/Parcels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Parcel>> GetParcel(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var parcel = await _context.Parcels.FindAsync(id);

            if (parcel == null)
            {
                return NotFound();
            }

            return parcel;
        }

        // PUT: api/Parcels/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParcel(int id, Parcel parcel)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            if (id != parcel.ParcelId)
            {
                return BadRequest("Mismatched perceltype ID.");
            }
 

            _context.Entry(parcel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParcelExists(id))
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

        // POST: api/Parcels
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Parcel>> PostParcel(Parcel parcel)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
           // ইউনিক Tracking Code জেনারেট করা হচ্ছে
            parcel.TrackingCode = TrackingCodeGenerator.GenerateUniqueTrackingCode(_context);

            _context.Parcels.Add(parcel);
            // এখানে ব্রেকপয়েন্ট দিন এবং parcel.TrackingCode দেখুন
            Console.WriteLine($"Generated Tracking Code: {parcel.TrackingCode}");
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetParcel", new { id = parcel.ParcelId }, parcel);
        }

        // DELETE: api/Parcels/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParcel(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var parcel = await _context.Parcels.FindAsync(id);
            if (parcel == null)
            {
                return NotFound();
            }

            _context.Parcels.Remove(parcel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ParcelExists(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return _context.Parcels.Any(e => e.ParcelId == id);
        }

        // PUT: api/Parcels/UpdateStatus/5
        [HttpPut("UpdateStatus/{id}")]
        public async Task<IActionResult> UpdateParcelStatus(int id, [FromBody] string status)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            // নির্দিষ্ট Parcel খুঁজে বের করুন
            var parcel = await _context.Parcels.FindAsync(id);

            if (parcel == null)
            {
                return NotFound("Parcel not found.");
            }

            // Status ফিল্ড আপডেট করা হচ্ছে
            parcel.Status = status;
            parcel.UpdateDate = DateTime.UtcNow; // আপডেট টাইম সেট করা হচ্ছে

            _context.Entry(parcel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParcelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Parcel status updated successfully.");
        }
       
    }
}

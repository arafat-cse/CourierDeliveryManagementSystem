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
    [AuthAttribute("", "DeliveryCharges")]
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryChargesController : ControllerBase
    {
        

        // GET: api/DeliveryCharges
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryCharge>>> GetDeliveryCharges()
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return await _context.DeliveryCharges.ToListAsync();
        }

        // GET: api/DeliveryCharges/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryCharge>> GetDeliveryCharge(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var deliveryCharge = await _context.DeliveryCharges.FindAsync(id);

            if (deliveryCharge == null)
            {
                return NotFound();
            }

            return deliveryCharge;
        }

        // PUT: api/DeliveryCharges/5
      
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeliveryCharge(int id, DeliveryCharge deliveryCharge)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            if (id != deliveryCharge.DeliveryChargeId)
            {
                return BadRequest();
            }

            _context.Entry(deliveryCharge).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeliveryChargeExists(id))
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

        // POST: api/DeliveryCharges
      
        [HttpPost]
        public async Task<ActionResult<DeliveryCharge>> PostDeliveryCharge(DeliveryCharge deliveryCharge)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            _context.DeliveryCharges.Add(deliveryCharge);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDeliveryCharge", new { id = deliveryCharge.DeliveryChargeId }, deliveryCharge);
        }

        // DELETE: api/DeliveryCharges/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeliveryCharge(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var deliveryCharge = await _context.DeliveryCharges.FindAsync(id);
            if (deliveryCharge == null)
            {
                return NotFound();
            }

            _context.DeliveryCharges.Remove(deliveryCharge);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DeliveryChargeExists(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return _context.DeliveryCharges.Any(e => e.DeliveryChargeId == id);
        }
    }
}

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
    [AuthAttribute("", "Receivers")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReceiversController : ControllerBase
    {
        private readonly WebCorierApiContext _context;

        public ReceiversController(WebCorierApiContext context)
        {
            _context = context;
        }

        // GET: api/Receivers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Receiver>>> GetReceivers()
        {
            return await _context.Receivers.ToListAsync();
        }

        // GET: api/Receivers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Receiver>> GetReceiver(int id)
        {
            var receiver = await _context.Receivers.FindAsync(id);

            if (receiver == null)
            {
                return NotFound();
            }

            return receiver;
        }

        // PUT: api/Receivers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReceiver(int id, Receiver receiver)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            if (id != receiver.ReceiverId)
            {
                return BadRequest("Mismatched receiver ID.");
            }


            var existingReceiver = await _context.Receivers.FindAsync(id);
            if (existingReceiver == null)
            {
                return NotFound("receber not found.");
            }
            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }
            existingReceiver.ReceiverName = receiver.ReceiverName;
            //existingReceiver.CreateBy = user.UserName;
            //existingReceiver.CreateDate = DateTime.UtcNow;

            //existingParcelType.ParcelTypeName = parcelType.ParcelTypeName;
            //existingParcelType.UpdateBy = parcelType.UpdateBy;
            //existingParcelType.UpdateDate = DateTime.UtcNow;
            //existingReceiver.IsActive = parcelType.IsActive;

            _context.Entry(existingReceiver).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReceiverExists(id))
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

        // POST: api/Receivers
        [HttpPost]
        public async Task<ActionResult<Receiver>> PostReceiver([FromBody] Receiver receiver)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            if (receiver == null || string.IsNullOrEmpty(receiver.ReceiverName))
            {
                return BadRequest("Receiver name is required.");
            }

            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }

            //receiver.CreateBy = user.UserName;
            //parcelType.CreateDate = DateTime.UtcNow;

            _context.Receivers.Add(receiver);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReceiver), new { id = receiver.ReceiverId }, receiver);
        }

        // DELETE: api/Receivers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReceiver(int id)
        {
            var receiver = await _context.Receivers.FindAsync(id);
            if (receiver == null)
            {
                return NotFound();
            }

            _context.Receivers.Remove(receiver);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReceiverExists(int id)
        {
            return _context.Receivers.Any(e => e.ReceiverId == id);
        }
    }
}

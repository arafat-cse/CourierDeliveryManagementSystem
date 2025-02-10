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
    [AuthAttribute("", "Staffs")]
    [Route("api/[controller]")]
    [ApiController]
    public class StaffsController : ControllerBase
    {
       
        // GET: api/Staffs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Staff>>> GetStaffs()
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            return await _context.Staffs.ToListAsync();
        }

        // GET: api/Staffs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Staff>> GetStaff(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            var staff = await _context.Staffs.FindAsync(id);

            if (staff == null)
            {
                return NotFound();
            }

            return staff;
        }

        

        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaff(int id, Staff staff)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            if (id != staff.StaffId)
            {
                return BadRequest("Mismatched staff ID.");
            }

            // Find the existing staff entity
            var staffexists = await _context.Staffs.FindAsync(id);

            if (staffexists == null)
            {
                return NotFound("Staff not found.");
            }

            // Validate the token and retrieve the user
            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }

            // Update the properties of the existing entity
            staffexists.StaffName = staff.StaffName;
            staffexists.Email = staff.Email;
            staffexists.StaffPhone = staff.StaffPhone;
            staffexists.DesignationId = staff.DesignationId;
            staffexists.BranchId = staff.BranchId;
            staffexists.IsActive = staff.IsActive;
            staffexists.UpdateBy = user.UserName;
            staffexists.UpdateDate = DateTime.UtcNow;

            // Save changes to the database
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffExists(id))
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
        // POST: api/Staffs
      
        [HttpPost]
        public async Task<ActionResult<Staff>> PostStaff(Staff staff)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            if (staff == null || string.IsNullOrEmpty(staff.StaffName))
            {
                return BadRequest("staff name is required.");
            }

            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }

            staff.CreateBy = user.UserName;
            staff.CreateDate = DateTime.UtcNow;

            _context.Staffs.Add(staff);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStaff", new { id = staff.StaffId }, staff);
        }

        // DELETE: api/Staffs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }

            _context.Staffs.Remove(staff);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StaffExists(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            return _context.Staffs.Any(e => e.StaffId == id);
        }
    }
}

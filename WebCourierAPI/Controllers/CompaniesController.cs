using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCourierAPI.Attributes;
using WebCourierAPI.Models;

namespace WebCourierAPI.Controllers
{
    [EnableCors("Policy1")]
    [AuthAttribute("", "Companies")]
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        // GET: api/Companies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return await _context.Companys.ToListAsync();
        }

        // GET: api/Companies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Company>> GetCompany(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            var company = await _context.Companys.FindAsync(id);

            if (company == null)
            {
                return NotFound();
            }


            return company;
        }
        // POST: api/Companies
        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] Company company)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            if (company == null || string.IsNullOrEmpty(company.CompanyName))
            {
                return BadRequest("CompanyName is required");
            }

            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }

            company.CreateBy = user.UserName;
            company.CreateDate = DateTime.UtcNow;

            _context.Companys.Add(company);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCompany), new { id = company.CompanyId }, company);
        }
        // PUT: api/Companies/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(int id, Company company)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            if (id != company.CompanyId)
            {
                return BadRequest("Mismatched Company ID.");
            }

            var existingcompany = await _context.Companys.FindAsync(id);
            if (existingcompany == null)
            {
                return NotFound("company not found.");
            }
            var token = Request.Headers["Token"].FirstOrDefault();
            var user = AuthenticationHelper.ValidateToken(token);

            if (user == null)
            {
                return Unauthorized("Invalid or expired token.");
            }
            existingcompany.CompanyName = company.CompanyName;
            existingcompany.CreateBy = user.UserName;
            existingcompany.CreateDate = DateTime.UtcNow;

          

            _context.Entry(existingcompany).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompanyExists(id))
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

        // DELETE: api/Companies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            var company = await _context.Companys.FindAsync(id);
            if (company == null)
            {
                return NotFound();
            }

            _context.Companys.Remove(company);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool CompanyExists(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            return _context.Companys.Any(e => e.CompanyId == id);
        }
    }
}

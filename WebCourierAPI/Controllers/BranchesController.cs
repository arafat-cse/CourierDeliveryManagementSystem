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
    [AuthAttribute("", "Branches")]
    [Route("api/[controller]")]
    [ApiController]
    public class BranchesController : ControllerBase
    {
        // WebCorierApiContext _context = new WebCorierApiContext(); 

        // GET: api/Branches
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Branch>>> GetBranches()
        //{
        //    WebCorierApiContext _context = new WebCorierApiContext();

        //    return await _context.Branches.ToListAsync();
        //}
        //CommanResponse
        private readonly CommanResponse cp = new CommanResponse();

        // GET:
        [HttpGet]
        public IActionResult GetBranches()
        {
            WebCorierApiContext _db = new WebCorierApiContext();
            try
            {
                var branches = _db.Branches.Include(b => b.InverseParent).ToList();

                var branchDTOs = branches.Select(b => new BranchDTO
                {
                    BranchId = b.BranchId,
                    BranchName = b.BranchName,
                    Address = b.Address,
                    ParentId = b.ParentId,
                    IsActive = b.IsActive,
                    ChildBranches = b.InverseParent?.Select(cb => new BranchDTO
                    {
                        BranchId = cb.BranchId,
                        BranchName = cb.BranchName,
                        Address = cb.Address,
                        ParentId = cb.ParentId,
                        IsActive = cb.IsActive
                    }).ToList()
                }).ToList();

                if (!branchDTOs.Any())
                {
                    cp.status = false;
                    cp.message = "No branches found.";
                    cp.content = null;
                    return Ok(cp);
                }

                cp.status = true;
                cp.message = "Branches retrieved successfully.";
                cp.content = branchDTOs;
                return Ok(cp);
            }
            catch (Exception ex)
            {
                cp.status = false;
                cp.message = "Error occurred while retrieving branches.";
                cp.errorMessage = ex.Message;
                cp.content = null;
                return StatusCode(500, cp);
            }
        }

        // GET: api/Branches/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Branch>> GetBranch(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            var branch = await _context.Branches.FindAsync(id);

            if (branch == null)
            {
                return NotFound();
            }

            return branch;
        }

        // PUT:/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBranch(int id, Branch branch)
        {
            WebCorierApiContext _db = new WebCorierApiContext();
            if (id != branch.BranchId)
            {
                cp.status = false;
                cp.message = "Branch ID mismatch.";
                return BadRequest(cp);
            }

            try
            {
                if (branch.ParentId.HasValue && branch.ParentId != id)
                {
                    var parentBranch = await _db.Branches.FindAsync(branch.ParentId.Value);
                    if (parentBranch == null)
                    {
                        cp.status = false;
                        cp.message = "Invalid ParentId.";
                        return BadRequest(cp);
                    }
                }
                var existingBranch = await _db.Branches.FindAsync(id);
                if (existingBranch == null)
                {
                    return NotFound("Company not found.");
                }
                var token = Request.Headers["Token"].FirstOrDefault();
                var user = AuthenticationHelper.ValidateToken(token);

                if (user == null)
                {
                    return Unauthorized("Invalid or expired token.");
                }

                existingBranch.BranchName = branch.BranchName;
                existingBranch.CreateBy = user.UserName;
                existingBranch.CreateDate = DateTime.UtcNow;
                existingBranch.Address = branch.Address;


                existingBranch.IsActive = branch.IsActive;


                //_db.Entry(branch).State = EntityState.Modified;
                _db.Entry(existingBranch).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                cp.status = true;
                cp.message = "Branch updated successfully.";
                return Ok(cp);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BranchExists(id))
                {
                    cp.status = false;
                    cp.message = "Branch not found.";
                    return NotFound(cp);
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                cp.status = false;
                cp.message = "Error occurred while updating the branch.";
                cp.errorMessage = ex.Message;
                return StatusCode(500, cp);
            }
        }

        // POST: api/Branches
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Branch>> PostBranch(Branch branch)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            _context.Branches.Add(branch);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBranch", new { id = branch.BranchId }, branch);
        }

        // DELETE: api/Branches/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBranch(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            var branch = await _context.Branches.FindAsync(id);
            if (branch == null)
            {
                return NotFound();
            }

            _context.Branches.Remove(branch);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BranchExists(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();

            return _context.Branches.Any(e => e.BranchId == id);
        }
    }
}

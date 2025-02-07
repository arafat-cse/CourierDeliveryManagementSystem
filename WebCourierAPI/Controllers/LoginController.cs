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
using WebCourierAPI.ViewModels;

namespace WebCourierAPI.Controllers
{
    //[EnableCors("Policy1")]
    //[AuthAttribute("", "Login")]
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        // GET: api/Companies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDetail>> GetUserDetail(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var userDetail = await _context.UserDetails.FindAsync(id);

            if (userDetail == null)
            {
                return NotFound();
            }

            return userDetail;
        }

        // POST: api/Login
        [EnableCors("Policy1")]
        [HttpPost]
        public async Task<IActionResult> PostUserDetail(UserDetail userDetail)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            var oUserDetail = await _context.UserDetails.Where(x => x.UserName == userDetail.UserName && x.PassWord == userDetail.PassWord).FirstOrDefaultAsync();
            if (oUserDetail == null)
            {
                return NotFound();
            }
            else
            {
                if (oUserDetail != null)
                {
                    #region Token
                    var MyConfig = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
                    var WebClient = MyConfig.GetValue<string>("WebClient");
                    var TokenExpire = MyConfig.GetValue<int>("TokenExpire");
                    oUserDetail.PassWord = JsonWebToken.Encode(new UserPayload() { CreateDate = DateTime.Now, UserId = oUserDetail.UserId, TokenExpire = TokenExpire, UserName = oUserDetail.UserName }, WebClient, JwtHashAlgorithm.HS512);
                    #endregion
                }
                return CreatedAtAction("GetUserDetail", new { id = oUserDetail.UserId }, oUserDetail);
            }
        }
        private bool UserDetailExists(int id)
        {
            WebCorierApiContext _context = new WebCorierApiContext();
            return _context.UserDetails.Any(e => e.UserId == id);
        }
    }
}

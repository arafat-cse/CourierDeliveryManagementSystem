//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using WebCourierAPI.Models;

//namespace WebCourierAPI.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    //public class EmailController : ControllerBase
//    //{
//    //    WebCorierApiContext _db = new WebCorierApiContext();

//    //    private readonly EmailService _emailService;

//    //    // Constructor to inject the EmailService
//    //    public EmailController(EmailService emailService)
//    //    {
//    //        _emailService = emailService;
//    //    }

//    //    // Action to send email based on the condition
//    //    public async Task<IActionResult> SendEmailOnCondition()
//    //    {
//    //        var recevingBranch = true; // Example value, apni database theke nite parben
//    //        var receiverEmail = "receiver-email@example.com"; // Get this from your database or input

//    //        if (recevingBranch)
//    //        {
//    //            // Send email when the condition is met
//    //            await _emailService.SendEmailAsync(receiverEmail, "Package Received", "Your package has been received.");
//    //        }

//    //        return View(); // Return a view after sending the email (optional)
//    //    }
//    //}
//    public class EmailController : Controller
//    {
//        private readonly EmailService _emailService;

//        // Constructor to inject the EmailService
//        public EmailController(EmailService emailService)
//        {
//            _emailService = emailService;
//        }

//        // Action to send email based on the condition
//        public async Task<IActionResult> SendEmailOnCondition()
//        {
//            var recevingBranch = true; // Example value, apni database theke nite parben
//            var receiverEmail = "receiver-email@example.com"; // Get this from your database or input

//            if (recevingBranch)
//            {
//                // Send email when the condition is met
//                await _emailService.SendEmailAsync(receiverEmail, "Package Received", "Your package has been received.");
//            }

//            // Return a view after the email is sent
//            return View(); // This will return the default view associated with the action
//        }
//    }

//}


using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebCourierAPI.Models;

[Route("api/[controller]")]
[ApiController]
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public EmailController(EmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        bool result = await _emailService.SendEmailAsync(request.ToEmail, request.Subject, request.Body);

        if (result)
            return Ok(new { message = "Email sent successfully!" });
        else
            return StatusCode(500, new { message = "Failed to send email." });
    }
}

//// DTO Model
//public class EmailRequest
//{
//    public string ToEmail { get; set; }
//    public string Subject { get; set; }
//    public string Body { get; set; }
//}

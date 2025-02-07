//namespace WebCourierAPI.Services;
//using System;
//using System.Net;
//using System.Net.Mail;
//using System.Threading.Tasks;

//public class EmailService
//{
//    public async Task SendEmailAsync(string toEmail, string subject, string body)
//    {
//        try
//        {
//            string smtpServer = "smtp.gmail.com";
//            int smtpPort = 587; // Use 465 for SSL
//            string fromEmail = "arafat.dev61@gmail.com";
//            string appPassword = "arafat104910"; // Use App Password here

//            var smtpClient = new SmtpClient(smtpServer)
//            {
//                Port = smtpPort,
//                Credentials = new NetworkCredential(fromEmail, appPassword),
//                EnableSsl = true
//            };

//            var mailMessage = new MailMessage
//            {
//                From = new MailAddress(fromEmail),
//                Subject = subject,
//                Body = body,
//                IsBodyHtml = true // Set to false if you don't want HTML
//            };

//            mailMessage.To.Add(toEmail);

//            await smtpClient.SendMailAsync(mailMessage);
//            Console.WriteLine("Email sent successfully!");
//        }
//        catch (Exception ex)
//        {
//            Console.WriteLine($"Error sending email: {ex.Message}");
//        }
//    }
//}


using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
    {
        try
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Smart Courier Service", _config["EmailSettings:SenderEmail"]));
            email.To.Add(new MailboxAddress("", toEmail));
            email.Subject = subject;

            email.Body = new TextPart("html") { Text = body };

            //using (var smtp = new SmtpClient())
            //{
            //    await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"], int.Parse(_config["EmailSettings:SmtpPort"]), MailKit.Security.SecureSocketOptions.StartTls);
            //    await smtp.AuthenticateAsync(_config["EmailSettings:SenderEmail"], _config["EmailSettings:SenderPassword"]);
            //    await smtp.SendAsync(email);
            //    await smtp.DisconnectAsync(true);
            //}

            using (var smtp = new SmtpClient())
            {
                await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"],
                                        int.Parse(_config["EmailSettings:SmtpPort"]),
                                        MailKit.Security.SecureSocketOptions.Auto); // Change from StartTls to Auto

                await smtp.AuthenticateAsync(_config["EmailSettings:SenderEmail"],
                                             _config["EmailSettings:SenderPassword"]);

                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }


            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email Sending Failed: {ex.Message}");
            return false;
        }
    }
}

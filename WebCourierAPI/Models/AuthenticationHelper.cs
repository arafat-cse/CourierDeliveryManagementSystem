using Newtonsoft.Json;
using WebCourierAPI.Attributes;
using WebCourierAPI.ViewModels;

namespace WebCourierAPI.Models
{
    public class AuthenticationHelper
    {
        public static UserPayload ValidateToken(string token)
        {
            try
            {
                var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
                var secretKey = config.GetValue<string>("WebClient"); // টোকেন ডিকোড করার জন্য সিক্রেট কী

                var decodedPayload = JsonWebToken.Decode(token, secretKey);
                var userPayload = JsonConvert.DeserializeObject<UserPayload>(decodedPayload);
                return userPayload;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null; // যদি টোকেন ইনভ্যালিড হয়
            }
        }
    }
}

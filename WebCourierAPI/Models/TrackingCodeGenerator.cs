namespace WebCourierAPI.Models
{
    public class TrackingCodeGenerator
    {
        public static string GenerateUniqueTrackingCode(WebCorierApiContext context)
        {
            string trackingCode;
            do
            {
                trackingCode = new Random().Next(10000000, 99999999).ToString();
            }
            while (context.Parcels.Any(p => p.TrackingCode == trackingCode)); // ডুপ্লিকেট চেক
            return trackingCode;
        }
    }
}

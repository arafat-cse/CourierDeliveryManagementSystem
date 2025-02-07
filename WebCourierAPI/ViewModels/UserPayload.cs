namespace WebCourierAPI.ViewModels
{
    public class UserPayload
    {
        public string UserName { get; set; }
        public int UserId { get; set; }
        public int TokenExpire { get; set; }
        public DateTime CreateDate { get; set; }

      
    }
}

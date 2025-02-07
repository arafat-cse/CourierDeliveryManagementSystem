namespace WebCourierAPI.Models
{
    public class CommanResponse
    {
         public bool status {  get; set; }
        public string message { get; set; }
        public string errorMessage { get; set; }
        public object content {  get; set; }
    }
}

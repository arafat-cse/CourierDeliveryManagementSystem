using Microsoft.AspNetCore.Mvc;

namespace WebCourierAPI.Attributes
{
    public class AuthAttribute: TypeFilterAttribute
    {
        public AuthAttribute(string actionName, string controller) : base(typeof(AuthorizeAction))
        {
            Arguments = new object[] {
            actionName,
            controller
            };
        }
    }
}

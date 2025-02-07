using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using WebCourierAPI.ViewModels;

namespace WebCourierAPI.Attributes
{
    public class AuthorizeAction: IAuthorizationFilter
    {
        private readonly string _actionName;
        private readonly string _controller;
        public AuthorizeAction(string actionName, string controller)
        {
            _actionName = actionName;
            _controller = controller;
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            string _Token = context.HttpContext.Request?.Headers["Token"].ToString();
            try
            {
                var req = context.HttpContext.Request;
                var headers = req.Headers;
                if (!string.IsNullOrEmpty(_Token))
                {
                    var MyConfig = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
                    var _WebClient = MyConfig.GetValue<string>("WebClient");
                    var strUserPayload = JsonWebToken.Decode(_Token, _WebClient);
                    var oUserPayload = JsonConvert.DeserializeObject<UserPayload>(strUserPayload);
                    var _TokenExpireDate = oUserPayload.CreateDate.AddMinutes(oUserPayload.TokenExpire);
                    if (_TokenExpireDate < DateTime.Now)
                    {
                        context.Result = new Microsoft.AspNetCore.Mvc.JsonResult(new { message = "Session expired!" });
                    }
                }
                else
                {
                    context.Result = new Microsoft.AspNetCore.Mvc.JsonResult(new { message = "Unauthorized!" });
                }
            }
            catch
            {
                context.Result = new Microsoft.AspNetCore.Mvc.JsonResult(new { message = "InternalServerError!" });
            }
        }
    }
}

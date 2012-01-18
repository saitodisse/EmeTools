using System.Web.Mvc;

namespace MvcEmeTools.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Home/qUnit
        public ActionResult qUnit()
        {
            return View();
        }
    }
}
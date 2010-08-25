using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmeToolsMvcApp.Models
{
    public class Menu
    {
        public virtual int Id { get; set; }
        public virtual IList<Macro> MacrosPai { get; set; }
    }
}
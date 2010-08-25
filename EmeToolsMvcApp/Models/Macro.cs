using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmeToolsMvcApp.Models
{
    public class Macro
    {
        public virtual int Id { get; set; }
        public virtual string Name { get; set; }
        public virtual string Description { get; set; }
        public virtual int Order { get; set; }
        public virtual string Body { get; set; }
        public virtual IList<Macro> MacrosFilho { get; set; }
    }
}
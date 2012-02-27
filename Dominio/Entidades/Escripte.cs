using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dominio.Entidades
{
    public class Escripte
    {
        public virtual string IdSha1 { get; set; }
        [Required]
        [Display(Name = "First Name")]
        public virtual string Nome { get; set; }
        [Required]
        [Display(Name = "Descrição")]
        public virtual string Descricao { get; set; }
        [Required]
        [Display(Name = "Escripte")]
        public virtual string Texto { get; set; }
    }
}
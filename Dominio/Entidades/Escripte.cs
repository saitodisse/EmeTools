using System.Collections.Generic;

namespace Dominio.Entidades
{
    public class Escripte
    {
        public virtual string IdSha1 { get; set; }
        public virtual string Nome { get; set; }
        public virtual string Descricao { get; set; }
        public virtual string Texto { get; set; }
        public virtual List<DadoExemplo> DadoExemplos { get; set; }
    }
}
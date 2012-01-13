using Dominio.Entidades;
using JsonHelper;

namespace Dominio.Servicos
{
    public class GerenciadorEmeTemplates
    {
        private readonly IRepositorio<string> _repositorioArquivoEscripte;

        public GerenciadorEmeTemplates(IRepositorio<string> repositorioArquivoEscripte)
        {
            _repositorioArquivoEscripte = repositorioArquivoEscripte;
        }

        public void GravarEscripte(Escripte escripte)
        {
            // serializa para JSON
            string serialize = JsonSerializer.Serialize(escripte);

            //grava no disco
            _repositorioArquivoEscripte.Save(serialize);
        }
    }
}

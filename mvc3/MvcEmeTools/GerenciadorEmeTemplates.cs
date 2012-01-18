using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using Dominio.Entidades;
using Dominio.IRepositorios;
using JsonHelper;

namespace Dominio.Servicos
{
    public interface IGerenciadorEmeTemplates
    {
        void GravarEscripte(Escripte escripte);
        List<Escripte> PesquisarTodos();
    }

    public class GerenciadorEmeTemplates : IGerenciadorEmeTemplates
    {
        private readonly IRepositorioArquivoTexto _repositorioArquivoTexto;
        private readonly IConfiguracaoGerenciador _configuracaoGerenciador;

        public GerenciadorEmeTemplates(IRepositorioArquivoTexto repositorioArquivoTexto, IConfiguracaoGerenciador configuracaoGerenciador)
        {
            _repositorioArquivoTexto = repositorioArquivoTexto;
            _configuracaoGerenciador = configuracaoGerenciador;
        }

        public void GravarEscripte(Escripte escripte)
        {
            // serializa para JSON
            string serialize = JsonSerializer.Serialize(escripte);

            // Gera SHA1
            escripte.IdSha1 = SHA1Hash(serialize);

            // serializa novamente com o IdSha1 preenchido
            serialize = JsonSerializer.Serialize(escripte);

            //recupera do App.Config / Web.Config
            string pastaInterna = _configuracaoGerenciador.RecuperarConfiguracao("caminhoPasta");
            string caminhoPastaWebServer = _configuracaoGerenciador.BuscarPastaPadraoWebServer(pastaInterna);
            string caminhoCompleto = string.Format("{0}\\{1}.json", caminhoPastaWebServer, escripte.IdSha1);

            //grava no disco
            _repositorioArquivoTexto.Gravar(caminhoCompleto, serialize);
        }

        private string SHA1Hash(string input)
        {
            SHA1 sha = new SHA1CryptoServiceProvider();
            byte[] data = Encoding.ASCII.GetBytes(input);
            byte[] hash = sha.ComputeHash(data);

            var sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
        }

        public List<Escripte> PesquisarTodos()
        {
            string pastaInterna = _configuracaoGerenciador.RecuperarConfiguracao("caminhoPasta");
            string caminhoPastaWebServer = _configuracaoGerenciador.BuscarPastaPadraoWebServer(pastaInterna);
            string procurarPor = _configuracaoGerenciador.RecuperarConfiguracao("procurarPor");

            //grava no disco
            var fileInfos = _repositorioArquivoTexto.Buscar(caminhoPastaWebServer, procurarPor);
            var listaEscripte = new List<Escripte>();

            foreach (var fileInfo in fileInfos)
            {
                var conteudo = _repositorioArquivoTexto.Ler(fileInfo.FullName);
                var escripte = JsonSerializer.Deserialize<Escripte>(conteudo);
                listaEscripte.Add(escripte);
            }

            return listaEscripte;
        }
    }
}
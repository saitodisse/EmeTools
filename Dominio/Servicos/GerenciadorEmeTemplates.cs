using System.Security.Cryptography;
using System.Text;
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

            // Gera SHA1
            escripte.IdSha1 = SHA1Hash(serialize);

            // serializa novamente com o IdSha1 preenchido
            serialize = JsonSerializer.Serialize(escripte);

            //grava no disco
            _repositorioArquivoEscripte.Save(serialize);
        }

        public string SHA1Hash(string input)
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

        public void PesquisarTodos()
        {
            //grava no disco
            _repositorioArquivoEscripte.GetAll();
        }
    }
}

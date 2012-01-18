using System.IO;

namespace Dominio.IRepositorios
{
    public interface IRepositorioArquivoTexto
    {
        void Gravar(string caminho, string conteudo);
        string Ler(string caminho);
        FileInfo[] Buscar(string caminhoPasta, string procurarPor);
    }

}

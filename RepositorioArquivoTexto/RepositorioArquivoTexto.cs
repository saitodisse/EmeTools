using System.IO;
using Dominio.IRepositorios;

namespace RepositorioArquivoTexto
{

    public class RepositorioArquivoTexto : IRepositorioArquivoTexto
    {
        public void Gravar(string caminho, string conteudo)
        {
            if(File.Exists(caminho))
            {
                // Apaga arquivo se já existir
                File.Delete(caminho);
            }

            // Grava conteúdo
            StreamWriter streamWriter = File.CreateText(caminho);
            streamWriter.Write(conteudo);
            streamWriter.Close();
        }

        public string Ler(string caminho)
        {
            var fileInfo = new FileInfo(caminho);
            StreamReader streamReader = fileInfo.OpenText();
            string readToEnd = streamReader.ReadToEnd();
            streamReader.Close();
            return readToEnd;
        }

        public FileInfo[] Buscar(string caminhoPasta, string procurarPor)
        {
            var dir = new DirectoryInfo(caminhoPasta);
            return dir.GetFiles(procurarPor);
        }

        public void Remover(string caminho)
        {
            File.Delete(caminho);
        }
    }
}

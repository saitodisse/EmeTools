using System.Collections.Generic;
using System.IO;

namespace RepositorioArquivoTexto
{
    public static class RepositorioTexto
    {
        public static void Gravar(string caminho, string conteudo)
        {
            var fileInfo = new FileInfo(caminho);

            // Apaga arquivo se já existir
            if (fileInfo.Exists)
            {
                fileInfo.Delete();
            }

            // Grava conteúdo
            StreamWriter streamWriter = fileInfo.CreateText();
            streamWriter.Write(conteudo);
            streamWriter.Close();
        }

        public static string Ler(string caminho)
        {
            var fileInfo = new FileInfo(caminho);
            StreamReader streamReader = fileInfo.OpenText();
            string readToEnd = streamReader.ReadToEnd();
            streamReader.Close();
            return readToEnd;
        }

        public static FileInfo[] Buscar(string caminhoPasta, string procurarPor)
        {
            var dir = new DirectoryInfo(caminhoPasta);
            return dir.GetFiles(procurarPor);
        }
    }
}

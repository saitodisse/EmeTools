using System.IO;

namespace RepositorioArquivoTexto
{
    public static class RepositorioTexto
    {
        public static void Gravar(string caminho, string conteudo)
        {
            var fileInfo = new FileInfo(caminho);

            // Cria diretório se não existir
            if(!fileInfo.Directory.Exists)
            {
                fileInfo.Directory.Create();
            }

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
    }
}

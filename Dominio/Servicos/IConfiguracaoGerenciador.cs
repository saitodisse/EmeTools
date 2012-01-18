using System.Configuration;
using System.Web;

namespace Dominio.Servicos
{
    public interface IConfiguracaoGerenciador
    {
        string RecuperarConfiguracao(string nome);
        string BuscarPastaPadraoWebServer(string caminho);
    }

    public class ConfiguracaoGerenciador : IConfiguracaoGerenciador
    {
        public string RecuperarConfiguracao(string nome)
        {
            return ConfigurationManager.AppSettings[nome];
        }

        public string BuscarPastaPadraoWebServer(string caminho)
        {
            return HttpContext.Current.Server.MapPath("~") + "\\" + caminho;
        }
    }
}
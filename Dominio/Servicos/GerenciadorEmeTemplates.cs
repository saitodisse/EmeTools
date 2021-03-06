﻿using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using Dominio.Entidades;
using Dominio.IRepositorios;
using JsonHelper;

namespace Dominio.Servicos
{
    public interface IGerenciadorEscriptes
    {
        void GravarEscripte(Escripte escripte);
        List<Escripte> PesquisarTodos();
        Escripte Pesquisar(string idSha1);
        void Remover(string idSha1);
        void Atualizar(Escripte escripte);
    }

    public class GerenciadorEscriptes : IGerenciadorEscriptes
    {
        private readonly IRepositorioArquivoTexto _repositorioArquivoTexto;
        private readonly IConfiguracaoGerenciador _configuracaoGerenciador;

        public GerenciadorEscriptes(IRepositorioArquivoTexto repositorioArquivoTexto, IConfiguracaoGerenciador configuracaoGerenciador)
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
            var caminhoCompleto = ObterCaminhoCompleto(escripte);

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

        public Escripte Pesquisar(string idSha1)
        {
            string pastaInterna = _configuracaoGerenciador.RecuperarConfiguracao("caminhoPasta");
            string caminhoPastaWebServer = _configuracaoGerenciador.BuscarPastaPadraoWebServer(pastaInterna);

            var conteudoJSON = _repositorioArquivoTexto.Ler(string.Format("{0}\\{1}.json", caminhoPastaWebServer, idSha1));
            return JsonSerializer.Deserialize<Escripte>(conteudoJSON);
        }

        public void Remover(string idSha1)
        {
            string pastaInterna = _configuracaoGerenciador.RecuperarConfiguracao("caminhoPasta");
            string caminhoPastaWebServer = _configuracaoGerenciador.BuscarPastaPadraoWebServer(pastaInterna);
            _repositorioArquivoTexto.Remover(string.Format("{0}\\{1}.json", caminhoPastaWebServer, idSha1));
        }

        public void Atualizar(Escripte escripte)
        {
            var serializado = JsonSerializer.Serialize(escripte);
            var caminhoCompleto = ObterCaminhoCompleto(escripte);

            //grava no disco, APAGANDO O ANTERIOR
            _repositorioArquivoTexto.Gravar(caminhoCompleto, serializado);
        }

        private string ObterCaminhoCompleto(Escripte escripte)
        {
            //recupera do App.Config / Web.Config
            string pastaInterna = _configuracaoGerenciador.RecuperarConfiguracao("caminhoPasta");
            string caminhoPastaWebServer = _configuracaoGerenciador.BuscarPastaPadraoWebServer(pastaInterna);
            return string.Format("{0}\\{1}.json", caminhoPastaWebServer, escripte.IdSha1);
        }
    }
}
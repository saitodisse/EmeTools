﻿using Dominio.Entidades;
using Dominio.IRepositorios;
using Dominio.Servicos;
using Moq;
using NUnit.Framework;

namespace Dominio.Test
{
    [TestFixture]
    public class GerenciadorEmeTemplatesTest
    {
        private static Mock<IRepositorioArquivoTexto> _repositorioArquivoEscripteMock;
        private static GerenciadorEmeTemplates _gerenciadorEmeTemplates;
        private Mock<IConfiguracaoGerenciador> _configuracaoGerenciador;

        [SetUp]
        public void InicializarServico()
        {
            _repositorioArquivoEscripteMock = new Mock<IRepositorioArquivoTexto>();
            _configuracaoGerenciador = new Mock<IConfiguracaoGerenciador>();
            _gerenciadorEmeTemplates = new GerenciadorEmeTemplates(_repositorioArquivoEscripteMock.Object, _configuracaoGerenciador.Object);
        }
        
        [Test]
        public void ao_salvar_deve_ter_um_IdSha1_gerado()
        {
            var escripte = new Escripte();

            _gerenciadorEmeTemplates.GravarEscripte(escripte);

            Assert.IsNotNullOrEmpty(escripte.IdSha1);
        }

        [Test]
        public void deve_gravar_arquivo_chamando_o_repositorio()
        {
            var escripte = new Escripte();

            _gerenciadorEmeTemplates.GravarEscripte(escripte);

            _repositorioArquivoEscripteMock.Verify(x => x.Gravar(It.IsAny<string>(), It.IsAny<string>()), Times.Once());
        }

        [Test]
        public void recupera_lista_escriptes()
        {
            _gerenciadorEmeTemplates.PesquisarTodos();

            _repositorioArquivoEscripteMock.Verify(x => x.Buscar(It.IsAny<string>(), It.IsAny<string>()), Times.Once());
        }
    }
}
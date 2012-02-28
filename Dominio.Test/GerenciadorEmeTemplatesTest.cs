using System.Collections.Generic;
using Dominio.Entidades;
using Dominio.IRepositorios;
using Dominio.Servicos;
using Moq;
using NUnit.Framework;

namespace Dominio.Test
{
    [TestFixture]
    public class GerenciadorEscriptesTest
    {
        private static Mock<IRepositorioArquivoTexto> _repositorioArquivoEscripteMock;
        private static GerenciadorEscriptes _gerenciadorEscriptes;
        private Mock<IConfiguracaoGerenciador> _configuracaoGerenciador;

        [SetUp]
        public void InicializarServico()
        {
            _repositorioArquivoEscripteMock = new Mock<IRepositorioArquivoTexto>();
            _configuracaoGerenciador = new Mock<IConfiguracaoGerenciador>();
            _gerenciadorEscriptes = new GerenciadorEscriptes(_repositorioArquivoEscripteMock.Object, _configuracaoGerenciador.Object);
        }
        
        [Test]
        public void ao_salvar_deve_ter_um_IdSha1_gerado()
        {
            var escripte = new Escripte();

            _gerenciadorEscriptes.GravarEscripte(escripte);

            Assert.IsNotNullOrEmpty(escripte.IdSha1);
        }

        [Test]
        public void deve_gravar_arquivo_chamando_o_repositorio()
        {
            var escripte = EscripteStub();

            _gerenciadorEscriptes.GravarEscripte(escripte);

            _repositorioArquivoEscripteMock.Verify(x => x.Gravar(It.IsAny<string>(), It.IsAny<string>()), Times.Once());
        }

        [Test]
        public void recupera_lista_escriptes()
        {
            _gerenciadorEscriptes.PesquisarTodos();

            _repositorioArquivoEscripteMock.Verify(x => x.Buscar(It.IsAny<string>(), It.IsAny<string>()), Times.Once());
        }

        [Test]
        public void busca_escripte_por_idsha1()
        {
            var respostaSimuladaJSON = "{\"IdSha1\":\"8E45063BEB9B473C6232F5B764D893E5F310CAED\",\"Nome\":\"a\",\"Descricao\":\"a\",\"Texto\":\"a\"}";
            _repositorioArquivoEscripteMock.Setup(x => x.Ler(It.IsAny<string>())).Returns(respostaSimuladaJSON);
            _gerenciadorEscriptes = new GerenciadorEscriptes(_repositorioArquivoEscripteMock.Object, _configuracaoGerenciador.Object);
            Escripte escripte = _gerenciadorEscriptes.Pesquisar("8E45063BEB9B473C6232F5B764D893E5F310CAED");
            Assert.AreEqual("a", escripte.Nome);
        }

        [Test]
        public void quando_atualiza_mantem_o_idSha1()
        {
            var escripte = EscripteStub();

            var idSha1 = escripte.IdSha1;
            
            _gerenciadorEscriptes.Atualizar(escripte);
            
            Assert.AreEqual(idSha1, escripte.IdSha1);
        }

        private static Escripte EscripteStub()
        {
            var escripte = new Escripte();
            escripte.IdSha1 = "8E45063BEB9B473C6232F5B764D893E5F310CAED";
            escripte.Nome = "Name";
            escripte.Descricao = "Descricao";
            escripte.Texto = "Texto";
            return escripte;
        }

        [Test]
        public void apaga_por_idsha1()
        {
            var respostaSimuladaJSON = "{\"IdSha1\":\"8E45063BEB9B473C6232F5B764D893E5F310CAED\",\"Nome\":\"a\",\"Descricao\":\"a\",\"Texto\":\"a\"}";
            _repositorioArquivoEscripteMock.Setup(x => x.Ler(It.IsAny<string>())).Returns(respostaSimuladaJSON);
            _gerenciadorEscriptes = new GerenciadorEscriptes(_repositorioArquivoEscripteMock.Object, _configuracaoGerenciador.Object);
            _gerenciadorEscriptes.Remover("8E45063BEB9B473C6232F5B764D893E5F310CAED");
        }
    }
}
using System.Collections.Generic;
using Dominio.Entidades;
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
            var escripte = EscripteStub();

            _gerenciadorEmeTemplates.GravarEscripte(escripte);

            _repositorioArquivoEscripteMock.Verify(x => x.Gravar(It.IsAny<string>(), It.IsAny<string>()), Times.Once());
        }

        [Test]
        public void recupera_lista_escriptes()
        {
            _gerenciadorEmeTemplates.PesquisarTodos();

            _repositorioArquivoEscripteMock.Verify(x => x.Buscar(It.IsAny<string>(), It.IsAny<string>()), Times.Once());
        }

        [Test]
        public void busca_escripte_por_idsha1()
        {
            var respostaSimuladaJSON = "{\"IdSha1\":\"8E45063BEB9B473C6232F5B764D893E5F310CAED\",\"Nome\":\"a\",\"Descricao\":\"a\",\"Texto\":\"a\",\"DadoExemplos\":[]}";
            _repositorioArquivoEscripteMock.Setup(x => x.Ler(It.IsAny<string>())).Returns(respostaSimuladaJSON);
            _gerenciadorEmeTemplates = new GerenciadorEmeTemplates(_repositorioArquivoEscripteMock.Object, _configuracaoGerenciador.Object);
            Escripte escripte = _gerenciadorEmeTemplates.Pesquisar("8E45063BEB9B473C6232F5B764D893E5F310CAED");
            Assert.AreEqual("a", escripte.Nome);
        }

        [Test]
        public void quando_atualiza_mantem_o_idSha1()
        {
            var escripte = EscripteStub();

            var idSha1 = escripte.IdSha1;
            
            _gerenciadorEmeTemplates.Atualizar(escripte);
            
            Assert.AreEqual(idSha1, escripte.IdSha1);
        }

        private static Escripte EscripteStub()
        {
            var escripte = new Escripte();
            escripte.IdSha1 = "8E45063BEB9B473C6232F5B764D893E5F310CAED";
            escripte.Nome = "Name";
            escripte.Descricao = "Descricao";
            escripte.Texto = "Texto";
            escripte.DadoExemplos = new List<DadoExemplo>();
            return escripte;
        }

        [Test]
        public void apaga_por_idsha1()
        {
            var respostaSimuladaJSON = "{\"IdSha1\":\"8E45063BEB9B473C6232F5B764D893E5F310CAED\",\"Nome\":\"a\",\"Descricao\":\"a\",\"Texto\":\"a\",\"DadoExemplos\":[]}";
            _repositorioArquivoEscripteMock.Setup(x => x.Ler(It.IsAny<string>())).Returns(respostaSimuladaJSON);
            _gerenciadorEmeTemplates = new GerenciadorEmeTemplates(_repositorioArquivoEscripteMock.Object, _configuracaoGerenciador.Object);
            _gerenciadorEmeTemplates.Remover("8E45063BEB9B473C6232F5B764D893E5F310CAED");
        }
    }
}
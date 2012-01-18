using Dominio.Entidades;
using Dominio.Servicos;
using Moq;
using NUnit.Framework;

namespace Dominio.Test
{
    [TestFixture]
    public class GerenciadorEmeTemplatesTest
    {
        private static Mock<IRepositorio<string>> _repositorioArquivoEscripteMock;
        private static GerenciadorEmeTemplates _gerenciadorEmeTemplates;

        [SetUp]
        private void InicializarServico()
        {
            _repositorioArquivoEscripteMock = new Mock<IRepositorio<string>>();
            _gerenciadorEmeTemplates = new GerenciadorEmeTemplates(_repositorioArquivoEscripteMock.Object);
        }

        [Test]
        public void deve_gravar_arquivo_chamando_o_repositorio()
        {
            var escripte = new Escripte();

            _gerenciadorEmeTemplates.GravarEscripte(escripte);

            _repositorioArquivoEscripteMock.Verify(x => x.Save(It.IsAny<string>()), Times.Once());
        }

        [Test]
        public void ao_salvar_deve_ter_um_IdSha1_gerado()
        {
            var escripte = new Escripte();

            _gerenciadorEmeTemplates.GravarEscripte(escripte);

            Assert.IsNotNullOrEmpty(escripte.IdSha1);
        }

        [Test]
        public void recupera_lista_escriptes()
        {
            _gerenciadorEmeTemplates.PesquisarTodos();

            _repositorioArquivoEscripteMock.Verify(x => x.GetAll(), Times.Once());
        }

    }
}

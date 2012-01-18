using System.Collections.Generic;
using Dominio.Servicos;
using Moq;
using MvcEmeTools.Controllers;
using NUnit.Framework;

namespace MvcEmeTools.Test
{
    [TestFixture]
    public class ControlerTest
    {
        [Test]
        public void Index_chama_PesquisarTodos()
        {
            var gerenciadorEmeTemplatesMock = new Mock<IGerenciadorEmeTemplates>();
            var controller = new EmeTemplatesController(gerenciadorEmeTemplatesMock.Object);
            controller.Index();
        }
    }
}

using System.Collections.Generic;
using System.Web.Mvc;
using Dominio.Entidades;
using Dominio.IRepositorios;
using Dominio.Servicos;

namespace MvcEmeTools.Controllers
{
    public class EmeTemplatesController : Controller
    {
        private IGerenciadorEmeTemplates _gerenciadorEmeTemplates;

        public EmeTemplatesController(IGerenciadorEmeTemplates gerenciadorEmeTemplates)
        {
            _gerenciadorEmeTemplates = gerenciadorEmeTemplates;
        }

        //
        // GET: /EmeTemplates/

        public ActionResult Index()
        {
            var escriptes = _gerenciadorEmeTemplates.PesquisarTodos();

            return View(escriptes);
        }

        public ActionResult Sequencer(string id)
        {
            var escripte = _gerenciadorEmeTemplates.Pesquisar(id);

            return View(escripte);
        }

        //
        // GET: /EmeTemplates/Create

        public ActionResult Create()
        {
            var escripte = new Escripte();
            return View(escripte);
        }

        //
        // POST: /EmeTemplates/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                var escripte = new Escripte();
                escripte = AtualizarDadosViaResponse(collection, escripte);
                _gerenciadorEmeTemplates.GravarEscripte(escripte);
                Response.Write("criado");
                return null;
            }
            catch
            {
                throw;
                return View();
            }
        }


        public ActionResult Edit(string id)
        {
            var escripte = _gerenciadorEmeTemplates.Pesquisar(id);
            return View(escripte);
        }

        [HttpPost]
        public ActionResult Edit(string id, FormCollection collection)
        {
            var escripte = _gerenciadorEmeTemplates.Pesquisar(id);
            AtualizarDadosViaResponse(collection, escripte);
            _gerenciadorEmeTemplates.Atualizar(escripte);
            Response.Write("salvo");
            return null;
        }

        private static Escripte AtualizarDadosViaResponse(FormCollection collection, Escripte escripte)
        {
            // dados da página
            string nome = collection["Nome"];
            string descricao = collection["Descricao"];
            string texto = collection["Texto"];

            // cria objeto
            escripte.Nome = nome;
            escripte.Descricao = descricao;
            escripte.Texto = texto;
            return escripte;
        }

        //
        // GET: /EmeTemplates/Delete/5

        public ActionResult Delete(string id)
        {
            _gerenciadorEmeTemplates.Remover(id);
            return RedirectToAction("Index");
        }
    }
}
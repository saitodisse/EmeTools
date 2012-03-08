using System.Collections.Generic;
using System.Web.Mvc;
using Dominio.Entidades;
using Dominio.IRepositorios;
using Dominio.Servicos;

namespace MvcEmeTools.Controllers
{
    public class EscriptesController : Controller
    {
        private IGerenciadorEscriptes _gerenciadorEscriptes;

        public EscriptesController(IGerenciadorEscriptes gerenciadorEscriptes)
        {
            _gerenciadorEscriptes = gerenciadorEscriptes;
        }

        //
        // GET: /Escriptes/

        public ActionResult Index()
        {
            var escriptes = _gerenciadorEscriptes.PesquisarTodos();

            return View(escriptes);
        }

        public ActionResult Sequencer(string id)
        {
            var escripte = _gerenciadorEscriptes.Pesquisar(id);

            return View(escripte);
        }

        public string PorId(string id)
        {
            var escripte = _gerenciadorEscriptes.Pesquisar(id);

            return escripte.Texto;
        }

        //
        // GET: /Escriptes/Create

        public ActionResult Create()
        {
            var escripte = new Escripte();
            return View(escripte);
        }

        //
        // POST: /Escriptes/Create

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                var escripte = new Escripte();
                escripte = AtualizarDadosViaResponse(collection, escripte);
                _gerenciadorEscriptes.GravarEscripte(escripte);
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
            var escripte = _gerenciadorEscriptes.Pesquisar(id);
            return View(escripte);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Edit(string id, FormCollection collection)
        {
            var escripte = _gerenciadorEscriptes.Pesquisar(id);
            AtualizarDadosViaResponse(collection, escripte);
            _gerenciadorEscriptes.Atualizar(escripte);
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
        // GET: /Escriptes/Delete/5

        public ActionResult Delete(string id)
        {
            _gerenciadorEscriptes.Remover(id);
            return RedirectToAction("Index");
        }
    }
}
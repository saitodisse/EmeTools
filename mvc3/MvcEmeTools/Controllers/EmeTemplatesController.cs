using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using Dominio.Entidades;
using Dominio.IRepositorios;
using Dominio.Servicos;
using JsonHelper;
using RepositorioArquivoTexto;

namespace MvcEmeTools.Controllers
{
    public class EmeTemplatesController : Controller
    {
        private IGerenciadorEmeTemplates _gerenciadorEmeTemplates;
        private readonly IRepositorioArquivoTexto _repositorioArquivoTexto;

        public EmeTemplatesController(IGerenciadorEmeTemplates gerenciadorEmeTemplates)
        {
            _gerenciadorEmeTemplates = gerenciadorEmeTemplates;
            _repositorioArquivoTexto = new RepositorioArquivoTexto.RepositorioArquivoTexto();
        }

        //
        // GET: /EmeTemplates/

        public ActionResult Index()
        {
            var escriptes = _gerenciadorEmeTemplates.PesquisarTodos();

            return View(escriptes);
        }

        //
        // GET: /EmeTemplates/Details/5

        public ActionResult Details(string id)
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
                var escripte = ObterEscripteDoResponse(collection);
                _gerenciadorEmeTemplates.GravarEscripte(escripte);
                return RedirectToAction("Index");
            }
            catch
            {
                throw;
                return View();
            }
        }


        public ActionResult Edit(string id)
        {
            return View(_gerenciadorEmeTemplates.Pesquisar(id));
        }

        [HttpPost]
        public ActionResult Edit(string id, FormCollection collection)
        {
            var escripte = ObterEscripteDoResponse(collection);
            _gerenciadorEmeTemplates.Atualizar(escripte);
            return RedirectToAction("Index");
        }

        private static Escripte ObterEscripteDoResponse(FormCollection collection)
        {
            // dados da página
            string nome = collection["Nome"];
            string descricao = collection["Descricao"];
            string texto = collection["Texto"];

            // cria objeto
            var escripte = new Escripte();
            escripte.Nome = nome;
            escripte.Descricao = descricao;
            escripte.Texto = texto;
            escripte.DadoExemplos = new List<DadoExemplo>();
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
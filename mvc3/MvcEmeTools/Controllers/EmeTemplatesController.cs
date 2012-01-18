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
            // recupera todos arquivos da pasta
            string caminhoPasta = Server.MapPath(@"..\..\TemplatesJson\");
            string nomeArquivo = id + ".json";
            string conteudoJson = _repositorioArquivoTexto.Ler(caminhoPasta + nomeArquivo);

            var escripte = JsonSerializer.Deserialize<Escripte>(conteudoJson);

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


                // grava na pasta do projeto TemplatesJson\...
                string nomeArquivo = escripte.IdSha1;
                nomeArquivo = nomeArquivo + ".json";
                var caminhoArquivo = Server.MapPath(@"..\TemplatesJson\") + nomeArquivo;

                _gerenciadorEmeTemplates.GravarEscripte(escripte);


                return RedirectToAction("Index");
            }
            catch
            {
                throw;
                return View();
            }
        }

        //
        // GET: /EmeTemplates/Edit/5

        //public ActionResult Edit(int id)
        //{
        //    return View();
        //}

        ////
        //// POST: /EmeTemplates/Edit/5

        //[HttpPost]
        //public ActionResult Edit(int id, FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add update logic here

        //        return RedirectToAction("Index");
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        ////
        //// GET: /EmeTemplates/Delete/5

        //public ActionResult Delete(int id)
        //{
        //    return View();
        //}

        ////
        //// POST: /EmeTemplates/Delete/5

        //[HttpPost]
        //public ActionResult Delete(int id, FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add delete logic here

        //        return RedirectToAction("Index");
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}
    }
}
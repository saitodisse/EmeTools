using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dominio.Entidades;
using JsonHelper;
using RepositorioArquivoTexto;

namespace MvcEmeTools.Controllers
{
    public class EmeTemplatesController : Controller
    {
        //
        // GET: /EmeTemplates/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /EmeTemplates/Details/5

        public ActionResult Details(int id)
        {
            return View();
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

                // serializa para json
                string textoObjSerializado = JsonSerializer.Serialize(escripte);

                // grava na pasta do projeto TemplatesJson\...
                string nomeArquivo = escripte.Nome.Replace(" ", "_");
                nomeArquivo = nomeArquivo + ".json";
                var caminhoArquivo = Server.MapPath(@"..\TemplatesJson\") + nomeArquivo;
                RepositorioTexto.Gravar(caminhoArquivo, textoObjSerializado);

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
 
        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /EmeTemplates/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /EmeTemplates/Delete/5
 
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /EmeTemplates/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}

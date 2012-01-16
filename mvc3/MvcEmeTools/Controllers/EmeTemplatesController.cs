using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
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
            // recupera todos arquivos da pasta
            var caminhoPasta = Server.MapPath(@"TemplatesJson\");
            var procurarPor = "*.json";
            var fileInfos = RepositorioTexto.Buscar(caminhoPasta, procurarPor);

            var caminhos = fileInfos.Select(x => x.FullName);

            var escriptes = new List<Escripte>();

            foreach (var caminho in caminhos)
            {
                var escripteSerializadoJson = RepositorioTexto.Ler(caminho);
                // DESerializa para json
                escriptes.Add(JsonSerializer.Deserialize<Escripte>(escripteSerializadoJson));
            }

            return View(escriptes);
        }

        //
        // GET: /EmeTemplates/Details/5

        public ActionResult Details(string id)
        {
            // recupera todos arquivos da pasta
            var caminhoPasta = Server.MapPath(@"..\..\TemplatesJson\");
            var nomeArquivo = id + ".json";
            var conteudoJson = RepositorioTexto.Ler(caminhoPasta + nomeArquivo);

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

                // serializa para json
                string textoObjSerializado = JsonSerializer.Serialize(escripte);
                
                // define SHA1
                escripte.IdSha1 = SHA1Hash(textoObjSerializado);

                // serializa novamente com seu SHA1
                textoObjSerializado = JsonSerializer.Serialize(escripte);

                // grava na pasta do projeto TemplatesJson\...
                string nomeArquivo = escripte.IdSha1;
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

        public string SHA1Hash(string input)
        {
            SHA1 sha = new SHA1CryptoServiceProvider();
            byte[] data = Encoding.ASCII.GetBytes(input);
            byte[] hash = sha.ComputeHash(data);

            var sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
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

var Xixizero = function(dado, templates, newLine) {
    this.Dado = dado;
    this.Templates = templates;

    this.transformar = function() {
        templates = this.Templates;
        var retornoParcial = "";

        // busca joinTemplate para cada template
        for (var i = 0; i < templates.length; i++) {
            var ultimoTemplate = (i === templates.length - 1);
            // não considera comentários
            var joinTemplate = "";
            for (var j = 0; j < templates[i].length; j++) {
                var linhaTemplateAtual = templates[i][j];
                var linhaVazia = linhaTemplateAtual.length === 0;
                var linhaComentario = linhaTemplateAtual.substring(0, 1) === "#";

                if (!linhaComentario) {
                    joinTemplate += linhaTemplateAtual;
                }
                
                if(linhaVazia && ultimoTemplate) {
                    joinTemplate += newLine;
                }
            }
            templates[i].joinTemplate = joinTemplate;
        }

        // substitui XXX para cada template
        for (var i = 0; i < templates.length; i++) {
            var ultimoTemplate = (i === templates.length - 1);

            // faz substituição de template sobre template
            if (!ultimoTemplate) {
                retornoParcial = replaceTodos(templates[i + 1].joinTemplate, "xxx", templates[i].joinTemplate);
            }

                // faz substituição do dado sobre último template
            else if (ultimoTemplate && templates.length > 1) {
                retornoParcial = replaceTodos(retornoParcial, "xxx", this.Dado);
            }

                // faz substituição simples sobre único template
            else if (ultimoTemplate && templates.length === 1) {
                retornoParcial = replaceTodos(templates[i].joinTemplate, "xxx", this.Dado);
            }
        }

        return retornoParcial;
    };
};

var RoboXixi = function(texto, newLine) {
    this.Texto = texto;
    this.Xixizeros = [];
    var listaLinhas = this.Texto.split(newLine);
    var listaLinhaDados = [];
    var templates = [];
    var listaLinhaTemplates = [];
    var i;

    this.Iniciar = function() {
        //ACHA SEPARADORES
        for (i = 0; i < listaLinhas.length; i++) {
            var dadosPreenchidos = (listaLinhaDados.length > 0);
            var linhaSeparador = (listaLinhas[i] === '///');
            var templatePossuiLinha = (listaLinhaTemplates.length > 0);
            var ultimaLinha = (i === listaLinhas.length - 1);

            // acrescenta linha no template atual
            if (dadosPreenchidos && !linhaSeparador) {
                listaLinhaTemplates.push(listaLinhas[i]);
            }
            
            // acrescenta vazio antes do próximo separador
            else if (dadosPreenchidos && linhaSeparador) {
                listaLinhaTemplates.push("");
            }

            //achou um separador ou final
            if (linhaSeparador || ultimaLinha) {
                // guarda os dados se for o primeiro separador
                if (!dadosPreenchidos) {
                    listaLinhaDados = listaLinhas.slice(0, i);
                    continue;
                }

                // template finalizado, acrescenta na lista templates
                if (templatePossuiLinha || ultimaLinha) {
                    templates.push(listaLinhaTemplates);
                    listaLinhaTemplates = []; //reseta templateAtual
                }
            }
        }

        // cria Xixizeros
        for (i = 0; i < listaLinhaDados.length; i++) {
            this.Xixizeros.push(new Xixizero(listaLinhaDados[i], templates, newLine));
        }
    };

    this.Transformar = function() {
        var resultadoFinal = "";
        for (var j = 0; j < this.Xixizeros.length; j++) {
            var xixizero = this.Xixizeros[j];
            resultadoFinal += xixizero.transformar();
        }
        return resultadoFinal;
    };
    
    //main
    this.Iniciar();
};

function replaceTodos(texto, de, para) {
    return texto.replace(new RegExp(de, "gi"), para);
}

// SED
var o;
var out = function(s) { o = o + s; };
var err = function(s) { o = o + "<b>" + s + "</b>"; };
var sedJsed = function (texto, sedScript, nFlag, posixFlag, jumpMax) {
    o = "";
    sed.nflag = nFlag;
    sed.pflag = posixFlag;
    sed.jumpmax = jumpMax;
    sed.out = out;
    sed.err = err;
    sed(sedScript, texto);
    return o;
};

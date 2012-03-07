var SHOW_ALERT_ON_ERRORS = false;

// configura template do underscore
//_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

function disparaErro(name, message) {
    var err = new Error();
    err.name = name;
    err.message = message;
    if (SHOW_ALERT_ON_ERRORS) {
        var sMesssage = '';
        sMesssage += '--------\n';
        sMesssage += 'ERROR:\n';
        sMesssage += '--------\n\n';
        sMesssage += err.name + '\n';
        sMesssage += '---------------------------------------------\n';
        sMesssage += err.message;
        alert(sMesssage);
    } else {
        throw err;
    }
}

//Exceptions
var COMANDO_NAO_INFORMADO = function () {
    return "O comando do '///' deve ser informado logo apos o '///'";
};

var replace_show_invisible = function (texto) {
    texto = texto.replace(/^(\/\/\/\w)$/gm, "<span class='comando'>$1</span>");
    texto = texto.replace(/^\/$/gm, "<span class='char_replacer_separator'>/</span>");
    texto = texto.replace(/$/gm, "<span class='char_n'>\\n</span>");
    texto = texto.replace(/\t/gm, "<span class='char_tab'>\\t</span>");
    texto = texto.replace(/^(#.*)$/gm, "<span class='comentario'>$1</span>");
    return texto;
};

var Xixizero = function (escripte, comando, newLine) {
    this.DadoTransformado = "";
    this.Comando = comando;
    this.Escripte = escripte;
    this.Indice = -99;

    this.escripteFormatado = function () {
        var resultado = "";
        resultado += "///";
        resultado += this.Comando;
        resultado += newLine;
        resultado += this.Escripte;
        return resultado;
    };

    this.primeiroComentario = function () {
        var re = /#.*/gi;
        var m = re.exec(this.Escripte);
        if (m !== null) {
            return m[0].substring(1);
        }
        return escripte;
    };

    this.transformar = function (texto, roboXixi) {
        // (T)emplate: substitui 'xxx' por Escript
        if (this.Comando === "t") {
            this.DadoTransformado = aplicarTemplateUnderscore(texto, this, newLine, roboXixi);
        }
        // (R)EPLACE: substituição javascript genérica
        if (this.Comando === "r") {
            this.DadoTransformado = substituirCustomizado(this.Escripte, texto, newLine);
        }
        // (S)ED: executa comando JSED
        if (this.Comando === "s") {
            this.DadoTransformado = sedJsed(
                texto,
                this.Escripte,
                true,
                false,
                10000);
        }
        // (C)OMANDOS: executa comando pre-determinado daqui mesmo
        if (this.Comando === "c") {
            this.DadoTransformado = executarComandos(texto, this.Escripte, newLine);
        }
    };
};

var aplicarTemplateUnderscore = function (texto, xixizero, newLine, roboXixi) {
    var objetoPassado = {
        "linhas": texto.split(newLine),
        "roboXixi": roboXixi
    };

    //retira todos os comentários
    var escripte = replaceTodos(xixizero.Escripte, "^#.*" + newLine + "?", "");
    escripte = decodeHtml(escripte);
    escripte = escripte.replace(/\\n/gmi, "\n");
    escripte = escripte.replace(/\\t/gmi, "\t");

    return _.template(escripte, objetoPassado);
};

var RoboXixi = function (texto, newLine) {
    this.Texto = texto;
    this.DadosIniciais = "";
    this.ResultadoFinal = "";
    this.Xixizeros = [];
    var listaLinhas = this.Texto.split(newLine);
    var escripte = "";
    var i;

    this.iniciar = function () {
        var comandoAnterior = "";
        var comandoUltimo = "";

        //ACHA SEPARADORES
        for (i = 0; i < listaLinhas.length; i++) {
            var dadosPreenchidos = (this.DadosIniciais.length > 0);
            var linhaSeparador = (listaLinhas[i].substring(0, 3) === '///');
            var templatePossuiLinha = (escripte.length > 0);
            var ultimaLinha = (i === listaLinhas.length - 1);

            // define o comando atual (s,t,r)
            if (linhaSeparador || ultimaLinha) {
                comandoAnterior = comandoUltimo;
                if (!ultimaLinha) {
                    // comando não informado dispara erro
                    if (listaLinhas[i].length < 4) {
                        disparaErro(
                            'RoboXixi.iniciar() -> COMANDO_NAO_INFORMADO',
                            'A linha [' + (i + 1) + '] possui o separador "///" porem nao foi informado o comando.\nComandos disponiveis: "///c", "///t", "///r" ou "///s".');
                    }

                    comandoUltimo = listaLinhas[i].substring(3, 4);
                }
            }

            if (dadosPreenchidos && !linhaSeparador) {
                // acrescenta linha no template atual
                if (escripte.length > 0) {
                    escripte += newLine;
                }
                escripte += listaLinhas[i];
            } else if (dadosPreenchidos && linhaSeparador) {
                // acrescenta nova linha antes do próximo separador
                // escripte += newLine;
            }

            //achou um separador ou final
            if (linhaSeparador || ultimaLinha) {
                if (!dadosPreenchidos) {
                    // guarda os dados se for o primeiro separador
                    this.DadosIniciais = listaLinhas.slice(0, i).join(newLine);
                    continue;
                }
                if (templatePossuiLinha || ultimaLinha) {
                    if (ultimaLinha) {
                        //retira último NEWLINE antes de inserir o último escripte
                        var ultimoNewLine = escripte.lastIndexOf(newLine); // template finalizado, acrescenta na lista templates
                        escripte = escripte.substring(0, ultimoNewLine);
                    }

                    this.Xixizeros.push(new Xixizero(escripte, comandoAnterior, newLine));
                    escripte = ""; //reseta templateAtual
                }
            }
        }
    };

    this.transformar = function (indiceDeParada) {
        var indiceUltimoXixizero = this.Xixizeros.length - 1;
        if (indiceDeParada !== undefined) {
            // Define indice final
            indiceUltimoXixizero = indiceDeParada - 1;
        }

        // realiza cada transformação
        var transformacaoAcumulada = this.DadosIniciais;
        for (var j = 0; j <= indiceUltimoXixizero; j++) {
            var xixizero = this.Xixizeros[j];
            xixizero.transformar(transformacaoAcumulada, this);
            xixizero.Indice = j;
            transformacaoAcumulada = xixizero.DadoTransformado;
        }
        this.ResultadoFinal = transformacaoAcumulada;
    };

    //main
    this.iniciar();
};


function obter_replacer_e_substitutor(escripte, newLine) {
    //retira todos os comentários
    escripte = replaceTodos(escripte, "^#.*" + newLine + "?", "");

    // verifica se o ultimo caractere é um newline
    // caso ocorra algum comentário após o substituitor
    var ultimoCaractere = escripte.substring(escripte.length - newLine.length, escripte.length);
    var penultimoCaractere = escripte.substring(escripte.length - newLine.length * 2, escripte.length - newLine.length);
    // caso o substituitor estiver vazio então ignora essa exclusão
    if (ultimoCaractere === newLine && penultimoCaractere !== "/") {
        // reitira o newLine do final
        escripte = escripte.substring(0, escripte.length - newLine.length);
    }

    //busca o separador "/" no escripte
    var indiceDaBarra = escripte.indexOf(newLine + "/" + newLine) + 1;

    //recupera o replacer e o substitutor
    var replacer = escripte.substring(0, indiceDaBarra - 1);

    var inicioSubstituitor = indiceDaBarra + newLine.length * 2;

    var substitutor = escripte.substring(inicioSubstituitor, escripte.length);

    return {
        replacer: replacer,
        substitutor: substitutor
    };
}

function substituirCustomizado(escripte, texto, newLine) {
    var objReplacer = obter_replacer_e_substitutor(escripte, newLine);

    objReplacer.substitutor = objReplacer.substitutor.replace(/\\n/gmi, "\n");
    objReplacer.substitutor = objReplacer.substitutor.replace(/\\t/gmi, "\t");
    objReplacer.substitutor = objReplacer.substitutor.replace(/\\(\d)/gmi, "$$$1");

    //realiza a substituicao no texto
    return replaceTodos(texto, objReplacer.replacer, objReplacer.substitutor);
}

function replaceTodos(texto, de, para) {
    return texto.replace(new RegExp(de, "gmi"), para);
}

// SED
var o;
var out = function (s) { o = o + s; };
var err = function (s) { o = o + "<b>" + s + "</b>"; };
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


var executarComandos = function (texto, escripte, newLine) {
    var resultado = texto;
    var comandos = escripte.split(newLine);
    for (var i = 0; i < comandos.length; i++) {
        var comandoAtual = comandos[i];
        switch (comandoAtual) {
            case "sort":
                resultado = ordenarTudo(resultado, 0, newLine);
                break;
            case "sort desc":
                resultado = ordenarTudo(resultado, 1, newLine);
                break;
            case "distinct":
                resultado = distinct(resultado, newLine);
                break;
            case "trim":
                resultado = trim(resultado);
                break;
            case "trim lines":
                resultado = trimLines(resultado, newLine);
                break;
            default:
                break;
        }
    }
    return resultado;
};

var trim = function (texto) {
    return texto.replace(/^\s*([^\s]*)\s*$/gm, "$1");
};

var trimLines = function (texto, newLine) {
    texto = texto.replace(/^\s*$\n/gm, "");
    var inicioUltimoNewLine = texto.length - newLine.length;
    if (texto.lastIndexOf(newLine) === inicioUltimoNewLine) {
        texto = texto.substring(0, inicioUltimoNewLine);
    }
    return texto;
};

var ordenarTudo = function (texto, reverso, newLine) {
    if (reverso === 1) {
        return texto.split(newLine).sort().reverse().join(newLine);
    } else {
        return texto.split(newLine).sort().join(newLine);
    }
};


////////////////////////////////////////////
// http://www.jslab.dk/library/Array.unique
////////////////////////////////////////////
var distinct = function (texto, newLine) {
    var lista = texto.split(newLine);
    var a = [];
    var l = lista.length;
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            // If lista[i] is found later in the array
            if (lista[i] === lista[j])
                j = ++i;
        }
        a.push(lista[i]);
    }
    return a.join(newLine);
};
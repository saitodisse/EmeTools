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
        // retira todos os comentários
        var escripteSemComentarios = replaceTodos(this.Escripte, "^#.*" + newLine + "?", "");


        // (T)emplate: template do undescore
        if (this.Comando === "t") {
            this.DadoTransformado = aplicarTemplateUnderscore(texto, this, newLine, roboXixi);
        }
        // (R)EPLACE: substituição javascript genérica
        else if (this.Comando === "r") {
            this.DadoTransformado = substituirCustomizado(escripteSemComentarios, texto, newLine);
        }
        // (S)ED: executa comando JSED
        else if (this.Comando === "s") {
            this.DadoTransformado = sedJsed(
                texto,
                this.Escripte,
                true,
                false,
                10000);
        }
        // (C)OMANDOS: executa comando pre-determinado daqui mesmo
        else if (this.Comando === "c") {
            this.DadoTransformado = executarComandos(texto, escripteSemComentarios, newLine, roboXixi);
        }
        // (X)XX: template XXX. 
        //   xxx0 pega o resultado da primeira transformação em lista "splitada(\n)"
        //   e aplica no template passado.
        else if (this.Comando === "x") {
            this.DadoTransformado = transformarXxx(texto, escripteSemComentarios, newLine, roboXixi);
        }
    };
};

var obterResultadoXixizero = function (matches, roboXixi, newLine) {
    var resultadoXixizero;
    var indiceXxx = parseInt(matches[1]);

    if (indiceXxx === -1) {
        resultadoXixizero = roboXixi.DadosIniciais;
    } else {
        resultadoXixizero = roboXixi.Xixizeros[indiceXxx].DadoTransformado;
    }
    return resultadoXixizero.split(newLine);
};


var aplicarTemplateUnderscore = function (texto, xixizero, newLine, roboXixi) {
    var roboLocal;
    var get;

    if (!(_.isUndefined(roboXixi))) {
        roboLocal = roboXixi;
        get = function (indice) {
            return roboLocal.get(indice);
        };
    }

    var objetoPassado = {
        linhas: texto.split(newLine),
        roboXixi: !(_.isUndefined(roboXixi)) && roboXixi,
        get: !(_.isUndefined(roboXixi)) && get
    };

    //retira todos os comentários
    var escripte = replaceTodos(xixizero.Escripte, "^#.*" + newLine + "?", "");
    escripte = decodeHtml(escripte);
    escripte = escripte.replace(/\\n/gmi, "\n");
    escripte = escripte.replace(/\\t/gmi, "\t");

    return _.template(escripte, objetoPassado);
};

function obter_replacer_e_substitutor(escripte, newLine) {
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

var getResultadoXixizero = function (par, roboXixi) {
    if (_.isNaN(parseInt(par))) {
        return buscarPorAlias(par, roboXixi);
    }
    else {
        return buscarPorIndice(par, roboXixi);
    }
};
var buscarPorIndice = function (parInt, roboXixi) {
    var indiceXixizero = parseInt(parInt);
    if (indiceXixizero === -1) {
        return roboXixi.DadosIniciais;
    } else {
        return roboXixi.Xixizeros[indiceXixizero].DadoTransformado;
    }
};
var buscarPorAlias = function (parString, roboXixi) {
    return roboXixi.buscarXixizeroPorAlias(parString).DadoTransformado;
};

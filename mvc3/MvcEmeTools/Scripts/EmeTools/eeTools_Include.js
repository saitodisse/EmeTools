var DEBUG = false;
var NEW_LINE = '\r\n';


var Xixizero = function (dado, template) {
    this.Dado = dado;
    this.Template = template;

    this.resultado = function() {
        return replaceTodos(this.Template, "xxx", this.Dado);
    };
};

var RoboXixi = function (texto) {
    this.Texto = texto;
    this.Xixizeros = [];
    var i = 0;

    var listaLinhas = this.Texto.split(NEW_LINE);
    var listaLinhaDados = [];
    var listaLinhaTemplates = [];
    
    // acha separador
    for (i = 0; i < listaLinhas.length; i++) {
        if (listaLinhas[i] == '///') {
            listaLinhaDados = listaLinhas.slice(0, i);
            listaLinhaTemplates = listaLinhas.slice(i + 1, listaLinhas.length);
        }
    }
    
    // template único
    var joinModeloSemComentario = "";
    for (i = 0; i < listaLinhaTemplates.length; i++) {
        if(listaLinhaTemplates[i].substring(0,1) !== "#") {
            joinModeloSemComentario = joinModeloSemComentario + listaLinhaTemplates[i];
            //joinModeloSemComentario = joinModeloSemComentario + NEW_LINE;
        }
    }
    
    // cria Xixizeros
    for (i = 0; i < listaLinhaDados.length; i++) {
        this.Xixizeros.push(new Xixizero(listaLinhaDados[i], joinModeloSemComentario));
    }
};



Array.prototype.transpose = function() {

    // Calculate the width and height of the Array
    var a = this,
        w = a.length ? a.length : 0,
        h = a[0] instanceof Array ? a[0].length : 0;

    // In case it is a zero matrix, no transpose routine needed.
    if (h === 0 || w === 0) {
        return [];
    }

    /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
    var i, j, t = [];

    // Loop through every item in the outer array (height)
    for (i = 0; i < h; i++) {

        // Insert a new row (array)
        t[i] = [];

        // Loop through every item per item in outer array (width)
        for (j = 0; j < w; j++) {

            // Save transposed data.
            t[i][j] = a[j][i];
        }
    }

    return t;
};


var Transpose = function(texto) {

    var linhas = texto.split(NEW_LINE);
    var colunas = [];
    var arrayBi = [];

    for (var i = 0; i < linhas.length; i++) {
        colunas = linhas[i].split('\t');
        arrayBi[i] = colunas;
    }

    var arTransposed = arrayBi.transpose();
    var retornoString = "";

    for (var i = 0; i < arTransposed.length; i++) {
        retornoString += arTransposed[i].join('\t') + NEW_LINE;
    }

    return retornoString;
};


var Xxx = function(texto) {
    var matches, regexModelo, textoAux, retorno, modeloAtual, listaXxx, resultadoSubstituicao;
    var listaLinhas = texto.split(NEW_LINE);
    var dados = [], modelos = [], regMods = [];
    var reEhExpressaoRegular = /^(e)?[/](.*?)[/](\w*)$/gi ;
    var indiceMods = -1;

    // Busca separador
    for (var i = 0; i < listaLinhas.length; i++) {
        if (listaLinhas[i] == '///') {
            dados = listaLinhas.slice(0, i);
            modelos = listaLinhas.slice(i + 1, listaLinhas.length);
        }
    }

    if (dados.length == 0 || modelos.length == 0) {
        return;
    }


    var modelosAux = [];

    // retira linha de comentários
    for (var j = 0; j < modelos.length; j++) {
        if (modelos[j].substring(0, 1) != "#")
            modelosAux.push(modelos[j]);
    }
    modelos = modelosAux;

    // preenche a lista do modelo
    for (var j = 0; j < modelos.length; j++) {
        matches = reEhExpressaoRegular.exec(modelos[j]);
        if (matches != null) {
            regexModelo = RegexModelo;
            regexModelo.modoExtrair = (matches[1] == "e");
            regexModelo.regex = new RegExp(matches[2], matches[3].length == 0 ? "gi" : matches[3]); // REGEX

            //regex
            indiceMods++;
            regMods.push(regexModelo);
        } else {
            //substituição simples
            if (j > 0)
                regMods[indiceMods].AppendReplacer(modelos[j]); // Adiciona linha de "replacer"
            else
                break; // XXX - modo normal
        }
    }

    retorno = "";

    // substitui os dados no modelo
    for (var i = 0; i < dados.length; i++) {
        ////////////////////////////
        // MODO Clássico, sem regex
        ////////////////////////////
        if (regMods.length == 0) {

            modeloAtual = modelos.join(NEW_LINE);

            // separa as colunas da linha se vieram com [tab]
            var colunas = dados[i].split('\t');

            // substitui as colunas no modelo
            resultadoSubstituicao = modeloAtual;

            // XXX1, XXX2, XXX3, ...
            for (var jj = 0; jj < colunas.length; jj++) {
                resultadoSubstituicao = replaceTodos(resultadoSubstituicao, "xxx" + (jj + 1), colunas[jj]);
            }

            // XXX
            resultadoSubstituicao = resultadoSubstituicao.replace( /xxx/gi , dados[i]);
            retorno = retorno + resultadoSubstituicao;
        }

            ////////////////////////////////
            // MODO REGEX - multiplas linhas (não está funcionando!!!)
            ////////////////////////////////
        else {
            textoAux = dados[i];
            for (j = 0; j < regMods.length; j++) {
                textoAux = ReplaceTodasLinhas(regMods[j], textoAux);
            }

            if (regMods[0].Match(dados[i]))
                retorno = retorno + textoAux + NEW_LINE;
        }
    }
    return retorno;
};


var XxxLista = function(texto) {
    var listaLinhas = texto.split(NEW_LINE);
    var dados = [];
    var resultado = [];
    var contador = 0;

    for (i = 0; i < listaLinhas.length; i++) {
        if (listaLinhas[i] == '///') {
            dados = listaLinhas.slice(0, i);
            resultado = listaLinhas.slice(i + 1, listaLinhas.length);
            break;
        }
    }

    for (i = 0; i < resultado.length; i++) {
        if (resultado[i].match( /\bxxx\b/gi ) != null) {
            resultado[i] = resultado[i].replace( /\bxxx\b/gi , dados[contador]);
            contador++;
        }
    }
    return resultado.join(NEW_LINE);
};


var XxxExisteLista = function(texto) {
    var listaLinhas = texto.split(NEW_LINE);
    var dados = [];
    var resultado = [];

    for (i = 0; i < listaLinhas.length; i++) {
        if (listaLinhas[i] == '///') {
            dados = listaLinhas.slice(0, i);
            resultado = listaLinhas.slice(i + 1, listaLinhas.length);
            break;
        }
    }

    for (var i = 0; i < resultado.length; i++) {
        for (var j = 0; j < dados.length; j++) {
            var dado = dados[j];
            if (resultado[i].match(new RegExp("\\b" + dado + "\\b", "gi")) != null) {
                break;
            }

            //chegou ao final sem casar...
            if (j == dados.length - 1) {
                resultado[i] = "";
            }
        }
    }
    return resultado.join(NEW_LINE);
};


var RegexModelo = {
    texto: '',
    regex: null,
    replacer: null,
    modoExtrair: null,
    Match: function(t) {
        return t.match(this.regex) != null;
    },
    Replace: function() {
        if (this.modoExtrair)
            return Extrair(this.regex, this.texto);                // MODO Extrair
        else
            return this.texto.replace(this.regex, this.replacer); // MODO Replace
    },
    AppendReplacer: function(rep) {
        if (this.replacer != null)
            rep = NEW_LINE + rep;
        else
            this.replacer = "";
        this.replacer = this.replacer + rep;
    }
};


var RegexExtractor = function(texto) {
    var regex, retornoFinal, matchResultArray, len;

    regex = prompt("Regex", ""), retornoFinal;
    regex = new RegExp(regex, "gm");

    retornoFinal = retornoFinal + "---------------";
    retornoFinal = retornoFinal + NEW_LINE;
    retornoFinal = retornoFinal + "Regex=/" + regex + "/g";
    retornoFinal = retornoFinal + NEW_LINE;
    retornoFinal = retornoFinal + "---------------";
    retornoFinal = retornoFinal + NEW_LINE;

    if (regex == "" || regex == null)
        return (retornoFinal);
    matchResultArray = texto.match(regex);
    if (matchResultArray) {
        len = matchResultArray.length;

        texto = "";
        for (var i = 0; i < len; i++) {
            texto = texto + matchResultArray[i];
            if (i != len - 1)
                texto = texto + NEW_LINE;
        }
        retornoFinal = retornoFinal + texto;

    }
    return (retornoFinal);
};


var regexLinesDeleter = function(texto) {
    var _regex, retornoFinal;

    _regex = prompt("Regex", ""), retornoFinal;
    regex = new RegExp(_regex, "gm");

    retornoFinal = retornoFinal + "---------------";
    retornoFinal = retornoFinal + NEW_LINE;
    retornoFinal = retornoFinal + "[" + _regex + "]";
    retornoFinal = retornoFinal + NEW_LINE;
    retornoFinal = retornoFinal + "---------------";
    retornoFinal = retornoFinal + NEW_LINE;

    if (_regex == "" || _regex == null)
        return (retornoFinal);
    var listaTotal = texto.split(NEW_LINE);
    texto = "";
    for (var i = 0; i < listaTotal.length; i++) {
        if (!listaTotal[i].match(regex)) {
            texto = texto + listaTotal[i] + NEW_LINE;
        }
    }
    retornoFinal = retornoFinal + texto;

    return (retornoFinal);
};


var OrdenarTudo = function(texto, reverso) {
    if (reverso == 1) {
        return texto.split(NEW_LINE).sort().reverse();
    } else {
        return texto.split(NEW_LINE).sort();
    }
};


var Distinct = function(texto, reverso) {
    var listaOrdenada = OrdenarTudo(texto, reverso);
    for (i = listaOrdenada.length - 1; i > 0; i--) {
        if (listaOrdenada[i] == listaOrdenada[i - 1]) {
            // ++ arrayObject.splice(index,howmany,element1,.....,elementX) -- http://www.w3schools.com/jsref/jsref_splice.asp
            listaOrdenada.splice(i, 1);
        }
    }
    return listaOrdenada;
};


var ReplaceTodasLinhas = function(regMod, textoAux) {
    var textoAuxArr = textoAux.split(NEW_LINE);
    for (k = 0; k < textoAuxArr.length; k++) {
        regMod.texto = textoAuxArr[k];
        textoAuxArr[k] = regMod.Replace();
    }
    return textoAuxArr.join(NEW_LINE);
};


var IdentarTab2Spaces = function(texto) {
    var linhas = texto.split(NEW_LINE);
    var colunas = [];
    var maiorTamanhoLista = [];
    var espacos = "";

    //acha o maior tamanho de cada coluna
    for (i = 0; i < linhas.length; i++) {
        colunas = linhas[i].split('\t');
        for (j = 0; j < colunas.length; j++) {
            tamanho = colunas[j].length;
            if (tamanho > maiorTamanhoLista[j] || maiorTamanhoLista[j] == null)
                maiorTamanhoLista[j] = tamanho;
        }

    }

    //identa com espacos para se ajustar ao maior tamanho
    for (i = 0; i < linhas.length; i++) {
        colunas = linhas[i].split('\t');
        for (j = 0; j < colunas.length; j++) {
            espacos = "";
            tamanho = colunas[j].length;
            for (k = tamanho; k < maiorTamanhoLista[j]; k++) {
                espacos = espacos + " ";
            }
            colunas[j] = colunas[j] + espacos;
        }
        linhas[i] = colunas.join('  ');
    }
    return linhas;
};


var IdentarSpaces2Tab = function(texto) {
    var linhas = texto.split(NEW_LINE);
    for (i = 0; i < linhas.length; i++) {
        linhas[i] = linhas[i].replace( /\s{2,}/gi , "\t");
        linhas[i] = linhas[i].replace( /^\s+/gi , "");
        linhas[i] = linhas[i].replace( /\s+$/gi , "");
    }
    return linhas;
};


var SQL_Converter_Campo_Tipo_CSharp = function(texto) {

    var ObterTipoCSharp = function() {
        switch (tipo) {
        case "bit":
            return "bool";
        case "char":
        case "varchar":
            return "string";
        case "datetime":
            return "DateTime";
        case "decimal":
        case "numeric":
            return "double";
        case "int":
        case "smallint":
            return "int";
        default:
            return "string";
        }
    };
    var listaLinhas = texto.split(NEW_LINE);
    var modelo = "private _tipo_ _xxx;\npublic _tipo_ xxx\n{\n    get { return _xxx; }\n    set { _xxx = value; }\n}";
    var resultado = [];

    for (i = 0; i < listaLinhas.length; i++) {
        if (listaLinhas[i] == "")
            break;

        NomeTipo = listaLinhas[i].split('\t');

        nome = NomeTipo[0];
        tipo = NomeTipo[1];

        modeloReplaced = modelo.replace( /_tipo_/gi , ObterTipoCSharp(tipo));
        modeloReplaced = modeloReplaced.replace( /_xxx/gi , "_" + nome.substring(0, 1).toLowerCase() + nome.substring(1, nome.length));
        modeloReplaced = modeloReplaced.replace( /xxx/gi , nome.substring(0, 1).toUpperCase() + nome.substring(1, nome.length));
        resultado = resultado.concat(modeloReplaced);
    }

    return resultado;
};


var Extrair = function(regex, texto) {
    var results = [];
    var resultsFinal = [];
    var i = 0;
    for (var matches = regex.exec(texto); matches != null; matches = regex.exec(texto)) {
        results[i] = matches;
        for (var j = 0; j < matches.length; j++) {
            resultsFinal = resultsFinal.concat(results[i][j]);
            break;
        }
        i++;
    }

    return resultsFinal;
};
var ExtrairLinks = function(texto) {
    var re = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi ;
    return Extrair(re, texto);
};


function replaceTodos(string, token, newtoken) {
    while (string.indexOf(token) != -1) {
        string = string.replace(token, newtoken);
    }
    return string;
}
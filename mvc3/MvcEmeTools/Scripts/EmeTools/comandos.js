var executarComandos = function (texto, escripte, newLine, roboXixi) {
    var resultado = texto;
    var comandos = escripte.split(newLine);
    for (var i = 0; i < comandos.length; i++) {
        var comandoAtual = comandos[i].replace(/(\w+\s*)(\(.*?\))/gmi, "$1");
        var parametro = comandos[i].replace(/(\w+\s*)(\((.*?)\))/gmi, "$3");
        switch (comandoAtual.toLowerCase()) {
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
            case "get":
                resultado = getResultadoXixizero(parametro, roboXixi);
                break;
            case "firsttolower":
                resultado = firstToLower(resultado, newLine);
                break;
            case "firsttoupper":
                resultado = firstToUpper(resultado, newLine);
                break;
            case "tolower":
                resultado = toLower(resultado);
                break;
            case "toupper":
                resultado = toUpper(resultado);
                break;
            case "retiraracentos":
                resultado = retirarAcentos(resultado);
                break;
            default:
                break;
        }
    }
    return resultado;
};

var firstToLower = function (texto, newLine) {
    var primeiraLetra;
    var resto;
    var linha;
    var linhasResultado = [];
    var linhas = texto.split(newLine);

    for (var i = 0; i < linhas.length; i++) {
        linha = linhas[i];
        primeiraLetra = linha.replace(/^(\w)(\w+)(.*)/g, "$1").toLowerCase();
        resto = linha.replace(/^(\w)(\w+)(.*)/g, "$2$3");
        linhasResultado.push(primeiraLetra + resto);
    }
    return linhasResultado.join(newLine);
};

var firstToUpper = function (texto, newLine) {
    var primeiraLetra;
    var resto;
    var linha;
    var linhasResultado = [];
    var linhas = texto.split(newLine);
    
    for (var i = 0; i < linhas.length; i++) {
        linha = linhas[i];
        primeiraLetra = linha.replace(/^(\w)(\w+)(.*)/g, "$1").toUpperCase();
        resto = linha.replace(/^(\w)(\w+)(.*)/g, "$2$3");
        linhasResultado.push(primeiraLetra + resto);
    }
    return linhasResultado.join(newLine);
};

var toLower = function (texto) {
    return texto.toLowerCase();
};
var toUpper = function (texto) {
    return texto.toUpperCase();
};

var retirarAcentos = function (texto) {
    var com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
    var sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
    var resultado = '';
    for (var i = 0; i < texto.length; i++) {
        var indice = com_acento.indexOf(texto.substr(i, 1));
        if (indice >= 0) {
            resultado += sem_acento.substr(indice, 1);
        }
        else {
            resultado += texto.substr(i, 1);
        }
    }
    return resultado;
}

//var retirarAcentos = function (texto) {
//    var i, j, cString, varRes = "";

//    var stringAcentos = 'àâêôûãõáéíóúçüÀÂÊÔÛÃÕÁÉÍÓÚÇÜ';
//    var stringSemAcento = 'aaeouaoaeioucuAAEOUAOAEIOUCU';

//    for (i = 0; i < texto.length; i++) {
//        cString = texto.substring(i, i + 1);
//        for (j = 0; j < stringAcentos.length; j++) {
//            if (stringAcentos.substring(j, j + 1) == cString) {
//                cString = stringSemAcento.substring(j, j + 1);
//            }
//        }
//        varRes += cString;
//    }
//    return varRes;
//}  

var trim = function (texto) {
    return texto.replace(/^\s\s*/gm, '').replace(/\s\s*$/gm, ''); ;
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
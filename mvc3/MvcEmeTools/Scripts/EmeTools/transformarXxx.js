var transformarXxx = function (texto, escripte, newLine, roboXixi) {
    var possuiXxxNumerado = escripte.replace(/(xxx-?\d)/gi, "$1").length > 0;
    var regexSeparaXxx = new RegExp("xxx(-?\\d+)", "gi");
    var escriptesTemplates = [];
    var linhasTemplatesXxx;

    //Caso seja Xxx com NUMERO
    if (possuiXxxNumerado) {
        // Primeira Vez monta o escripte para cada linha do primeiro dado
        // A primeira vez só cria as linhas de templates a partir da repetição do escripte
        for (var matches = regexSeparaXxx.exec(escripte);
             matches != null;) {
            // Pega o dado transformado
            var linhasDados = obterResultadoXixizero(parseInt(matches[1]), roboXixi, newLine);

            for (var a = 0; a < linhasDados.length; a++) {
                escriptesTemplates.push(escripte);
            }
            break;
        }

        regexSeparaXxx = new RegExp("xxx(-?\\d+)", "gi");
        var listaXxx = [];

        // Busca todos os Xxxs que existem
        for (matches = regexSeparaXxx.exec(escriptesTemplates[0]);
             matches != null;
             matches = regexSeparaXxx.exec(escriptesTemplates[0])) {
            listaXxx.push(matches[0]);
        }
        listaXxx = _.uniq(listaXxx);

        var xxxRegex;
        var xxxCasado;

        // Agora ocorre a substituição
        for (var j = 0; j < listaXxx.length; j++) {
            // Pega o dado transformado
            xxxCasado = listaXxx[j];
            //obtem o indice do xixizero
            var indiceXxx = obterIndiceXxx(xxxCasado);
            // Faz nova regexp para substituir tudo
            xxxRegex = new RegExp(xxxCasado, "gm");
            // Dado Atual da Linha Atual
            linhasDados = obterResultadoXixizero(indiceXxx, roboXixi, newLine);
            for (var k = 0; k < linhasDados.length; k++) {
                escriptesTemplates[k] = escriptesTemplates[k].replace(xxxRegex, linhasDados[k]);
            }
        }
    }
    return escriptesTemplates.join(newLine);
};

var obterIndiceXxx = function (xxxCasado) {
    var indiceXxx = -99;
    var matchesXxx = /xxx(-?\d+)/gi.exec(xxxCasado);
    if (matchesXxx != null) {
        indiceXxx = matchesXxx[1].toString();
    }
    return parseInt(indiceXxx);
};


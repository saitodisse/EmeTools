var transformarXxx = function (texto, escripte, newLine, roboXixi) {
    var possuiXxxNumerado = escripte.replace(/(xxx-?\d)/gi, "$1").length > 0;
    var regex = new RegExp("xxx(-?\\d)", "gi");
    var resultadoParcial = "";
    var linhasTemplatesXxx;

    //Caso seja Xxx com NUMERO
    if (possuiXxxNumerado) {
        //Primeira Vez monta o escripte para cada linha do primeiro dado


        // A primeira vez só cria as linhas de templates a partir da repetição do escripte
        for (var matches = regex.exec(escripte); matches != null; matches = regex.exec(escripte)) {
            // Pega o dado transformado
            var linhasDados = obterResultadoXixizero(matches, roboXixi, newLine);

            for (var a = 0; a < linhasDados.length; a++) {
                resultadoParcial += escripte;
                // se não for a última linha, coloca newLine
                if (a != linhasDados.length - 1) {
                    resultadoParcial += newLine;
                }
            }
            break;
        }

        regex = new RegExp("xxx(-?\\d)", "gi");

        var xxxRegex;
        var xxxCasado;

        linhasTemplatesXxx = resultadoParcial.split(newLine);

        // Agora ocorre a substituição
        for (matches = regex.exec(resultadoParcial); matches != null; matches = regex.exec(resultadoParcial)) {
            // quebras as linhas do template

            // Pega o dado transformado
            xxxCasado = matches[0];
            // Faz nova regexp para substituir tudo
            xxxRegex = new RegExp(xxxCasado, "gi");
            // Dado Atual da Linha Atual
            linhasDados = obterResultadoXixizero(matches, roboXixi, newLine);
            for (var i = 0; i < linhasDados.length; i++) {
                linhasTemplatesXxx[i] = linhasTemplatesXxx[i].replace(xxxRegex, linhasDados[i]);
            }
        }
    }
    resultadoParcial = linhasTemplatesXxx.join(newLine);
    return resultadoParcial;
};

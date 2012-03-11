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
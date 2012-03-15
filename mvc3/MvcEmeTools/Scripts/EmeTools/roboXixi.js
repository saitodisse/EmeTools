var RoboXixi = function (texto, newLine) {
    this.Texto = texto;
    this.DadosIniciais = "";
    this.ResultadoFinal = "";
    this.Xixizeros = [];
    var listaLinhas = this.Texto.split(newLine);
    var escripte = "";

    this.iniciar = function () {
        var comandoAnterior = "";
        var comandoUltimo = "";

        //ACHA SEPARADORES
        for (var i = 0; i < listaLinhas.length; i++) {
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

    this.transformar = function () {
        // realiza cada transformação
        var transformacaoAcumulada = this.DadosIniciais;
        for (var j = 0; j < this.Xixizeros.length; j++) {
            var xixizero = this.Xixizeros[j];
            xixizero.transformar(transformacaoAcumulada, this);
            xixizero.Indice = j;
            transformacaoAcumulada = xixizero.DadoTransformado;
        }
        this.ResultadoFinal = transformacaoAcumulada;
    };

    this.get = function (par) {
        if (_.isNaN(parseInt(par))) {
            return this.buscarXixizeroPorAlias(par).DadoTransformado;
        }
        else {
            var indice = parseInt(par);
            if (indice === -1) {
                return this.DadosIniciais;
            }
            return this.Xixizeros[indice].DadoTransformado;
        }
    };

    // busca xixizero com comentário do tipo [["algum alias"]]
    this.buscarXixizeroPorAlias = function (alias) {
        var indice;
        for (var i = 0; i < this.Xixizeros.length; i++) {
            var xixizeroAtual = this.Xixizeros[i];
            var comentarios = buscarTodasOcorrenciasRegex(/^#\s*\[\[(.+)\]\]/gm, xixizeroAtual.Escripte, 1);
            var achado = _.find(comentarios, function (coment) {
                return (coment === alias);
            });

            if (!_.isUndefined(achado)) {
                indice = i;
                break;
            }
        }
        return this.Xixizeros[indice];
    };

    var buscarTodasOcorrenciasRegex = function (regex, escText, grupo) {
        var listaAchados = [];
        var indiceGrupoRegex = 0;
        if (!_.isUndefined(grupo)) {
            indiceGrupoRegex = grupo;
        }
        for (var matches = regex.exec(escText); matches != null; matches = regex.exec(escText)) {
            listaAchados.push(matches[indiceGrupoRegex]);
        }
        return listaAchados;
    };

    //main
    this.iniciar();
};
var SHOW_ALERT_ON_ERRORS = false;

function disparaErro(name, message) {
    var err = new Error();
    err.name = name;
    err.message = message;
    if (SHOW_ALERT_ON_ERRORS) {
        var sMesssage = ''
        sMesssage += '--------\n';
        sMesssage += 'ERROR:\n';
        sMesssage += '--------\n\n';
        sMesssage += err.name + '\n';
        sMesssage += '---------------------------------------------\n';
        sMesssage += err.message;
        alert(sMesssage);
    } else{
 	   throw err;
	}
}  

//Exceptions
function ComandoNaoInformado() {
    return "O comando do '///' deve ser informado logo apos o '///'";
};

var Xixizero = function(escripti, comando, newLine) {
    this.DadoTrasformado = "";
    this.Comando = comando;
    this.Escripti = escripti;

    this.transformar = function(texto) {
        // XXX: substitui 'xxx' por Escript
        if (this.Comando === "x") {
            this.DadoTrasformado = replaceTodos(this.Escripti, "xxx", texto);
        }
        // SED: executa comando SED
        if (this.Comando === "s") {
            this.DadoTrasformado = sedJsed(
                texto,
                this.Escripti,
                true,
                false,
                10000);
        }
        return this.DadoTrasformado;
    };
};

var RoboXixi = function (texto, newLine) {
    this.Texto = texto;
    this.DadosIniciais = "";
    this.Xixizeros = [];
    var listaLinhas = this.Texto.split(newLine);
    var escripti = "";
    var i;

    this.Iniciar = function () {
        var comandoAnterior = "";
        var comandoUltimo = "";

        //ACHA SEPARADORES
        for (i = 0; i < listaLinhas.length; i++) {
            var dadosPreenchidos = (this.DadosIniciais.length > 0);
            var linhaSeparador = (listaLinhas[i].toString().substring(0, 3) === '///');
            var templatePossuiLinha = (escripti.length > 0);
            var ultimaLinha = (i === listaLinhas.length - 1);

            // define o comando atual (x,s)
            if (linhaSeparador || ultimaLinha) {
                comandoAnterior = comandoUltimo;
                if (!ultimaLinha) {
                    // comando não informado dispara erro
                    if (listaLinhas[i].length < 4) {
                        disparaErro(
                            'RoboXixi.Iniciar() -> ComandoNaoInformado',
                            'A linha [' + (i + 1) + '] possui o separador "///" porem nao foi informado o comando.\nComandos disponiveis: "x" ou "s".\nEx: "///x" ou "///s"');
                    }

                    comandoUltimo = listaLinhas[i].toString().substring(3, 4);
                }
            }

            // acrescenta linha no template atual
            if (dadosPreenchidos && !linhaSeparador) {
                if (escripti.length > 0) {
                    escripti += newLine;
                }
                escripti += listaLinhas[i];
            }

            // acrescenta nova linha antes do próximo separador
            else if (dadosPreenchidos && linhaSeparador) {
                //escripti += newLine;
            }

            //achou um separador ou final
            if (linhaSeparador || ultimaLinha) {
                // guarda os dados se for o primeiro separador
                if (!dadosPreenchidos) {
                    this.DadosIniciais = listaLinhas.slice(0, i).join(newLine);
                    continue;
                }

                // template finalizado, acrescenta na lista templates
                if (templatePossuiLinha || ultimaLinha) {
                    this.Xixizeros.push(new Xixizero(escripti, comandoAnterior, newLine));
                    escripti = ""; //reseta templateAtual
                }
            }
        }
    };

    this.Transformar = function () {
        var resultadoFinal = this.DadosIniciais;
        for (var j = 0; j < this.Xixizeros.length; j++) {
            var xixizero = this.Xixizeros[j];
            resultadoFinal = xixizero.transformar(resultadoFinal);
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
var sedJsed = function(texto, sedScript, nFlag, posixFlag, jumpMax) {
    o = "";
    sed.nflag = nFlag;
    sed.pflag = posixFlag;
    sed.jumpmax = jumpMax;
    sed.out = out;
    sed.err = err;
    sed(sedScript, texto);
    return o;
};
var SHOW_ALERT_ON_ERRORS = false;

$.ctrl = function (key, callback, args) {
    var isCtrl = false;
    $(document).keydown(function (e) {
        if (!args) args = []; // IE barks when args is null

        if (e.ctrlKey) isCtrl = true;
        if (e.keyCode == key && isCtrl) {
            callback.apply(this, args);
            e.preventDefault();
            return false;
        }
    }).keyup(function (e) {
        if (e.ctrlKey) isCtrl = false;
    });
};

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
    } else{
 	   throw err;
	}
}  

//Exceptions
function ComandoNaoInformado() {
    return "O comando do '///' deve ser informado logo apos o '///'";
};

var Xixizero = function (escripte, comando, newLine) {
    this.DadoTransformado = "";
    this.Comando = comando;
    this.Escripte = escripte;
    this.Indice = -1;

    this.PrimeiroComentario = function () {
        var re = /#.*/gi;
        var m = re.exec(this.Escripte);
        if (m !== null) {
            return m[0].substring(1);
        }
        return escripte;
    };

    this.transformar = function (texto) {
        // (T)emplate: substitui 'xxx' por Escript
        if (this.Comando === "t") {
            var ultimaLetra = texto.substring(texto.length - 1, texto.length);
            if (ultimaLetra === newLine) {
                texto = texto.substring(0, texto.length - newLine.length);
            }
            this.DadoTransformado = replaceTodos(this.Escripte, "xxx", texto);
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
    };
};

var RoboXixi = function (texto, newLine) {
    this.Texto = texto;
    this.DadosIniciais = "";
    this.ResultadoFinal = "";
    this.Xixizeros = [];
    var listaLinhas = this.Texto.split(newLine);
    var escripte = "";
    var i;

    this.Iniciar = function () {
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
                            'RoboXixi.Iniciar() -> ComandoNaoInformado',
                            'A linha [' + (i + 1) + '] possui o separador "///" porem nao foi informado o comando.\nComandos disponiveis: "x" ou "s".\nEx: "///t" ou "///s"');
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
            }
            else if (dadosPreenchidos && linhaSeparador) {
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

    this.Transformar = function (indiceDeParada) {
        var indiceUltimoXixizero = this.Xixizeros.length - 1;
        if (indiceDeParada !== undefined) {
            // Define indice final
            indiceUltimoXixizero = indiceDeParada-1;
        }

        // realiza cada transformação
        var transformacaoAcumulada = this.DadosIniciais;
        for (var j = 0; j <= indiceUltimoXixizero; j++) {
            var xixizero = this.Xixizeros[j];
            xixizero.transformar(transformacaoAcumulada);
            xixizero.Indice = j+1;
            transformacaoAcumulada = xixizero.DadoTransformado;
        }
        this.ResultadoFinal = transformacaoAcumulada;
    };

    //main
    this.Iniciar();
};


function Obter_replacer_e_substitutor(escripte, newLine) {
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

    var inicioSubstituitor = indiceDaBarra + newLine.length*2;
    
    var substitutor = escripte.substring(inicioSubstituitor, escripte.length);

    return {   replacer : replacer,
            substitutor : substitutor};
}

function substituirCustomizado(escripte, texto, newLine){
    var objReplacer = Obter_replacer_e_substitutor(escripte, newLine);
    
    //realiza a substituicao no texto
    return replaceTodos(texto, objReplacer.replacer, objReplacer.substitutor);
}

function replaceTodos(texto, de, para) {
    return texto.replace(new RegExp(de, "gmi"), para);
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
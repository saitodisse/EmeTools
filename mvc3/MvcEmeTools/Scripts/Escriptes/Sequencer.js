var buscarTextoViaAjax = function (primeiraVez) {
    var request = $.ajax({
        type: "GET",
        url: "../PorId/" + window.idSha1
    });

    request.done(function (data) {
        carregarRobo(data, primeiraVez);
    });

    request.fail(function (jqXHR, textStatus) {
        exibirMensagemUi("Request failed", textStatus);
    });
};

$("#btnRefresh").click(function () {
    buscarTextoViaAjax(false);
});

var carregarRobo = function (texto, primeiraVez) {
    $("#listaXixizeros").html("");

    /////////////////////////////
    // executa transformação
    /////////////////////////////
    var roboXixi = new RoboXixi(texto, '\n');
    roboXixi.transformar();

    ///////////////////////////
    // cria a lista dos passos
    //////////////////////////
    for (var i = 0; i < roboXixi.Xixizeros.length; i++) {
        var xixizero = roboXixi.Xixizeros[i];
        $("#listaXixizeros").append("<li>[" + i + "]: " + xixizero.primeiroComentario() + "</li>");
    }

    $("#listaXixizeros").append("<li>[" + roboXixi.Xixizeros.length + "]: RESULTADO FINAL </li>");

    selecionarEtapa($("#listaXixizeros li:last-child"), roboXixi);

    //////////////////////////////
    // Executa toda transformação
    /////////////////////////////
    $("#preResposta").html(encodeHtml(roboXixi.ResultadoFinal));


    if (primeiraVez) {
        var prepararCopy = function () {
            $("#preEscripteCompleto").val(xixizeroParaCopia());
            $("#preEscripteCompleto")[0].focus();
            $("#preEscripteCompleto")[0].select();

            $("#spanCopyLink").text('OK! Copiado!');

            var timeout;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                $("#spanCopyLink").text('Pressione CTRL + C para copiar');
            }, 2000);
        };

        //////////////////////////////////////////////////////////
        // KEY-BINDS:
        //////////////////////////////////////////////////////////
        window.onkeydown = function (evt) {
            evt = evt || window.event;
            // CTRL + CIMA
            if (evt.ctrlKey && evt.keyCode === 38) {
                var anterior = $(".selecionado").prev();
                if (anterior.length === 0)
                    return false;
                selecionarEtapa(anterior, roboXixi);
                return false;
            }
            // CTRL + BAXO
            if (evt.ctrlKey && evt.keyCode === 40) {
                var proximo = $(".selecionado").next();
                if (proximo.length === 0)
                    return false;
                selecionarEtapa(proximo, roboXixi);
                return false;
            }
            // CTRL + C
            if (evt.ctrlKey && evt.keyCode === "C".charCodeAt(0)) {
                prepararCopy();
            }
        };

        $("#spanCopyLink").click(prepararCopy);



        // Ativa botão para copiar para o clipboard
        var xixizeroParaCopia = function () {
            // pega o indice
            var indiceSelecionado = parseInt($(".selecionado").html().replace(/^\[([-\d]+)\].*/, "$1"));

            // DadosIniciais
            if (indiceSelecionado === -1)
                return roboXixi.DadosIniciais;

            // ResultadoFinal
            if (indiceSelecionado === roboXixi.Xixizeros.length)
                return roboXixi.ResultadoFinal;

            // xixizeros intermediários
            var dadosAntesTransformacao;

            if (indiceSelecionado == 0) {
                dadosAntesTransformacao = roboXixi.DadosIniciais;
            } else {
                // pega o dado anterior
                dadosAntesTransformacao = roboXixi.Xixizeros[indiceSelecionado - 1].DadoTransformado;
            }

            dadosAntesTransformacao = decodeHtml(dadosAntesTransformacao);

            var resultado = dadosAntesTransformacao + "\n";
            // pega o escript atual
            var xixizeroProximo = roboXixi.Xixizeros[indiceSelecionado];
            resultado += "///" + xixizeroProximo.Comando + "\n";
            resultado += xixizeroProximo.Escripte + "\n";
            return resultado;
        };
    }

    //////////////////////////////////////////////////////////
    // coloca evento para mudar a visualização dos resultados
    //////////////////////////////////////////////////////////
    $("#listaXixizeros li").click(function () {
        selecionarEtapa($(this), roboXixi);
    });


    return roboXixi;
};

$().ready(function () {
    buscarTextoViaAjax(true);

    $("#horizontalSplitter").kendoSplitter();
    $("#verticalSplitter").kendoSplitter({ orientation: "vertical" });
});

var replace_show_invisible = function (texto) {
    texto = texto.replace(/^(\/\/\/\w)$/gm, "<span class='comando'>$1</span>");
    texto = texto.replace(/^\/$/gm, "<span class='char_replacer_separator'>/</span>");
    texto = texto.replace(/$/gm, "<span class='char_n'>\\n</span>");
    texto = texto.replace(/\t/gm, "<span class='char_tab'>\\t</span>");
    texto = texto.replace(/^(#.*)$/gm, "<span class='comentario'>$1</span>");
    return texto;
};

var selecionarEtapa = function (elJquery, roboXixi) {
    // limpa os itens selecionados
    $("#listaXixizeros li").attr("class", "naoSelecionado");

    // seleciona o item atual
    elJquery.attr("class", "selecionado");

    // pega o indice
    var html = elJquery.html();
    var indiceSelecionado = parseInt(html.replace(/^\[([-\d]+)\].*/, "$1"));

    // recupera resultado do indice
    if (indiceSelecionado >= 0 && indiceSelecionado < roboXixi.Xixizeros.length) {
        $("#preXixizero").html(replace_show_invisible(roboXixi.Xixizeros[indiceSelecionado].escripteFormatado()));
        $("#preResposta").html(replace_show_invisible(encodeHtml(roboXixi.Xixizeros[indiceSelecionado].DadoTransformado)));
    } else if (indiceSelecionado < 0) {
        $("#preXixizero").html('');
        $("#preResposta").html(replace_show_invisible(encodeHtml(roboXixi.DadosIniciais)));
    } else if (indiceSelecionado === roboXixi.Xixizeros.length) {
        $("#preXixizero").html('');
        $("#preResposta").html(replace_show_invisible(encodeHtml(roboXixi.ResultadoFinal)));
    }
};


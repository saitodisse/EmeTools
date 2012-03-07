$().ready(function () {
    var selecionarEtapa = function (elJquery) {
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
            $("#preResposta").html(replace_show_invisible(roboXixi.Xixizeros[indiceSelecionado].DadoTransformado));
        } else if (indiceSelecionado < 0) {
            $("#preXixizero").html('');
            $("#preResposta").html(replace_show_invisible(roboXixi.DadosIniciais));
        } else if (indiceSelecionado === roboXixi.Xixizeros.length) {
            $("#preXixizero").html('');
            $("#preResposta").html(replace_show_invisible(roboXixi.ResultadoFinal));
        }
    };

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
        var dadosAntesTransformacao = '';

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

    //////////////////////////////////////////////////////////
    // KEY-BINDS:
    //////////////////////////////////////////////////////////
    // CTRL + CIMA
    $.ctrl(38, false, function () {
        var anterior = $(".selecionado").prev();
        if (anterior.length === 0)
            return false;
        selecionarEtapa(anterior);
        return false;
    });
    // CTRL + BAIXO
    $.ctrl(40, false, function () {
        var proximo = $(".selecionado").next();
        if (proximo.length === 0)
            return false;
        selecionarEtapa(proximo);
        return false;
    });
    // CTRL + C
    $.ctrl('C'.charCodeAt(0), true, prepararCopy);
    $("#spanCopyLink").click(prepararCopy);


    $("#horizontalSplitter").kendoSplitter();
    $("#verticalSplitter").kendoSplitter({ orientation: "vertical" });


    /////////////////////////////
    // executa toda transformação
    /////////////////////////////
    var texto = $("#preEscripteCompleto").html();
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

    selecionarEtapa($("#listaXixizeros li:last-child"));

    //////////////////////////////
    // Executa toda transformação
    /////////////////////////////
    $("#preResposta").html(roboXixi.ResultadoFinal);

    //////////////////////////////////////////////////////////
    // coloca evento para mudar a visualização dos resultados
    //////////////////////////////////////////////////////////
    $("#listaXixizeros li").click(function () {
        selecionarEtapa($(this));
    });

});

$.ctrl = function (key, propagate, callback, args) {
    var isCtrl = false;
    $(document).keydown(function (e) {
        if (!args) args = []; // IE barks when args is null

        if (e.ctrlKey) isCtrl = true;
        if (e.keyCode == key && isCtrl) {
            callback.apply(this, args);
            if (propagate === false) {
                e.preventDefault();
                return false;
            }
        }
    }).keyup(function (e) {
        if (e.ctrlKey) isCtrl = false;
    });
};
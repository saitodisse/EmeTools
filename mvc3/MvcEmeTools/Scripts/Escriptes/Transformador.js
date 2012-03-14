var escripteDoServidor = "";

var buscarTextoViaAjax = function () {
    var request = $.ajax({
        type: "GET",
        url: "../PorId/" + window.idSha1
    });

    request.done(function (data) {
        escripteDoServidor = data;
    });

    request.fail(function (jqXHR, textStatus) {
        exibirMensagemUi("Request failed", textStatus);
    });
};


var executarRobo = function (texto) {
    // executa transformação
    var roboXixi = new RoboXixi(escripteDoServidor, '\n');
    if (!_.isUndefined(texto)) {
        roboXixi.DadosIniciais = texto;
    }
    roboXixi.transformar();

    // Executa toda transformação
    return roboXixi.ResultadoFinal;
};

var substituirPorRespostaRoboXixi = function () {
    var resultado = executarRobo($("#textAreaDados").val());
    $("#textAreaDados").val(resultado);
};


$().ready(function () {
    $("#buttonTransformar").click(function () {
        substituirPorRespostaRoboXixi();
    });

    $("#textAreaDados").val(buscarTextoViaAjax());
});


window.onkeydown = function (evt) {
    evt = evt || window.event;
    // CTRL + ENTER
    if (evt.ctrlKey && evt.keyCode === 13) {
        substituirPorRespostaRoboXixi();
    }
};

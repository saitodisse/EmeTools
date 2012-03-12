var exibirMensagemUi = function (titulo, mensagem, autoCloseAfterMsElapsed) {
    $("#div-dialog-message").attr("title", titulo);
    $("#mensagemDialog").text(mensagem);

    if (autoCloseAfterMsElapsed !== undefined) {
        _.delay(function () { 
            $("#div-dialog-message").dialog("close");
        }, autoCloseAfterMsElapsed);
    }

    $("#div-dialog-message").dialog({
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
};
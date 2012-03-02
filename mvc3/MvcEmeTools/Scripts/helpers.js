var exibirMensagemUi = function (titulo, mensagem) {
    $("#div-dialog-message").attr("title", titulo);
    $("#mensagemDialog").text(mensagem);
    $("#div-dialog-message").dialog({
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
};

var decodeHtml = function(str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
var NEW_LINE = '\n';

var exibirMensagemUi = function(titulo, mensagem, autoCloseAfterMsElapsed) {
    noty({ "text": titulo + '<br />' + mensagem.replace(/\n/, "<br />"),
        "layout": "center",
        "type": "success",
        "textAlign": "center",
        "easing": "swing",
        "animateOpen": { "height": "toggle" },
        "animateClose": { "height": "toggle" },
        "speed": "500",
        "timeout": "1700",
        "closable": false,
        "closeOnSelfClick": true
    });
};


var editor = null;
$().ready(function () {
    // configura o editor
    editor = ace.edit("editor");
    // tamanho de fonte
    editor.setFontSize('13pt');
    // não transformar tab em espaço
    editor.getSession().setUseSoftTabs(false);
    // tab = 2 espaços
    editor.getSession().setTabSize(2);
    // mostrar invisíveis, TAB, espaca, quebra de linha...
    editor.setShowInvisibles(true);

    // modo ruby por causa dos comentários
    var rubyMode = require("ace/mode/ruby").Mode;
    var rubyInstanciado = new rubyMode();
    rubyInstanciado.$tokenizer.rules.start.splice(10, 1, { token: "comment", regex: "aaa" });
    editor.getSession().setMode(rubyInstanciado);

    //editor.getSession().getMode().$tokenizer.rules.append({token: "comment", regex: "each"});
    editor.show;

    var salvar = function () {
        var dados = {
            Nome: $("#Nome").val(),
            Descricao: $("#Descricao").val(),
            Texto: editor.getSession().getValue()
        };

        var request = $.ajax({
            type: "POST",
            data: dados
        });

        request.done(function (data) {
            if (data === "salvo") {
                exibirMensagemUi("Sucesso", "Os dados foram salvos com sucesso. Mensagem retornada: [" + data + "]");
            }
            if (data === "criado") {
                window.location.href = "../Escriptes";
            }
        });

        request.fail(function (jqXHR, textStatus) {
            exibirMensagemUi("Request failed", textStatus);
        });
    };

    $("#btnSalvar").click(salvar);
});
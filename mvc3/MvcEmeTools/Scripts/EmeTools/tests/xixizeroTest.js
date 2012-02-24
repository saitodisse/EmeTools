NEW_LINE = '\n';

$(document).ready(function () {
    test("t[emplate] sem newline", function () {
        var xixizero = new Xixizero(" - xxx", "t", "\n");
        xixizero.transformar("abc");
        var atual = xixizero.DadoTransformado;
        var esperado = " - abc";
        equal(atual, esperado);
    });

    test("t[emplate] com newline", function () {
        var xixizero = new Xixizero(" - xxx\n", "t", "\n");
        xixizero.transformar("abc");
        var atual = xixizero.DadoTransformado;
        var esperado = " - abc\n";
        equal(atual, esperado);
    });

    test("s[ed] localizar linha por endereço", function () {
        var xixizero = new Xixizero("/ef/p", "s", NEW_LINE);
        xixizero.transformar("abc\ndef");
        var atual = xixizero.DadoTransformado;
        var esperado = "def\n";
        equal(atual, esperado);
    });

    test("s[ed] substituir 'b' -> 'x' e imprimir tudo", function () {

        var escripti = "";
        escripti += "# coment" + NEW_LINE;  //   #   : ignora comentário
        escripti += "s/b/x/" + NEW_LINE;  // s///  : substitui 'b' por 'x'
        escripti += "p" + NEW_LINE;  //  'p'  : imprime todas linhas

        var xixizero = new Xixizero(escripti, "s", NEW_LINE);
        xixizero.transformar("abc\ndef");
        var atual = xixizero.DadoTransformado;
        var esperado = "axc\ndef\n";
        equal(atual, esperado);
    });

    test("obter replacer e substitutors", function () {
        var escripti = "";
        escripti += "# aqui vai a expressão regular casadora" + NEW_LINE;  //   #   : ignora comentário
        escripti += "b" + NEW_LINE;
        escripti += "/" + NEW_LINE;
        escripti += "# aqui vai o que será substituido por x" + NEW_LINE;  //   #   : ignora comentário
        escripti += "x";

        var objReplcerSubstitutor = Obter_replacer_e_substitutor(escripti, NEW_LINE);
        equal(objReplcerSubstitutor.replacer, "b");
        equal(objReplcerSubstitutor.substitutor, "x");
    });

    test("r[eplace javascript] permite fazer substuição simples", function () {

        var escripti = "";
        escripti += "# aqui vai a expressão regular casadora" + NEW_LINE;  //   #   : ignora comentário
        escripti += "b" + NEW_LINE;
        escripti += "/" + NEW_LINE;
        escripti += "# aqui vai o que será substituido por" + NEW_LINE;  //   #   : ignora comentário
        escripti += "x";

        var xixizero = new Xixizero(escripti, "r", NEW_LINE);
        xixizero.transformar("abc\ndef");
        var atual = xixizero.DadoTransformado;
        var esperado = "axc\ndef";
        equal(atual, esperado);
    });
});
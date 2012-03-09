NEW_LINE = '\n';

$(document).ready(function () {
    test("t[emplate] sem newline", function () {
        var xixizero = new Xixizero(" - <%= linhas %>", "t", "\n");
        xixizero.transformar("abc");
        var atual = xixizero.DadoTransformado;
        var esperado = " - abc";
        equal(atual, esperado);
    });

    test("t[emplate] com newline", function () {
        var xixizero = new Xixizero(" - <%= linhas %>\n", "t", "\n");
        xixizero.transformar("abc");
        var atual = xixizero.DadoTransformado;
        var esperado = " - abc\n";
        equal(atual, esperado);
    });
    test("t[emplate] com lista", function () {
        var escripte = "";
        escripte += '<% _.each(linhas, function(linha) { %>-> <%= linha %>\n<% }); %>';

        var xixizero = new Xixizero(escripte, "t", "\n");

        var dados = "";
        dados += "abc1" + NEW_LINE;
        dados += "abc2" + NEW_LINE;
        dados += "abc3";

        var esperado = "";
        esperado += "-> abc1" + NEW_LINE;
        esperado += "-> abc2" + NEW_LINE;
        esperado += "-> abc3" + NEW_LINE;

        xixizero.transformar(dados);
        var atual = xixizero.DadoTransformado;
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

        var escripte = "";
        escripte += "# coment" + NEW_LINE;  //   #   : ignora comentário
        escripte += "s/b/x/" + NEW_LINE;  // s///  : substitui 'b' por 'x'
        escripte += "p" + NEW_LINE;  //  'p'  : imprime todas linhas

        var xixizero = new Xixizero(escripte, "s", NEW_LINE);
        xixizero.transformar("abc\ndef");
        var atual = xixizero.DadoTransformado;
        var esperado = "axc\ndef\n";
        equal(atual, esperado);
    });

    test("obter replacer e substitutors", function () {
        var escripte = "";
        escripte += "# aqui vai a expressão regular casadora" + NEW_LINE;  //   #   : ignora comentário
        escripte += "b" + NEW_LINE;
        escripte += "/" + NEW_LINE;
        escripte += "# aqui vai o que será substituido por x" + NEW_LINE;  //   #   : ignora comentário
        escripte += "x";

        var objReplcerSubstitutor = obter_replacer_e_substitutor(escripte, NEW_LINE);
        equal(objReplcerSubstitutor.replacer, "b");
        equal(objReplcerSubstitutor.substitutor, "x");
    });

    test("r[eplace javascript] permite fazer substuição simples", function () {

        var escripte = "";
        escripte += "# aqui vai a expressão regular casadora" + NEW_LINE;  //   #   : ignora comentário
        escripte += "b" + NEW_LINE;
        escripte += "/" + NEW_LINE;
        escripte += "# aqui vai o que será substituido por" + NEW_LINE;  //   #   : ignora comentário
        escripte += "x";

        var xixizero = new Xixizero(escripte, "r", NEW_LINE);
        xixizero.transformar("abc\ndef");
        var atual = xixizero.DadoTransformado;
        var esperado = "axc\ndef";
        equal(atual, esperado);
    });

    test("replace classico", function () {
        var expected = ".\n.\n.";
        notEqual("aaa\nbbb\nccc".replace(/.*/gm, "."), expected, "/.*/gm");
        equal("aaa\nbbb\nccc".replace(/^.*/gm, "."), expected, "/^.*/gm");
        notEqual("aaa\nbbb\nccc".replace(/.*$/gm, "."), expected, "/.*$/gm");
        equal("aaa\nbbb\nccc".replace(/.+/gm, "."), expected, "/.+/gm");
    });

    test("r[eplace] aceita \\n, \\t, \\[0-9] no substituitor", function () {

        var dados = "";
        dados += "aaa" + NEW_LINE;
        dados += "bbb" + NEW_LINE;
        dados += "ccc";

        var escripte = "";
        escripte += "(.+)" + NEW_LINE;
        escripte += "/" + NEW_LINE;
        escripte += "\\t\\1";

        var esperado = "";
        esperado += "\taaa" + NEW_LINE;
        esperado += "\tbbb" + NEW_LINE;
        esperado += "\tccc";

        var xixizero = new Xixizero(escripte, "r", NEW_LINE);
        xixizero.transformar(dados);
        var atual = xixizero.DadoTransformado;
        equal(atual, esperado);
    });

    test("c[omando] SORT", function () {
        var xixizero = new Xixizero("sort", "c", "\n");

        var dados = "";
        dados += "dado\n";
        dados += "bala\n";
        dados += "abacate\n";
        dados += "casa";

        var esperado = "";
        esperado += "abacate\n";
        esperado += "bala\n";
        esperado += "casa\n";
        esperado += "dado";

        xixizero.transformar(dados);
        var atual = xixizero.DadoTransformado;
        equal(atual, esperado);
    });

    test("c[omando] SORT DESC", function () {
        var xixizero = new Xixizero("sort desc", "c", "\n");

        var dados = "";
        dados += "dado\n";
        dados += "bala\n";
        dados += "abacate\n";
        dados += "casa";

        var esperado = "";
        esperado += "dado\n";
        esperado += "casa\n";
        esperado += "bala\n";
        esperado += "abacate";

        xixizero.transformar(dados);
        var atual = xixizero.DadoTransformado;
        equal(atual, esperado);
    });

    test("c[omando] DISTINCT", function () {
        var xixizero = new Xixizero("distinct", "c", "\n");

        var dados = "";
        dados += "dado\n";
        dados += "bala\n";
        dados += "bala\n";
        dados += "abacate\n";
        dados += "casa";

        var esperado = "";
        esperado += "dado\n";
        esperado += "bala\n";
        esperado += "abacate\n";
        esperado += "casa";

        xixizero.transformar(dados);
        var atual = xixizero.DadoTransformado;
        equal(atual, esperado);
    });

    test("c[omando] TRIM", function () {
        var xixizero = new Xixizero("trim", "c", "\n");

        var dados = "";
        dados += "   dado   \n";
        dados += "bala   \n";
        dados += "   abacate";

        var esperado = "";
        esperado += "dado\n";
        esperado += "bala\n";
        esperado += "abacate";

        xixizero.transformar(dados);
        var atual = xixizero.DadoTransformado;
        equal(atual, esperado);
    });

    test("c[omando] TRIM LINES", function () {
        var xixizero = new Xixizero("trim lines", "c", "\n");

        var dados = "";
        dados += "\n\ndado\n\n";
        dados += "bala\n";
        dados += "abacate\n\n";

        var esperado = "";
        esperado += "dado\n";
        esperado += "bala\n";
        esperado += "abacate";

        xixizero.transformar(dados);
        var atual = xixizero.DadoTransformado;
        equal(atual, esperado);
    });

    test("c[omando] firstToLower", function () {
        var xixizero = new Xixizero("firstToLower", "c", "\n");

        var dados = "";
        dados += "ABC\n";
        dados += "Abc";

        var esperado = "";
        esperado += "aBC\n";
        esperado += "abc";

        xixizero.transformar(dados);
        var atual = xixizero.DadoTransformado;
        equal(atual, esperado);
    });

    test("c[omando] firstToUpper", function () {
        var xixizero = new Xixizero("firstToUpper", "c", "\n");

        var dados = "";
        dados += "abc\n";
        dados += "aBC";

        var esperado = "";
        esperado += "Abc\n";
        esperado += "ABC";

        xixizero.transformar(dados);
        var atual = xixizero.DadoTransformado;
        equal(atual, esperado);
    });
});
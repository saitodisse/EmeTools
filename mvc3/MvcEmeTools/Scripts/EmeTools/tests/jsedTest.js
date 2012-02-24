NEW_LINE = '\n';

$(document).ready(function () {
    test("SED: 'p' com 'n'", function () {
        var texto = "";
        texto += "abc\n";
        texto += "def";

        var sedScript = "";
        sedScript += "/ef/p";

        var resultadoEsperado = "";
        resultadoEsperado += "def\n";

        var resultado = sedJsed(
            texto,
            sedScript,
            true,
            false,
            10000);

        equal(resultado, resultadoEsperado, "deve buscar a linha que possui def");
    });

    test("SED: foo para bar", function () {
        var texto = "";
        texto += "foo foo fo oo f oo\n";
        texto += "foo foo foo foo foo foo foo foo foo foo foo foo foo";

        var sedScript = "";
        sedScript += "s/foo/bar/g" + NEW_LINE;
        sedScript += "p";

        var resultadoEsperado = "";
        resultadoEsperado += "bar bar fo oo f oo\n";
        resultadoEsperado += "bar bar bar bar bar bar bar bar bar bar bar bar bar\n";

        var resultado = sedJsed(
            texto,
            sedScript,
            true,
            false,
            10000);

        equal(resultado, resultadoEsperado, "deve buscar a linha que possui def");
    });

    test("SED: ^Rx:   abc,   [[:alpha:]]+", function () {
        naoDeveCasar("abc", "[[:alpha:]]+"); //é necessário escapar o "+"
    });
    test("SED: Rx: abc,   [[:alpha:]][[:alpha:]]*", function () {
        deveCasar("abc", "[[:alpha:]][[:alpha:]]*"); //NÃO se deve escapar o "*"
    });
    test("SED: ^Rx:   abc,   [[:alpha:]][[:alpha:]]\\*", function () {
        naoDeveCasar("abc", "[[:alpha:]][[:alpha:]]\\*"); //NÃO se pode escapar o "*"
    });
    test("SED: Rx: abc,   [[:alpha:]]\\+", function () {
        deveCasar("abc", "[[:alpha:]]\\+");
    });
    test("SED: Rx: ABC,   [[:alpha:]]\\+", function () {
        deveCasar("ABC", "[[:alpha:]]\\+");
    });
    test("SED: ^Rx:   abc,   \\w\\+", function () {
        naoDeveCasar("abc", "\\w\\+"); // infelizmente o SED não possui os apelidos para POSIX
    });
    test("SED: ^Rx:   áéí,   [[:alpha:]]\\+", function () {
        naoDeveCasar("áéí", "[[:alpha:]]\\+"); // a classe POSIX não casa acentos, que pena
    });
    test("SED: Rx: áéí,   [a-zàáâãéêíóôõúüç]\\+", function () {
        deveCasar("áéí", "[a-zàáâãéêíóôõúüç]\\+"); // é necessário informar manualmente
    });
    test("SED: ^Rx:   AAA,   [a]\\+", function () {
        naoDeveCasar("AAA", "[a]\\+"); // é case sensitive e NÃO tem o modificador ignore case (já testei)
    });
    test("SED: Rx: áÉÍ,   [a-zàáâãéêíóôõúüçA-ZÀÁÂÃÉÊÍÓÔÕÚÜÇ]\\+", function () {
        deveCasar("áÉÍ", "[a-zàáâãéêíóôõúüçA-ZÀÁÂÃÉÊÍÓÔÕÚÜÇ]\\+"); // fica grande, mas é o jeito
    });
    test("SED: Rx: áÉÍ12_EF,   [0-9_a-zàáâãéêíóôõúüçA-ZÀÁÂÃÉÊÍÓÔÕÚÜÇ]\\+", function () {
        deveCasar("áÉÍ12_EF", "[0-9_a-zàáâãéêíóôõúüçA-ZÀÁÂÃÉÊÍÓÔÕÚÜÇ]\\+"); // emulando o \w
    });

    var deveCasar = function (texto, regex) {
        var textoComNewLine = texto + NEW_LINE;
        var sedScript = "s/^\\(" + regex + "\\)$/\\1/p" + "\n";
        var resultadoEsperado = textoComNewLine;
        var resultado = sedJsed(textoComNewLine, sedScript, true, false, 10000);
        equal(resultado, resultadoEsperado, "a regex " + regex + " não casou com [" + texto + "]");
    };

    var naoDeveCasar = function (texto, regex) {
        var textoComNewLine = texto + NEW_LINE;
        var sedScript = "s/" + regex + "/\\1/gp" + NEW_LINE;
        var resultadoEsperado = textoComNewLine;
        var resultado = sedJsed(textoComNewLine, sedScript, true, false, 10000);
        notEqual(resultado, resultadoEsperado, "a regex " + regex + " não deveria casar com " + texto + "]");
    };
});
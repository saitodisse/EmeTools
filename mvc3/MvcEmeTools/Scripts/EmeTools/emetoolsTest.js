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
        sedScript += "s/foo/bar/g" + "\n";
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
        var textoComNewLine = texto + "\n";
        var sedScript = "s/^\\(" + regex + "\\)$/\\1/p" + "\n";
        var resultadoEsperado = textoComNewLine;
        var resultado = sedJsed(textoComNewLine, sedScript, true, false, 10000);
        equal(resultado, resultadoEsperado, "a regex " + regex + " não casou com [" + texto + "]");
    };

    var naoDeveCasar = function (texto, regex) {
        var textoComNewLine = texto + "\n";
        var sedScript = "s/^\\(" + regex + "\\)$/\\1/p" + "\n";
        var resultadoEsperado = textoComNewLine;
        var resultado = sedJsed(textoComNewLine, sedScript, true, false, 10000);
        notEqual(resultado, resultadoEsperado, "a regex " + regex + " não deveria casar com " + texto + "]");
    };

    test("x[xx] sem newline", function () {
        var xixizero = new Xixizero(" - xxx", "x", "\n");
        var atual = xixizero.transformar("abc");
        var esperado = " - abc";
        equal(atual, esperado);
    });

    test("x[xx] com newline", function () {
        var xixizero = new Xixizero(" - xxx\n", "x", "\n");
        var atual = xixizero.transformar("abc");
        var esperado = " - abc\n";
        equal(atual, esperado);
    });

    test("s[ed] localizar linha por endereço", function () {
        var xixizero = new Xixizero("/ef/p", "s", "\n");
        var atual = xixizero.transformar("abc\ndef");
        var esperado = "def\n";
        equal(atual, esperado);
    });

    test("s[ed] substituir 'b' -> 'x' e imprimir tudo", function () {

        var escripti = "";
        escripti += "# coment" + "\n";  //   #   : ignora comentário
        escripti += "s/b/x/" + "\n";  // s///  : substitui 'b' por 'x'
        escripti += "p" + "\n";  //  'p'  : imprime todas linhas

        var xixizero = new Xixizero(escripti, "s", "\n");
        var atual = xixizero.transformar("abc\ndef");
        var esperado = "axc\ndef\n";
        equal(atual, esperado);
    });

    test("RoboXixi cria Xixizeros", function () {

        var texto = "";
        texto += "abc\n";
        texto += "///x\n"; //COMANDO X
        texto += "[xxx]\n";
        texto += "///s\n"; //COMANDO S
        texto += "s/b/\(b\)/";

        var roboXixi = new RoboXixi(texto, '\n');
        var xixireros = roboXixi.Xixizeros;

        equal(xixireros[0].Escripti, "[xxx]");
        equal(xixireros[0].Comando, "x");

        equal(xixireros[1].Escripti, "s/b/\(b\)/");
        equal(xixireros[1].Comando, "s");
    });

    test("RoboXixi lança excessão caso não seja informado o comando", function () {

        var texto = "";
        texto += "abc\n";
        texto += "///\n"; //COMANDO DESCONHECIDO
        texto += "[xxx]\n";

        try {
            // chama o construtor
            var foo = new RoboXixi(texto, '\n');
            ok(false, 'ComandoNaoInformado não foi disparado');
        } catch (ex) {
            // deve lançar excessão
            equal(ex.name, "RoboXixi.Iniciar() -> ComandoNaoInformado", "nome da excessão não bate com ComandoNaoInformado");
        }
    });


    test("RoboXixi.Transformar() 's' e 'x'", function () {

        var texto = "";
        texto += "aaa\n";
        texto += "bbb\n";
        texto += "ccc\n";
        texto += "///s\n";
        texto += "s/bbb/xxx/\n";
        texto += "p\n";
        texto += "///x\n";
        texto += "*xxx*";

        var roboXixi = new RoboXixi(texto, '\n');

        var resultadoEsperado = "";
        resultadoEsperado += "*aaa\n";
        resultadoEsperado += "xxx\n";
        resultadoEsperado += "ccc\n*";

        equal(roboXixi.Transformar(), resultadoEsperado, "roboXixi.Transformar()");
    });

});
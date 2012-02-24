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

    test("RoboXixi cria Xixizeros", function () {

        var texto = "";
        texto += "abc\n";
        texto += "///t\n"; //COMANDO X
        texto += "[xxx]\n";
        texto += "///s\n"; //COMANDO S
        texto += "s/b/\(b\)/\n";
        texto += "///r\n"; //COMANDO R
        texto += "a\n/\nb\n";

        var roboXixi = new RoboXixi(texto, '\n');
        var xixireros = roboXixi.Xixizeros;

        equal(xixireros[0].Escripte, "[xxx]");
        equal(xixireros[0].Comando, "t");

        equal(xixireros[1].Escripte, "s/b/\(b\)/");
        equal(xixireros[1].Comando, "s");

        equal(xixireros[2].Escripte, "a\n/\nb");
        equal(xixireros[2].Comando, "r");
    });

    test("r[eplace javascript] caso 1 do Itau -> moneylog com \\n", function () {
        var NEW_LINE = "\n";
        var texto = "";
        texto += "06/02 			SALDO ANTERIOR 				15,70 	" + NEW_LINE;
        texto += "08/02 			SISDEB NET SP 		49 	- 		" + NEW_LINE;
        texto += "08/02 			S A L D O 				15,21 	" + NEW_LINE;
        texto += "10/02 	D 		INT PAG TIT BANCO 237 		42 	- 		" + NEW_LINE;
        texto += "10/02 			S A L D O 				14,79 	" + NEW_LINE;
        texto += "13/02 			SISPAG SULAMERICA SEG S 	911 	68 			" + NEW_LINE;
        texto += "13/02 			S A L D O 				14,47 	" + NEW_LINE;
        texto += "15/02 	D 		INT PAG TIT BANCO 237 		1,36 	- 		" + NEW_LINE;
        texto += "15/02 			S A L D O 				13,11 	" + NEW_LINE;
        texto += "17/02 			ELETROPAULO 1000652491 		34 	- 		" + NEW_LINE;
        texto += "17/02 			S A L D O 				13,77 	" + NEW_LINE;
        texto += "22/02 			REMUNERACAO/SALARIO 		1,78 			" + NEW_LINE;
        texto += "22/02 	D 		DOC INT 953354 julio 	4175 	00 	- 		" + NEW_LINE;
        texto += "22/02 			S A L D O 				14,55 " + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "# retira os tabs com D no meio" + NEW_LINE;
        texto += " 	D 		" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "	" + NEW_LINE;

        var roboXixi = new RoboXixi(texto, NEW_LINE);
        var xixireros = roboXixi.Xixizeros;

        equal(xixireros[0].Escripte, "# retira os tabs com D no meio\n 	D 		\n/\n\t");
        equal(xixireros[0].Comando, "r");

        var esperado = "";
        esperado += "06/02 			SALDO ANTERIOR 				15,70 	" + NEW_LINE;
        esperado += "08/02 			SISDEB NET SP 		49 	- 		" + NEW_LINE;
        esperado += "08/02 			S A L D O 				15,21 	" + NEW_LINE;
        esperado += "10/02	INT PAG TIT BANCO 237 		42 	- 		" + NEW_LINE;
        esperado += "10/02 			S A L D O 				14,79 	" + NEW_LINE;
        esperado += "13/02 			SISPAG SULAMERICA SEG S 	911 	68 			" + NEW_LINE;
        esperado += "13/02 			S A L D O 				14,47 	" + NEW_LINE;
        esperado += "15/02	INT PAG TIT BANCO 237 		1,36 	- 		" + NEW_LINE;
        esperado += "15/02 			S A L D O 				13,11 	" + NEW_LINE;
        esperado += "17/02 			ELETROPAULO 1000652491 		34 	- 		" + NEW_LINE;
        esperado += "17/02 			S A L D O 				13,77 	" + NEW_LINE;
        esperado += "22/02 			REMUNERACAO/SALARIO 		1,78 			" + NEW_LINE;
        esperado += "22/02	DOC INT 953354 julio 	4175 	00 	- 		" + NEW_LINE;
        esperado += "22/02 			S A L D O 				14,55 ";
        
        roboXixi.Transformar();
        equal(roboXixi.ResultadoFinal, esperado);
    });

    test("r[eplace javascript] caso 1 do Itau -> moneylog com \\r\\n", function () {
        var NEW_LINE = "\r\n";
        var texto = "";
        texto += "06/02 			SALDO ANTERIOR 				15,70 	" + NEW_LINE;
        texto += "08/02 			SISDEB NET SP 		49 	- 		" + NEW_LINE;
        texto += "08/02 			S A L D O 				15,21 	" + NEW_LINE;
        texto += "10/02 	D 		INT PAG TIT BANCO 237 		42 	- 		" + NEW_LINE;
        texto += "10/02 			S A L D O 				14,79 	" + NEW_LINE;
        texto += "13/02 			SISPAG SULAMERICA SEG S 	911 	68 			" + NEW_LINE;
        texto += "13/02 			S A L D O 				14,47 	" + NEW_LINE;
        texto += "15/02 	D 		INT PAG TIT BANCO 237 		1,36 	- 		" + NEW_LINE;
        texto += "15/02 			S A L D O 				13,11 	" + NEW_LINE;
        texto += "17/02 			ELETROPAULO 1000652491 		34 	- 		" + NEW_LINE;
        texto += "17/02 			S A L D O 				13,77 	" + NEW_LINE;
        texto += "22/02 			REMUNERACAO/SALARIO 		1,78 			" + NEW_LINE;
        texto += "22/02 	D 		DOC INT 953354 julio 	4175 	00 	- 		" + NEW_LINE;
        texto += "22/02 			S A L D O 				14,55 " + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "# retira os tabs com D no meio" + NEW_LINE;
        texto += " 	D 		" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "	" + NEW_LINE;

        var roboXixi = new RoboXixi(texto, NEW_LINE);
        var xixireros = roboXixi.Xixizeros;

        equal(xixireros[0].Escripte, "# retira os tabs com D no meio" + NEW_LINE + " 	D 		" + NEW_LINE + "/" + NEW_LINE + "\t");
        equal(xixireros[0].Comando, "r");

        var esperado = "";
        esperado += "06/02 			SALDO ANTERIOR 				15,70 	" + NEW_LINE;
        esperado += "08/02 			SISDEB NET SP 		49 	- 		" + NEW_LINE;
        esperado += "08/02 			S A L D O 				15,21 	" + NEW_LINE;
        esperado += "10/02	INT PAG TIT BANCO 237 		42 	- 		" + NEW_LINE;
        esperado += "10/02 			S A L D O 				14,79 	" + NEW_LINE;
        esperado += "13/02 			SISPAG SULAMERICA SEG S 	911 	68 			" + NEW_LINE;
        esperado += "13/02 			S A L D O 				14,47 	" + NEW_LINE;
        esperado += "15/02	INT PAG TIT BANCO 237 		1,36 	- 		" + NEW_LINE;
        esperado += "15/02 			S A L D O 				13,11 	" + NEW_LINE;
        esperado += "17/02 			ELETROPAULO 1000652491 		34 	- 		" + NEW_LINE;
        esperado += "17/02 			S A L D O 				13,77 	" + NEW_LINE;
        esperado += "22/02 			REMUNERACAO/SALARIO 		1,78 			" + NEW_LINE;
        esperado += "22/02	DOC INT 953354 julio 	4175 	00 	- 		" + NEW_LINE;
        esperado += "22/02 			S A L D O 				14,55 ";

        roboXixi.Transformar();
        equal(roboXixi.ResultadoFinal, esperado);
    });

    test("r[eplace javascript] caso 2 do Itau -> moneylog com \\n", function () {
        var NEW_LINE = "\n";
        var texto = "";
        texto += "06/02 			SALDO ANTERIOR 				15,70 	" + NEW_LINE;
        texto += "08/02 			SISDEB NET SP 		49 	- 		" + NEW_LINE;
        texto += "08/02 			S A L D O 				15,21 	" + NEW_LINE;
        texto += "10/02 	D 		INT PAG TIT BANCO 237 		42 	- 		" + NEW_LINE;
        texto += "10/02 			S A L D O 				14,79 	" + NEW_LINE;
        texto += "13/02 			SISPAG SULAMERICA SEG S 	911 	68 			" + NEW_LINE;
        texto += "13/02 			S A L D O 				14,47 	" + NEW_LINE;
        texto += "15/02 	D 		INT PAG TIT BANCO 237 		1,36 	- 		" + NEW_LINE;
        texto += "15/02 			S A L D O 				13,11 	" + NEW_LINE;
        texto += "17/02 			ELETROPAULO 1000652491 		34 	- 		" + NEW_LINE;
        texto += "17/02 			S A L D O 				13,77 	" + NEW_LINE;
        texto += "22/02 			REMUNERACAO/SALARIO 		1,78 			" + NEW_LINE;
        texto += "22/02 	D 		DOC INT 953354 julio 	4175 	00 	- 		" + NEW_LINE;
        texto += "22/02 			S A L D O 				14,55 " + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "# retira os tabs com D no meio" + NEW_LINE;
        texto += " 	D 		" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "	" + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "# retira o S A L D O" + NEW_LINE;
        texto += ".*S A L D O.*\\n?" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "" + NEW_LINE;

        var roboXixi = new RoboXixi(texto, NEW_LINE);
        var xixireros = roboXixi.Xixizeros;

        equal(xixireros[0].Escripte, "# retira os tabs com D no meio\n 	D 		\n/\n\t");
        equal(xixireros[0].Comando, "r");

        equal(xixireros[1].Escripte, "# retira o S A L D O\n.*S A L D O.*\\n?\n/\n");
        equal(xixireros[1].Comando, "r");

        var esperado = "";
        esperado += "06/02 			SALDO ANTERIOR 				15,70 	" + NEW_LINE;
        esperado += "08/02 			SISDEB NET SP 		49 	- 		" + NEW_LINE;
        esperado += "10/02	INT PAG TIT BANCO 237 		42 	- 		" + NEW_LINE;
        esperado += "13/02 			SISPAG SULAMERICA SEG S 	911 	68 			" + NEW_LINE;
        esperado += "15/02	INT PAG TIT BANCO 237 		1,36 	- 		" + NEW_LINE;
        esperado += "17/02 			ELETROPAULO 1000652491 		34 	- 		" + NEW_LINE;
        esperado += "22/02 			REMUNERACAO/SALARIO 		1,78 			" + NEW_LINE;
        esperado += "22/02	DOC INT 953354 julio 	4175 	00 	- 		" + NEW_LINE;
        roboXixi.Transformar();
        equal(roboXixi.ResultadoFinal, esperado);
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


    test("RoboXixi.Transformar() 's' e 'x' combinados", function () {

        var texto = "";
        texto += "aaa" + NEW_LINE;
        texto += "bbb" + NEW_LINE;
        texto += "ccc" + NEW_LINE;
        texto += "///s" + NEW_LINE;
        texto += "s/bbb/xxx/" + NEW_LINE;
        texto += "p" + NEW_LINE;
        texto += "///t" + NEW_LINE;
        texto += "*xxx*" + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "x" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "y" + NEW_LINE;

        var roboXixi = new RoboXixi(texto, '\n');

        var resultadoEsperado = "";
        resultadoEsperado += "*aaa\n";
        resultadoEsperado += "yyy\n";
        resultadoEsperado += "ccc*";

        roboXixi.Transformar();
        equal(roboXixi.ResultadoFinal, resultadoEsperado);
    });

    test("RoboXixi.Transformar(com indice)", function () {

        var texto = "";
        texto += "aaa" + NEW_LINE;
        texto += "bbb" + NEW_LINE;
        texto += "ccc" + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "a" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "x" + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "b" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "x" + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "c" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "x" + NEW_LINE;

        var roboXixi = new RoboXixi(texto, NEW_LINE);
        roboXixi.Transformar();

        equal(roboXixi.DadosIniciais, "aaa" + NEW_LINE + "bbb" + NEW_LINE + "ccc", "roboXixi.Transformar(0)");
        equal(roboXixi.Xixizeros[0].DadoTransformado, "xxx" + NEW_LINE + "bbb" + NEW_LINE + "ccc", "roboXixi.Transformar(1)");
        equal(roboXixi.Xixizeros[1].DadoTransformado, "xxx" + NEW_LINE + "xxx" + NEW_LINE + "ccc", "roboXixi.Transformar(2)");
        equal(roboXixi.Xixizeros[2].DadoTransformado, "xxx" + NEW_LINE + "xxx" + NEW_LINE + "xxx", "roboXixi.Transformar(3)");
        equal(roboXixi.ResultadoFinal, "xxx" + NEW_LINE + "xxx" + NEW_LINE + "xxx", "roboXixi.Transformar( )");
    });

    test("RoboXixi: o comentário pode estar em qualquer lugar do escripte", function () {

        var texto = "";
        texto += "aaa" + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "# replacer: comentário antes" + NEW_LINE;
        texto += "a" + NEW_LINE;
        texto += "# replacer: comentário depois" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "# substituitor: comentário antes" + NEW_LINE;
        texto += "x" + NEW_LINE;
        texto += "# substituitor: comentário depois" + NEW_LINE;

        var roboXixi = new RoboXixi(texto, NEW_LINE);
        roboXixi.Transformar();

        equal(roboXixi.Xixizeros[0].DadoTransformado, "xxx", "roboXixi.Xixizeros[0].DadoTransformado");
    });
});
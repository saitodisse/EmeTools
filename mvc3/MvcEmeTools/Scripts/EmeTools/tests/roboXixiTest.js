NEW_LINE = '\n';

$(document).ready(function () {
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
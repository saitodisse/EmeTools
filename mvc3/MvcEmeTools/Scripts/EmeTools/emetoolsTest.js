$(document).ready(function () {
    test("transformar sem newline", function () {
        
        // cria lista de templates
        var templates = [];
        var primeiroTemplate = [];
        primeiroTemplate.push(" - xxx");
        templates.push(primeiroTemplate);

        var xixizero = new Xixizero("abc", templates, '\n');
        var atual = xixizero.transformar();
        var esperado = " - abc";
        equal(atual, esperado, "substitui xxx por template");
    });

    test("transformar com newline", function () {
        
        // cria lista de templates
        var templates = [];
        var primeiroTemplate = [];
        primeiroTemplate.push(" - xxx");
        primeiroTemplate.push("");
        templates.push(primeiroTemplate);

        var xixizero = new Xixizero("abc", templates, '\n');
        var atual = xixizero.transformar();
        var esperado = " - abc\n";
        equal(atual, esperado, "substitui xxx por template");
    });

    test("RoboXixi cria Xixizeros", function () {

        var texto = "";
        texto += "a\n";
        texto += "b\n";
        texto += "///\n";
        texto += " - xxx\n";

        var roboXixi = new RoboXixi(texto, '\n');
        var xixireros = roboXixi.Xixizeros;

        equal(xixireros[0].Dado, "a", "1.dados");
        equal(xixireros[0].Templates[0][0], " - xxx", "1.Templates[0][0]");
        equal(xixireros[0].Templates[0][1], "", "1.Templates[0][1]"); // a linha vazia existe
        equal(xixireros[0].Templates[0].length, 2, "1.template.length");
        equal(xixireros[0].transformar(), " - a\n", "1.transformar");
    });

    test("RoboXixi ignora comentário", function () {

        var texto = "";
        texto += "a\n";
        texto += "b\n";
        texto += "///\n";
        texto += "#comentário\n";
        texto += " - xxx\n";

        var roboXixi = new RoboXixi(texto, '\n');
        var xixireros = roboXixi.Xixizeros;

        equal(xixireros[0].Dado, "a", "1.dados");
        equal(xixireros[0].Templates[0][0], "#comentário", "1.Templates[0][0]");
        equal(xixireros[0].Templates[0][1], " - xxx", "1.Templates[0][1]");
        equal(xixireros[0].Templates[0][2], "", "1.Templates[0][2]"); // a linha vazia existe
        equal(xixireros[0].transformar(), " - a\n", "1.transformar");
    });

    test("Xixizeros com dois templates", function () {

        var texto = "";
        texto += "a\n";
        texto += "b\n";
        texto += "///\n";
        texto += "_xxx_\n";
        texto += "///\n";
        texto += "(xxx)\n";

        var roboXixi = new RoboXixi(texto, '\n');
        var xixireros = roboXixi.Xixizeros;

        equal(xixireros[0].Dado, "a", "1.dados");
        equal(xixireros[0].Templates[0][0], "_xxx_", "1.template[0][0]");
        equal(xixireros[0].Templates[0][1], "", "1.template[0][1]");
        equal(xixireros[0].Templates[1][0], "(xxx)", "1.template[1][0]");
        equal(xixireros[0].Templates[1][1], "", "1.template[0][1]");

        equal(xixireros[0].transformar(), "(_a_)\n", "xixireros[0].transformar()");
        equal(xixireros[1].transformar(), "(_b_)\n", "xixireros[1].transformar()");
        
        equal(xixireros[0].Templates[0].joinTemplate, "_xxx_", "1.template[0].joinTemplate");
        equal(xixireros[0].Templates[1].joinTemplate, "(xxx)\n", "1.template[0].joinTemplate");
    });

    test("RoboXixi.Transformar() devolve string com resultado final", function () {

        var texto = "";
        texto += "a-123\n";
        texto += "b-234\n";
        texto += "c-345\n";
        texto += "///\n";
        texto += "#-----------------\n";
        texto += "# coloca parenteses\n";
        texto += "#-----------------\n";
        texto += "(xxx)\n";
        texto += "///\n";
        texto += "#-----------------\n";
        texto += "# coloca chaves\n";
        texto += "#-----------------\n";
        texto += "{xxx}\n";
        
        var roboXixi = new RoboXixi(texto, '\n');
        
        var resultadoEsperado = "";
        resultadoEsperado += "{(a-123)}\n";
        resultadoEsperado += "{(b-234)}\n";
        resultadoEsperado += "{(c-345)}\n";
        
        equal(roboXixi.Transformar(), resultadoEsperado, "roboXixi.Transformar()");
    });

    test("RoboXixi.Transformar() permite mesma linha", function () {

        var texto = "";
        texto += "a\n";
        texto += "b\n";
        texto += "c\n";
        texto += "///\n";
        texto += "xxx,";
        
        var roboXixi = new RoboXixi(texto, '\n');
        
        var resultadoEsperado = "a,b,c,";
        
        equal(roboXixi.Transformar(), resultadoEsperado, "roboXixi.Transformar()");
    });

    // código legado
    //    test("XXX converte realiza replace de 'XXX'", function () {
    //        var dados = "abc 123\ndef 456\nghi 789";
    //        var template = " - XXX\n";
    //        var texto = dados + "\n///\n" + template;

    //        var resultado = Xxx(texto);

    //        var primeiroItem = resultado;
    //        var valorEsperado = " - abc 123\n - def 456\n - ghi 789\n";
    //        equal(primeiroItem, valorEsperado, "deve substituir o xxx pelo que foi passado");
    //    });

    //    test("XXX para lista", function() {
    //        var texto = "";
    //        texto += "a\n";
    //        texto += "b\n";
    //        texto += "///\n";
    //        texto += "1-xxx\n";
    //        texto += "2-xxx\n";

    //        var resultado = XxxLista(texto);

    //        var valorEsperado = "";
    //        valorEsperado += "1-a\n";
    //        valorEsperado += "2-b\n";

    //        equal(resultado, valorEsperado, "deve substituir cada xxx por cada linha de dados");
    //    });
});
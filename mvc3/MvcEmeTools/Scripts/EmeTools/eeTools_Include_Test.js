$(document).ready(function () {
    test("resultado substitui xxx por template", function () {
        
        // cria lista de templates
        var templates = [];
        var primeiroTemplate = [];
        primeiroTemplate.push(" - xxx");
        templates.push(primeiroTemplate);

        var xixizero = new Xixizero("abc", templates, '\n');
        var atual = xixizero.resultado();
        var esperado = " - abc";
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
        equal(xixireros[0].resultado(), " - a\n", "1.resultado");
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
        equal(xixireros[0].resultado(), " - a\n", "1.resultado");
    });

    test("RoboXixi realiza várias transformações", function () {

        var texto = "";
        texto += "a\n";
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
        equal(xixireros[0].resultado(), "(_a_)\n", "1.resultado");
        equal(xixireros[0].Templates[0].joinTemplate, "_xxx_", "1.template[0][1]");
        equal(xixireros[0].Templates[1].joinTemplate, "(xxx)\n", "1.template[0][1]");
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
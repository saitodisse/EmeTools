NEW_LINE = "\n";
$(document).ready(function () {

    test("XXX converte realiza replace de 'XXX'", function () {
        var dados = "abc 123\ndef 456\nghi 789";
        var template = " - XXX\n";
        var texto = dados + "\n///\n" + template;

        var resultado = Xxx(texto);

        var primeiroItem = resultado;
        var valorEsperado = " - abc 123\n - def 456\n - ghi 789\n";
        equal(primeiroItem, valorEsperado, "deve substituir o xxx pelo que foi passado");
    });

    test("XXX para lista", function () {
        var dados = "abc 123\ndef 456\nghi 789";
        var template = "1-xxx\n2-xxx\n3-xxx";
        var texto = dados + "\n///\n" + template;

        var resultado = XxxLista(texto);

        var valorEsperado = "1-abc 123\n2-def 456\n3-ghi 789";

        equal(resultado, valorEsperado, "deve substituir cada xxx por cada linha de dados");
    });

    test("resultado substitui xxx por template", function () {
        var xixizero = new Xixizero("abc", " - xxx");
        var atual = xixizero.resultado();
        var esperado = " - abc";
        equal(atual, esperado, "substitui xxx por template");
    });

    test("RoboXixi cria Xixizeros", function () {
        var roboXixi = new RoboXixi("a\nb\n///\n - xxx\n");
        var xixireros = roboXixi.Xixizeros;

        equal(xixireros[0].Dado, "a", "1.dados");
        equal(xixireros[0].Template, " - xxx\n", "1.template");
        equal(xixireros[0].resultado(), " - a\n", "1.resultado");
        equal(xixireros[1].Dado, "b", "2.dados");
        equal(xixireros[1].Template, " - xxx\n", "2.template");
        equal(xixireros[1].resultado(), " - b\n", "2.resultado");
    });

    test("RoboXixi ignora comentário", function () {
        var roboXixi = new RoboXixi("a\nb\n///\n#comentário\n - xxx\n");
        var xixireros = roboXixi.Xixizeros;

        equal(xixireros[0].Dado, "a", "1.dados");
        equal(xixireros[0].Template, " - xxx\n", "1.template");
        equal(xixireros[0].resultado(), " - a\n", "1.resultado");
        equal(xixireros[1].Dado, "b", "2.dados");
        equal(xixireros[1].Template, " - xxx\n", "2.template");
        equal(xixireros[1].resultado(), " - b\n", "2.resultado");
    });

});

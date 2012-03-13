$(document).ready(function () {
    test("[x]xx templates simples", function () {
        equal(executarRoboComXxxNoFinal("xxx-1"), "a\na", "xxx-1 => a");
        equal(executarRoboComXxxNoFinal("xxx0"), "b\nb", "xxx0   => b");
        equal(executarRoboComXxxNoFinal("xxx1"), "c\nc", "xxx1   => c");
        equal(executarRoboComXxxNoFinal("xxx0xxx0"), "bb\nbb", "xxx0xxx0  => bb");
        equal(executarRoboComXxxNoFinal("xxx0xxx0xxx0"), "bbb\nbbb", "xxx0xxx0xxx0  => bbb");
        equal(executarRoboComXxxNoFinal("xxx0xxx0xxx0xxx0"), "bbbb\nbbbb", "xxx0xxx0xxx0xxx0  => bbbb");
    });

    test("[x]xx = ababacado", function () {
        var escripteXxx = "";
        escripteXxx += "xxx-1";  //a
        escripteXxx += "xxx0";   //b
        escripteXxx += "xxx-1";  //a
        escripteXxx += "xxx0";   //b
        escripteXxx += "xxx-1";  //a
        escripteXxx += "xxx1";   //c
        escripteXxx += "xxx-1";  //a
        escripteXxx += "xxx2";   //d
        escripteXxx += "xxx3";   //o
        equal(executarRoboComXxxNoFinal(escripteXxx), "ababacado\nababacado", "ababacado");
    });


    var executarRoboComXxxNoFinal = function (escripteXxx) {
        var texto = "";
        texto += "a" + NEW_LINE;
        texto += "a" + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "a" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "b" + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "b" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "c" + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "c" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "d" + NEW_LINE;
        texto += "///r" + NEW_LINE;
        texto += "d" + NEW_LINE;
        texto += "/" + NEW_LINE;
        texto += "o" + NEW_LINE;
        texto += "///x" + NEW_LINE;
        texto += escripteXxx + NEW_LINE;

        var roboXixi = new RoboXixi(texto, NEW_LINE);
        roboXixi.transformar();
        return roboXixi.ResultadoFinal;
    };

    test("[x]xx varios xxx, mais que 10", function () {
        equal(variosXxx("xxx-1"), "a");
        equal(variosXxx("xxx0"), "b");
        equal(variosXxx("xxx1"), "c");
        equal(variosXxx("xxx10"), "l");
    });

    var variosXxx = function (escripteXxx) {
        var texto = "";
        texto += "a" + NEW_LINE;
        texto += "///t" + NEW_LINE;
        texto += "b" + NEW_LINE;   //0
        texto += "///t" + NEW_LINE;
        texto += "c" + NEW_LINE;
        texto += "///t" + NEW_LINE;
        texto += "d" + NEW_LINE;
        texto += "///t" + NEW_LINE;
        texto += "e" + NEW_LINE;
        texto += "///t" + NEW_LINE;
        texto += "f" + NEW_LINE;
        texto += "///t" + NEW_LINE;
        texto += "g" + NEW_LINE;   //5
        texto += "///t" + NEW_LINE;
        texto += "h" + NEW_LINE;
        texto += "///t" + NEW_LINE;
        texto += "i" + NEW_LINE;
        texto += "///t" + NEW_LINE;
        texto += "j" + NEW_LINE;
        texto += "///t" + NEW_LINE;
        texto += "k" + NEW_LINE;
        texto += "///t" + NEW_LINE;
        texto += "l" + NEW_LINE;   //10
        texto += "///t" + NEW_LINE;
        texto += "m" + NEW_LINE;
        texto += "///x" + NEW_LINE;
        texto += escripteXxx + NEW_LINE;

        var roboXixi = new RoboXixi(texto, NEW_LINE);
        roboXixi.transformar();
        return roboXixi.ResultadoFinal;
    };
});
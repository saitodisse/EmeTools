#include "../jsed/jsed.js"
#include "emetools.js"
#include "comandos.js"
#include "roboXixi.js"
#include "transformarXxx.js"
#include "xixizero.js"

var NEW_LINE = "\n";

SHOW_ALERT_ON_ERRORS = true;

// HELPERS FUNCTIONS
var getAllText = function () {
    document.selection.SelectAll();
    var text = document.selection.text;

    document.HighlightFind = false;
    document.selection.EndOfLine(false, eeLineView);
    return text;
};
var sameWindow = function (texto) {
    document.selection.SelectAll();
    document.selection.text = texto;

    document.HighlightFind = false;
    document.selection.EndOfLine(false, eeLineView);
};
var newEditorWindow = function (texto) {
    editor.NewFile();
    document.write(texto);

    document.HighlightFind = false;
    document.selection.EndOfLine(false, eeLineView);
};
// (END) HELPERS FUNCTIONS

// take all text from windows
var allText = getAllText();

// initialize roboXixi
var roboXixi = new RoboXixi(allText, NEW_LINE);

// make the transformation
roboXixi.transformar();

// print result in a new window
sameWindow(roboXixi.ResultadoFinal);

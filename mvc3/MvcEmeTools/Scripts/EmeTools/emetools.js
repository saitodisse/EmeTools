var SHOW_ALERT_ON_ERRORS = false;

// configura template do underscore
//ç_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

function disparaErro(name, message) {
    var err = new Error();
    err.name = name;
    err.message = message;
    if (SHOW_ALERT_ON_ERRORS) {
        var sMesssage = '';
        sMesssage += '--------\n';
        sMesssage += 'ERROR:\n';
        sMesssage += '--------\n\n';
        sMesssage += err.name + '\n';
        sMesssage += '---------------------------------------------\n';
        sMesssage += err.message;
        alert(sMesssage);
    } else {
        throw err;
    }
}

//Exceptions
var COMANDO_NAO_INFORMADO = function () {
    return "O comando do '///' deve ser informado logo apos o '///'";
};

var decodeHtml = function (str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};
var encodeHtml = function (str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
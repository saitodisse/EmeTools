#include "eeTools_Include.js"
#include "emetools.js"
#include "../jsed/jsed.js"

SHOW_ALERT_ON_ERRORS = true;

//  --------
//  emeTools
//  v. 0.05
//  --------
//  
//  based on emeditor_perfecta_en.jsee (http://yangshuai.googlepages.com/emeditor_perfecta.html)

var main = function () {

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
    var OP_XXX = 1;
    var OP_XXX_LISTA = 2;
    var OP_REGEX_EXTRACT = 3;
    var OP_EXTRACT_LINKS = 4;
    var OP_TRIM = 5;
    var OP_TRIM_LINES = 6;
    var OP_TAB_TO_SPACES = 7;
    var OP_SPACES_TO_TABS = 8;
    var OP_SPACES_TO_SPACE = 9;
    var OP_SORT = 10;
    var OP_SORT_DESC = 11;
    var OP_SORT_DISTINCT = 12;
    var OP_SORT_DISTINCT_DESC = 13;
    var OP_SQL_DECLARE_SET = 14;
    var OP_SQL_EXEC = 15;
    var OP_SQL_SP_HELP_TO_CSHARP = 16;
    var OP_PONTO_VIRGULA = 17;
    var OP_ASPA_SIMPLES_TO_ASPAS_DUPLAS = 18;
    var OP_CPF_ZEROS_A_ESQUERDA = 19;
    var OP_LINK_PFC_FINANC = 20;
    var OP_ITAU_TO_MONEYLOG = 21;
    var OP_XXX_EXISTE_LISTA = 22;
    var OP_TRANSPOSE = 23;
    var OP_EXTRAIR_STRING_SEGURA_CSHARP = 24;
    var OP_RETIRAR_LINHAS_POR_REGEX = 25;

    var OP_XXX_NEW = 26;

    //xxx
    var mainMenu = CreatePopupMenu();
    mainMenu.Add("XXX (novo)", OP_XXX_NEW);
    mainMenu.Add("XXX", OP_XXX);
    mainMenu.Add("XXX para lista", OP_XXX_LISTA);
    mainMenu.Add("XXX existe na lista?", OP_XXX_EXISTE_LISTA);
    mainMenu.Add("Transpose", OP_TRANSPOSE);
    mainMenu.Add("", 0, eeMenuSeparator);
    mainMenu.Add("extrair por Regex", OP_REGEX_EXTRACT);
    mainMenu.Add("retirar linhas por Regex", OP_RETIRAR_LINHAS_POR_REGEX);
    mainMenu.Add("", 0, eeMenuSeparator);

    //sorts
    var submenu = CreatePopupMenu();
    submenu.Add("sort", OP_SORT);
    submenu.Add("sort (desc)", OP_SORT_DESC);
    submenu.Add("sort distinct", OP_SORT_DISTINCT);
    submenu.Add("sort distinct (desc)", OP_SORT_DISTINCT_DESC);
    mainMenu.AddPopup("SORT", submenu);
    mainMenu.Add("", 0, eeMenuSeparator);


    //trims
    //[tabs]
    mainMenu.Add("trim()", OP_TRIM);
    mainMenu.Add("trim lines()", OP_TRIM_LINES);
    mainMenu.Add("[\\t] -> [\\s]*", OP_TAB_TO_SPACES);
    mainMenu.Add("[\\s]* -> [\\t]", OP_SPACES_TO_TABS);
    mainMenu.Add("[\\s]* -> [\\s]", OP_SPACES_TO_SPACE);
    mainMenu.Add("", 0, eeMenuSeparator);


    //SQL
    submenu = CreatePopupMenu();
    submenu.Add("Declare/Set", OP_SQL_DECLARE_SET);
    submenu.Add("Exec", OP_SQL_EXEC);
    submenu.Add("sp_help TO C#", OP_SQL_SP_HELP_TO_CSHARP);
    mainMenu.AddPopup("SQL", submenu);

    //Replaces
    submenu = CreatePopupMenu();
    submenu.Add(". -> ,", OP_PONTO_VIRGULA);
    submenu.Add("' -> ''", OP_ASPA_SIMPLES_TO_ASPAS_DUPLAS);
    submenu.Add("CPF - colocar Zeros à esquerda", OP_CPF_ZEROS_A_ESQUERDA);
    submenu.Add("link pfcFin", OP_LINK_PFC_FINANC);
    submenu.Add("Extrair string C#", OP_EXTRAIR_STRING_SEGURA_CSHARP);
    mainMenu.AddPopup("REPLACE", submenu);

    //Misc
    submenu = CreatePopupMenu();
    submenu.Add("Itau TO moneyLog", OP_ITAU_TO_MONEYLOG);
    mainMenu.AddPopup("MISC", submenu);

    //extract
    submenu = CreatePopupMenu();
    submenu.Add("links (http://xxxxxxx.com)", OP_EXTRACT_LINKS);
    mainMenu.AddPopup("EXTRACT", submenu);
    mainMenu.Add("", 0, eeMenuSeparator);

    switch (mainMenu.Track()) {
        case OP_XXX_NEW:
            var allText = getAllText();
            var roboXixizero = new RoboXixi(allText, NEW_LINE);
            roboXixizero.Transformar();
            newEditorWindow(roboXixizero.ResultadoFinal);
            break;
        case OP_XXX:
            newEditorWindow(Xxx(getAllText()));
            break;
        case OP_XXX_LISTA:
            newEditorWindow(XxxLista(getAllText()));
            break;
        case OP_XXX_EXISTE_LISTA:
            newEditorWindow(XxxExisteLista(getAllText()));
            break;
        case OP_REGEX_EXTRACT:
            newEditorWindow(RegexExtractor(getAllText()));
            break;
        case OP_RETIRAR_LINHAS_POR_REGEX:
            newEditorWindow(regexLinesDeleter(getAllText()));
            break;
        case OP_EXTRACT_LINKS:
            newEditorWindow(ExtrairLinks(getAllText()).join('\r\n'));
            break;
        case OP_TRIM:
            document.selection.SelectAll();
            document.selection.Replace("^\\s*", "", eeFindNext | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("\\s*$", "", eeFindNext | eeReplaceAll | eeFindReplaceRegExp);
            break;
        case OP_TRIM_LINES:
            document.selection.SelectAll();
            document.selection.Replace("^\\s*$\\n", "", eeFindNext | eeReplaceAll | eeFindReplaceRegExp);
            break;
        case OP_TAB_TO_SPACES:
            document.selection.SelectAll();
            texto = IdentarTab2Spaces(getAllText()).join('\r\n');
            editor.NewFile();
            document.write(texto);
            break;
        case OP_SPACES_TO_TABS:
            newEditorWindow(IdentarSpaces2Tab(getAllText()).join('\r\n'));
            break;
        case OP_SPACES_TO_SPACE:
            document.selection.SelectAll();
            document.selection.Replace("\\s{2,}", " ", eeFindNext | eeReplaceAll | eeFindReplaceRegExp);
            break;
        case OP_SORT:
            sameWindow(ordenarTudo(getAllText(), 0).join('\r\n'));
            break;
        case OP_SORT_DESC:
            sameWindow(ordenarTudo(getAllText(), 1).join('\r\n'));
            break;
        case OP_SORT_DISTINCT:
            sameWindow(distinct(getAllText(), 0).join('\r\n'));
            break;
        case OP_SORT_DISTINCT_DESC:
            sameWindow(distinct(getAllText(), 1).join('\r\n'));
            break;
        case OP_SQL_DECLARE_SET:
            if (document.selection.text.length > 0) {
                document.selection.Replace("\\s*(@\\w+)\\s*(\\w+(\\(.*?\\))?).*", "Declare \\1 \\2;\\nSet \\1 = null;\\n", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp | eeReplaceSelOnly);
            }
            else {
                document.selection.Replace("\\s*(@\\w+)\\s*(\\w+(\\(.*?\\))?).*", "Declare \\1 \\2;\\nSet \\1 = null;\\n", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            }
            break;
        case OP_SQL_EXEC:
            document.selection.Replace("^create\\s+\\w+\\s+", "", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("\\s*(@\\w+)(.*?)(,?$)", "\\t\\1\\4 = null\\3", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("[()]", "", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.StartOfLine(true, eeLineView);

            document.selection.StartOfDocument(false);
            document.selection.Text = "/*\nexec ";
            document.selection.EndOfDocument(false);
            document.selection.Text = "*/";

            //Retira linhas em branco
            document.selection.Replace("\\s{2,}", "\\t", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("^$\\n", "", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("(^\\s+\x27|\x27\\s*\\+\\s*$)", "", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);

            document.selection.SelectAll();
            document.selection.Copy(eeCopyUnicode);
            document.selection.StartOfDocument(false);
            document.HighlightFind = false;

            document.selection.EndOfDocument(false);
            document.selection.Text = "\n\nCopiado para o clipBoard...";
            break;
        case OP_SQL_SP_HELP_TO_CSHARP:
            document.selection.SelectAll();
            texto = SQL_Converter_Campo_Tipo_CSharp(getAllText()).join('\r\n');
            editor.NewFile();
            document.write(texto);
            break;
        case OP_PONTO_VIRGULA:
            document.selection.SelectAll();
            document.selection.Replace("\\.", ",", eeFindNext | eeReplaceAll | eeFindReplaceRegExp);
            break;
        case OP_ASPA_SIMPLES_TO_ASPAS_DUPLAS:
            document.selection.Replace("'", "''", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            break;
        case OP_CPF_ZEROS_A_ESQUERDA:
            //document.selection.Replace("\\b(\\d{12,})\\b","",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("\\b(\\d{10})\\b", "0\\1", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("\\b(\\d{9})\\b", "00\\1", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("\\b(\\d{8})\\b", "000\\1", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("\\b(\\d{7})\\b", "0000\\1", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("\\b(\\d{6})\\b", "00000\\1", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.SelectAll();
            document.selection.Replace("^\\s*$\\n", "", eeFindNext | eeReplaceAll | eeFindReplaceRegExp);
            break;
        case OP_LINK_PFC_FINANC:
            document.selection.Replace(".*Seg=(\\d+)&Reg=(\\d+)&Und=(\\d+)&Pfc=(\\d+).*", "SELECT * FROM [tbPfcFinanciamento] WHERE [CodSegmento] = \\1 AND [CodReg] = \\2 AND [CodUnd] = \\3 AND [NroPfc] = \\4\x0aupdate [tbPfcFinanciamento] Set CodSituacao = 00 WHERE [CodSegmento] = \\1 AND [CodReg] = \\2 AND [CodUnd] = \\3 AND [NroPfc] = \\4\x0ahttp://localhost/MesaCreditoWeb/AnaliseFichaFinanciamento.aspx?Seg=\\1&Reg=\\2&Und=\\3&Pfc=\\4\x0ahttp://localhost/MesaCreditoWeb/AnaliseHistoricoFinanciamento.aspx?Seg=\\1&Reg=\\2&Und=\\3&Pfc=\\4&Vis=2", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            break;
        case OP_EXTRAIR_STRING_SEGURA_CSHARP:
            document.selection.Find("\x22", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeFindReplaceQuiet | eeFindAround);
            document.selection.Replace("\x22", "\\\\\x22", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeReplaceAll);
            document.selection.Find("\\", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeFindReplaceQuiet | eeFindAround);
            document.selection.Find("\\n", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeFindReplaceQuiet | eeFindAround);
            document.selection.Find("\\", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeFindReplaceQuiet | eeFindAround);
            document.selection.Find("\\s", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeFindReplaceQuiet | eeFindAround);
            document.selection.Find("\\s+", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeFindReplaceQuiet | eeFindAround);
            document.selection.Replace("\\s+", " ", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeReplaceAll);
            document.selection.Replace("\\s+", " ", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Find("\\", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeFindReplaceQuiet | eeFindAround | eeFindReplaceRegExp);
            document.selection.Find("\\n", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeFindReplaceQuiet | eeFindAround | eeFindReplaceRegExp);
            document.selection.Replace("\\n", "", eeFindNext | eeFindSaveHistory | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.EndOfLine(true, eeLineView);
            document.selection.Copy(eeCopyUnicode);
            document.Undo();
            document.Undo();
            document.Undo();
            break;
        case OP_ITAU_TO_MONEYLOG:
            document.selection.Replace(".*S A L D O.*", "", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("^(\\d\\d)/(\\d\\d)\\t(.*?)\\t(.*?)\\t(.*?)\\t(.*?)\\t(.*?)\\t(.*?)\\t(.*?)\\t", "2009-\\2-\\1\\t\\8\\7\\t\\5", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("^$\\n", "", eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            //SameWindow( MISC_Itau2MoneyLog( GetAllText() ) )
            break;
        case OP_TRANSPOSE:
            newEditorWindow(Transpose(getAllText()));
            break;
        default:
            break;
    }
};


main();
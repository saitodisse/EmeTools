#include "eeTools_Include.js"
	
//  --------
//  emeTools
//  v. 0.05
//  --------
//  
//  based on emeditor_perfecta_en.jsee (http://yangshuai.googlepages.com/emeditor_perfecta.html)

var main = function(){

	var GetAllText = function()
	{
		document.selection.SelectAll();
		var text = document.selection.text;

		document.HighlightFind=false;
		document.selection.EndOfLine(false,eeLineView);
		return text;
	}

	var SameWindow = function(texto)
	{
		document.selection.SelectAll();
		document.selection.text = texto;

		document.HighlightFind=false;
		document.selection.EndOfLine(false,eeLineView);
	}

	var NewEditorWindow = function(texto)
	{
		editor.NewFile();
		document.write(texto);

		document.HighlightFind=false;
		document.selection.EndOfLine(false,eeLineView);
	}

	var op_XXX = 1;
	var op_XXX_LISTA = 2;
	var op_REGEX_EXTRACT = 3;
	var op_EXTRACT_LINKS = 4;
	var op_TRIM = 5;
	var op_TRIM_LINES = 6
	var op_TAB_TO_SPACES = 7;
	var op_SPACES_TO_TABS = 8;
	var op_SPACES_TO_SPACE = 9;
	var op_SORT = 10;
	var op_SORT_DESC = 11;
	var op_SORT_DISTINCT = 12;
	var op_SORT_DISTINCT_DESC = 13;
	var op_SQL_DECLARE_SET = 14;
	var op_SQL_EXEC = 15;
	var op_SQL_SP_HELP_TO_CSHARP = 16;
	var op_PONTO_VIRGULA = 17;
	var op_ASPA_SIMPLES_TO_ASPAS_DUPLAS = 18;
	var op_CPF_ZEROS_A_ESQUERDA = 19;
	var op_LINK_PFC_FINANC = 20;
	var op_ITAU_TO_MONEYLOG = 21;
	var op_XXX_EXISTE_LISTA = 22;
	var op_Transpose = 23;

	//xxx
	mainMenu=CreatePopupMenu();
	mainMenu.Add("XXX",op_XXX);
	mainMenu.Add("XXX para lista",op_XXX_LISTA);
	mainMenu.Add("XXX existe na lista?",op_XXX_EXISTE_LISTA);
	mainMenu.Add("Transpose",op_Transpose);
	mainMenu.Add( "", 0, eeMenuSeparator );
	mainMenu.Add("extrair por Regex", op_REGEX_EXTRACT);
	mainMenu.Add( "", 0, eeMenuSeparator );

	//sorts
	submenu=CreatePopupMenu();
	submenu.Add("sort",op_SORT);
	submenu.Add("sort (desc)",op_SORT_DESC);
	submenu.Add("sort distinct",op_SORT_DISTINCT);
	submenu.Add("sort distinct (desc)",op_SORT_DISTINCT_DESC);
	mainMenu.AddPopup( "SORT", submenu );
	mainMenu.Add( "", 0, eeMenuSeparator );


	//trims
	//[tabs]
	mainMenu.Add("trim()",op_TRIM);
	mainMenu.Add("trim lines()",op_TRIM_LINES);
	mainMenu.Add("[\\t] -> [\\s]*",op_TAB_TO_SPACES);
	mainMenu.Add("[\\s]* -> [\\t]",op_SPACES_TO_TABS);
	mainMenu.Add("[\\s]* -> [\\s]",op_SPACES_TO_SPACE);
	mainMenu.Add( "", 0, eeMenuSeparator );


	//SQL
	submenu=CreatePopupMenu();
	submenu.Add("Declare/Set",op_SQL_DECLARE_SET);
	submenu.Add("Exec",op_SQL_EXEC);
	submenu.Add("sp_help TO C#",op_SQL_SP_HELP_TO_CSHARP);
	mainMenu.AddPopup( "SQL", submenu );

	//Replaces
	submenu=CreatePopupMenu();
	submenu.Add(". -> ,",op_PONTO_VIRGULA);
	submenu.Add("' -> ''",op_ASPA_SIMPLES_TO_ASPAS_DUPLAS);
	submenu.Add("CPF - colocar Zeros à esquerda",op_CPF_ZEROS_A_ESQUERDA);
	submenu.Add("link pfcFin",op_LINK_PFC_FINANC);
	mainMenu.AddPopup( "REPLACE", submenu );

	//Misc
	submenu=CreatePopupMenu();
	submenu.Add("Itau TO moneyLog",op_ITAU_TO_MONEYLOG);
	mainMenu.AddPopup( "MISC", submenu );

	//extract
	submenu=CreatePopupMenu();
	submenu.Add("links (http://xxxxxxx.com)",op_EXTRACT_LINKS);
	mainMenu.AddPopup( "EXTRACT", submenu );
	mainMenu.Add( "", 0, eeMenuSeparator );

	switch(mainMenu.Track())
	{
		case op_XXX:
			NewEditorWindow( Xxx( GetAllText() ) );
			break;
		case op_XXX_LISTA:
			NewEditorWindow( XxxLista( GetAllText() ) );
			break;
		case op_XXX_EXISTE_LISTA:
			NewEditorWindow( XxxExisteLista( GetAllText() ) );
			break;
		case op_REGEX_EXTRACT:
			NewEditorWindow( regexExtractor( GetAllText() ) );
			break;
		case op_EXTRACT_LINKS:
			NewEditorWindow( ExtrairLinks( GetAllText() ).join('\r\n') )
			break;
		case op_TRIM:
			document.selection.SelectAll();
			deleteLineStartBlank();
			deleteLineEndBlank();
			break;
		case op_TRIM_LINES:
			document.selection.SelectAll();
			replace2MoreNewLine();
			break;
		case op_TAB_TO_SPACES:
			document.selection.SelectAll();
			texto = IdentarTab2Spaces().join('\r\n');
			editor.NewFile();
			document.write(texto);
			break;
		case op_SPACES_TO_TABS:
			NewEditorWindow( IdentarSpaces2Tab( GetAllText() ).join('\r\n') )
			break;
		case op_SPACES_TO_SPACE:
			document.selection.SelectAll();
			replace2MoreBlank();
			break;
		case op_SORT:
			SameWindow( OrdenarTudo( GetAllText(), 0 ).join('\r\n') )
			break;
		case op_SORT_DESC:
			SameWindow( OrdenarTudo( GetAllText(), 1 ).join('\r\n') )
			break;
		case op_SORT_DISTINCT:
			SameWindow( Distinct( GetAllText(), 0 ).join('\r\n') )
			break;
		case op_SORT_DISTINCT_DESC:
			SameWindow( Distinct( GetAllText(), 1 ).join('\r\n') )
			break;
		case op_SQL_DECLARE_SET:
			SQL_DeclareSet();
			break;
		case op_SQL_EXEC:
			SQL_Exec();
			break;
		case op_SQL_SP_HELP_TO_CSHARP:
			document.selection.SelectAll();
			texto = SQL_Converter_Campo_Tipo_CSharp().join('\r\n');
			editor.NewFile();
			document.write(texto);
			break;
		case op_PONTO_VIRGULA:
			document.selection.SelectAll();
			document.selection.Replace("\\.",",",eeFindNext | eeReplaceAll | eeFindReplaceRegExp);
			break;
		case op_ASPA_SIMPLES_TO_ASPAS_DUPLAS:
			document.selection.Replace("'","''",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
			break;
		case op_CPF_ZEROS_A_ESQUERDA:
			//document.selection.Replace("\\b(\\d{12,})\\b","",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
			document.selection.Replace("\\b(\\d{10})\\b","0\\1",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
			document.selection.Replace("\\b(\\d{9})\\b" ,"00\\1",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
			document.selection.Replace("\\b(\\d{8})\\b" ,"000\\1",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
			document.selection.Replace("\\b(\\d{7})\\b" ,"0000\\1",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
			document.selection.Replace("\\b(\\d{6})\\b" ,"00000\\1",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
			document.selection.SelectAll();
			replace2MoreNewLine();
			break;
		case op_LINK_PFC_FINANC:
			document.selection.Replace(".*Seg=(\\d+)&Reg=(\\d+)&Und=(\\d+)&Pfc=(\\d+).*","SELECT * FROM [tbPfcFinanciamento] WHERE [CodSegmento] = \\1 AND [CodReg] = \\2 AND [CodUnd] = \\3 AND [NroPfc] = \\4\x0aupdate [tbPfcFinanciamento] Set CodSituacao = 00 WHERE [CodSegmento] = \\1 AND [CodReg] = \\2 AND [CodUnd] = \\3 AND [NroPfc] = \\4\x0ahttp://localhost/MesaCreditoWeb/AnaliseFichaFinanciamento.aspx?Seg=\\1&Reg=\\2&Und=\\3&Pfc=\\4\x0ahttp://localhost/MesaCreditoWeb/AnaliseHistoricoFinanciamento.aspx?Seg=\\1&Reg=\\2&Und=\\3&Pfc=\\4&Vis=2",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
			break;
		case op_ITAU_TO_MONEYLOG:
            document.selection.Replace(".*S A L D O.*","",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("^(\\d\\d)/(\\d\\d)\\t(.*?)\\t(.*?)\\t(.*?)\\t(.*?)\\t(.*?)\\t(.*?)\\t(.*?)\\t","2009-\\2-\\1\\t\\8\\7\\t\\5",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
            document.selection.Replace("^$\\n","",eeFindNext | eeFindReplaceEscSeq | eeReplaceAll | eeFindReplaceRegExp);
			//SameWindow( MISC_Itau2MoneyLog( GetAllText() ) )
			break;
		case op_Transpose:
			NewEditorWindow( Transpose( GetAllText() ) );
			break;
		default:
			break;
	}
}

main();
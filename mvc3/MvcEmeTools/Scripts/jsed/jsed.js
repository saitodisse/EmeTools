//
// jsed.js - an implementation of the sed utility in javascript
// ------------------------------------------------------------
// from: http://lvogel.free.fr/jsed/index.html
// ------------------------------------------------------------
//
// version 1.0 dated 22 january 2005
// (C) 2003-2005 Laurent Vogel - GPL version 2 or later at your option.
//
// interface to the calling script:
// This script defines a function/object sed.
// methods useable from outside:
//   sed.compile(script): compiles the script
//   sed.execute(input): runs the compiled script on the input
//   sed(script, input): runs the script
//     line endings in string arguments script and input are either "\r\n" or 
//     "\n".
// writeable properties:
//   sed.nflag: true if -n flag (default false)
//   sed.pflag: true if POSIX (i.e. no extensions) (default false)
//   sed.jumpmax: maximum number of jumps per input line (dflt 10000)
// The following methods are called by the script and may be set:
//   sed.out(string): output a string on STDOUT (default document.write())
//   sed.err(string): error on STDERR (default document.write() in <i>...</i>)
//   sed.read(filename): returns the contents of file filename
//                   (default, returns "<<<contents of file filename>>\n")
//   sed.write(string, filename): outputs string on file filename (default no-op)
//

var sed;

( function () {
  
// Data structures: all regexes are in array re; all strings in array
// str. sed commands are stored in array cmd as follow:
//   cmd[i] = flags
//   if there is an address:
//     cmd[j = i+1] = -1 ($) or the line number or "" (//) or the re string
//   if there is a second address:
//     (same for the second address)
//   cmd[j] = the command character
//   depending on the command, other arguments can follow:
//   a,c,i: [j+1] = text
//   b,t: [j+1] = index in cmd[] of the command when the jump is made
//   r,w: [j+1] = filename
//   s///: [j+1] = "" or re; [j+2] = rhs; [j+3] = n; [j+4] = filename
//   y///: [j+1] = string of 256 chars


// the values of flags (should really be constants)

var FLAG_L1  = 0x01;   /* first address is a line number or $ */
var FLAG_L2  = 0x02;   /* second address is a line number or $ */
var FLAG_R1  = 0x04;   /* first address is a RE */
var FLAG_R2  = 0x08;   /* second address is a RE */
var FLAG_IN  = 0x10;   /* in the middle of an address range? */
var FLAG_G   = 0x20;   /* was g postfix specified? */
var FLAG_P   = 0x40;   /* was p postfix specified? */
var FLAG_NOT = 0x80;   /* was negation specified? */

var FLAG_L1R1 = (FLAG_L1|FLAG_R1);
var FLAG_L2R2 = (FLAG_L2|FLAG_R2);


/* 
 * error reporting 
 */

//VARIABLES
var message, /* current error message if any */

/*
 * input buffer and current input line
 */
buffer,   /* current input buffer, either the script of the input */
holdbuf,
lineno,   /* line number */
lastline, /* true if the current line is the last one */
savebuf,  /* a copy of the current line */
linebuf,  /* current line, serving as a general buffer */
a,  /* array used when matching regexps */
  
/*
 * compile-time and exec-time variables
 */

cmd, /* command array */

tflag,  // true if the next t should jump
lastre,
pc,
f,  // flags for current command
r,  // the last compiled regexp

/* misc variables */
i, j, k, b, c, delim, y,

nflag,   // local copy of sed.nflag, for this run only

appends,  // array of appends (cmd[] indices of delayed commands)
appindex; // the index in the appends[] array


// obtain one line from buffer and put it into linebuf
function getline () {
  var x = buffer.indexOf("\n");
  if ((lastline = (-1 == x))) {
    linebuf = buffer; 
  } else {
    linebuf = buffer.substr(0, x); 
    buffer = buffer.substr(x+1);
  }
  lineno++; 
  savebuf = linebuf;
}

function lineinit (s) {
  buffer = s.replace(/\r\n/g, "\n");
  lineno = 0;
  lastline = false;
}


function eat (r) { 
  if (null == (a = r.exec(linebuf))) {
    return false;
  }
  linebuf = RegExp.rightContext;  
  return true;
}


function at (i) {
  return linebuf.charAt(i);
}


/*
 * compile phase
 */

function sedcomp (script) {
  // init compile variables
  cmd = [];
  
  // labels ("" is the implied label at the end of script)
  var labels = ["", -1, -1], 
  
  // { ... } brackets
  brackets = [],
  brdepth = 0;
  
  lineinit(script);

  i = 0;  // i is the current index in cmd[]
  
  nflag = sed.nflag;
  
  getline();
  if (eat(/^#n.*/)) {
    nflag = true;
  }
  for (;;) {
    // eat white space, semicolons and comments
    eat(/^[ \t;]*([ \t;]|#.*)/);
    
    j = i+1; // cmd[i] holds the flags, j is the incrementing index on cmd[]
    f = 0;   // default flags
      
    // try at most two addresses
    for (k = 0; k < 1 || ((k==1) && eat(/^,/)); k++) {
      if (eat(/^0*([1-9][0-9]*)/)) {
        cmd[j++] = a[1]; f |= FLAG_L1<<k;
      } else if (eat(/^\$/)) {
        cmd[j++] = -1; f |= FLAG_L1<<k;
      } else if (eat(/^\//)) {
        if (-1 === (cmd[j++] = recomp("/"))) { return; }
        f |= FLAG_R1<<k;
      } else if (eat(/^\\([^\\])/)) {
        if (-1 === (cmd[j++] = recomp(a[1]))) { return; }
        f |= FLAG_R1<<k;
      } else { break; }
    }
    // now k holds the number of addresses until inside a command

    eat(/^[ \t]+/);
    if (eat(/^![! \t]*/)) { f |= FLAG_NOT; }
    // 0addr command?
    if (linebuf === "") {
      if (0!=f) { message = "missing command"; return; }
      j = i;
    } else if (eat(/^[aic]/)) {
      if ((k==2) && (a[0]!="c")) { 
        message="at most one address"; return;
      }
      cmd[j++] = a[0];
      if (!eat(/^\\$/)) { message = "\\<newline> expected"; return; }
      if (-1 === (cmd[j++] = textcomp())) { return; }
    } else if (eat(/^([bt])[ \t]*(.*)/)) {
      cmd[j++] = a[1];
      
      for (k = 0; k < labels.length; k += 3) {
        if (labels[k] == a[2]) {
          /* label found */
          if (labels[k+1] != -1) { /* the label is known already */
            cmd[j++] = labels[k+1];
          } else { /* push this location */
            cmd[j] = labels[k+2]; labels[k+2] = j++;
          }
          break;
        }
      } 
      if (k >= labels.length) {
        labels[k] = a[2];
        labels[k+1] = -1;
        cmd[j] = -1; labels[k+2] = j++;
      }
    } else if (eat(/^[dDgGhHlnNpPx]/)) {
      cmd[j++] = a[0];
    } else if (eat(/^[q=]/)) {
      if (k==2) { message="at most one address"; return; }
      cmd[j++] = a[0];
    } else if (eat(/^([rw])/)) {
      if (k==2) { message="at most one address"; return; }
      cmd[j++] = a[1];
      if (!eat(/^[ \t]*([^ \t].*)/)) { 
        message = "missing filename"; return;
      }
      cmd[j++] = a[1];
    } else if (eat(/^s([^\\])/)) {
      cmd[j++] = "s";
      if (-1 === (cmd[j++] = recomp(delim = a[1]))) { return; }
      if (-1 === (cmd[j++] = rhscomp(delim))) { return; }
      cmd[j] = -1;
      for (;;) {
        if (eat(/^g/)) { 
          f |= FLAG_G; 
        } else if (eat(/^[0-9]+/)) { 
          if (cmd[j] != -1) { message = "invalid flags"; return; }
          cmd[j] = a[0]; 
        } else if (eat(/^p/)) { 
          f |= FLAG_P; 
        } else if (eat(/^w (.*)/)) { 
          cmd[j+1] = a[1]; 
        } else { break; }
      }
      if (cmd[j] == 0 || (cmd[j] != -1 && 0 != (f&FLAG_G))) {
        message = "invalid flags"; return;
      }
      j += 2;
    } else if (eat(/^y([^\\])/)) {
      cmd[j++] = "y";
      if (-1 === (cmd[j++] = ycomp(a[1]))) { 
        message = "garbled command"; return;
      }
    } else if (eat(/^:/)) {
      if (!eat(/^[ \t]*([^ \t].*)/)) { message = "missing label"; return; }
      if (0 != f) { message="no address allowed"; return; }
      for (k = 0; k < labels.length; k += 3) {
        if (labels[k] == a[1]) {
          if (labels[k+1] == -1) {
            labels[k+1] = i;
            k = labels[k+2];
            while (k != -1) {
              j = cmd[k]; cmd[k] = i; k = j;
            }
            break;
          } else {
            message = "label already defined";
            return;
          }
        }
      }
      if (k >= labels.length) {
        labels[k] = a[1];
        labels[k+1] = i;
        labels[k+2] = -1;
      }
      j = i;
    } else if (eat(/^\{/)) {
      f ^= FLAG_NOT;
      cmd[j++] = "b";
      brackets[brdepth++] = j++;
      linebuf = ";" + linebuf;
    } else if (eat(/^\}/)) {
      if (brdepth <= 0) { 
        message = "mismatched }";
        return;
      }
      if (0 != f) { 
        message="no address allowed"; return;
      }
      cmd[brackets[--brdepth]] = j = i;
      j = i;
    } else {
      message = "unknown command";
      return;
    }
    cmd[i] = f;
    i = j;
    eat(/^[ \t]+/);
    if (linebuf === "") {
      if (lastline) { break; }
      getline();
    } else if (!eat(/^;/)) {
      message = "trailing garbage";
      return;
    }
  }
  // add an "end of cycle" command at the end of the code
  cmd[i] = 0;
  cmd[i+1] = "e";
  
  // label 0 stands for branch to end
  k = labels[2];
  while (k != -1) { 
    j = cmd[k]; cmd[k] = i; k = j;
  }
  // resolve labels
  for (k = 3; k < labels.length; k+=3) {
    if (labels[k+1] == -1) { 
      message = "unknown label \"" + labels[k] + "\""; 
      return;
    }
  }
  
  // check that all groups are closed
  if (brdepth > 0) {
    message = "missing closing }";
    return;
  }
    
  // that's it.
}

function ycomp (d) {
  var y = new Array();
  var k;
  var a;
  var b;
  y[0] = "?";
  for (k = 1; k < 256; k++) { y[k] = String.fromCharCode(k); }
  for (k = 0; ; k++) {
    if (k >= linebuf.length) { return -1; }
    if ((a = at(k)) == d) { break; }
    if (a == "\\") { k++; }
  }
  var l = k+1;
  
  for (k=0; ; k++) {
    if (k >= linebuf.length) { return -1; }
    if ((b = at(l)) == d) { break; }
    if ((a = at(k)) == d) { return -1; }
    if (a == "\\") {
      a = at(++k);
      if (a == "n" && a != d) { a = "\n"; }
    }
    if (b == "\\") {
      b = at(++l);
      if (b == "n" && b != d) { b = "\n"; }
    }
    y[a.charCodeAt(0)] = b;
    l++;
  }
  if (at(k) != d) { return -1; } 
  linebuf = linebuf.substr(l+1);
  b = y.join("");
  return b;
}

// quote a character for a bracket expression
function bq (c) {
  return c.replace(/[\]\\\-\^]/, "\\$&");
}

// compile a bracket expression
function brcomp () {
  var b = "";
  if (eat(/^\^/)) { b = "^"; }
  if (eat(/^[\-\]]/)) {
    c = a[0];
    b += "\\" + c;
  }
  var range = false; /* when '-' was encountered */
  var norange = false; /* '-' not allowed immediately after */
  while (linebuf !== "") {
    if (eat(/^\]/)) {
      if (range) { b += "\\-"; }
      return b + "]";
    } else if (eat(/^\[=/)) {
      if (range || !eat(/^(.)=\]/)) { break; }
      b += bq(a[1]);
      norange = true;
      continue;
    } else if (eat(/^\[\./)) {
      if (!eat(/^(.)\.\]/)) { break; }
    } else if (eat(/^\[:/)) {
      if (range || !eat(/^([^:]*):\]/)) { break; }
      switch(a[1]) {
      case "alnum": b += "0-9a-zA-Z"; break;
      case "alpha": b += "a-zA-Z"; break;
      case "blank": b += "\\t "; break;
      case "cntrl": b += "\\000-\\037"; break;
      case "digit": b += "0-9"; break;
      case "graph": b += "!-~"; break;
      case "lower": b += "a-z"; break;
      case "print": b += "\\t\\n\\f\\r -~"; break;
      case "punct": b += "!-/:-@\\[-`{-~"; break;
      case "space": b += "\\t\\n\\v\\f\\r "; break;
      case "upper": b += "A-Z"; break;
      case "xdigit": b += "0-9a-fA-F"; break;
      default: 
        message = "unknown equivalence class \"" + a[1] + "\""; return "";
      }
      norange = true;
      continue;
    } else if (norange && eat(/^(-)\]/)) {
      return b + "\\-]";
    } else if (eat(/^(-)/)) {
      if (norange) { break; }
      if (!range) {
        range = true;
        continue;
      }
    } else if (!sed.pflag && eat(/^\\n/)) {
      a[1] = "\n";
    } else if (!eat(/(.)/)) { break; }
    if (range) {
      if (c.charCodeAt(0) > a[1].charCodeAt(0)) { break; }
      b += "-" + bq(a[1]);
      range = false; norange = true;
    } else {
      c = a[1];
      b += bq(a[1]);
      norange = false;
    }    
  }
  message = "garbled bracket expression"; return "";
}

function recomp (d) {
  // b will hold the re in ERE syntax
  var b = "";
  var bra = new Array();
  var brastack = new Array();
  var depth = 0;
  var bracount = 0;
  var mult = false;  // true when multiplier allowed
  while (linebuf !== "") {
    if (at(0) == d) { 
      if (depth !== 0) { message = "unbalanced \\(...\\)"; return -1; }
      eat(/./);
      return b;
    }
    if (eat(/^\^/)) {
      if (b === "") { b = "^"; mult = false; }
      else { b += "\\^"; mult = true; }
    } else if (eat(/^\*/)) {
      if (b === "" || b == "^") { b += "\\*"; mult = true; }
      else if (!mult) { message = "multiple * or intervals"; return -1; }
      else { b += "*"; mult = false; }
    } else if (eat(/^[\]+?|{}()]/)) { 
      b += "\\" + a[0]; mult = true;
    } else if (eat(/^\$/)) {
      if (at(0) == d) { eat(/./); return b + "$"; }
      b += "\\$"; mult = true;
    } else if (eat(/^\./)) {
      b += "[\\x00-\\xff]"; mult = true;
    } else if (eat(/^\[/)) { 
      var br = brcomp();
      if (br === "") { return -1; }
      b += "[" + br; mult = true;
    } else if (eat(/^\\\(\*/)) {
      brastack[depth++] = bracount; bra[bracount++] = 0; // open
      b += "(\\*"; mult = true;
    } else if (eat(/^\\\(/)) {
      brastack[depth++] = bracount; bra[bracount++] = 0; // open
      b += "("; mult = false;
    } else if (eat(/^\\\)/)) {
      if (--depth < 0) { message = "too many \\)"; return -1; }
      bra[brastack[depth]] = 1; // closed
      b += ")"; mult = true;
    } else if (eat(/^\\([1-9])/)) {
      if (bra[a[1]-1] != 1) { message = "too early " + a[0]; return -1; }
      b += a[0]; mult = true;
    } else if (eat(/^\\(\{[0-9]+,?)\\\}/)) {
      if (!mult) { message = "multiple * or intervals"; return -1; }
      b += a[1] + "}"; mult = false;
    } else if (eat(/^\\\{([0-9]+),([0-9]+)\\\}/)) {
      if (!mult) { message = "multiple * or intervals"; return -1; }
      if (a[2] - a[1] < 0) { message = "invalid interval"; return -1; }
      b += "{" + a[1] + "," + a[2] + "}"; mult = false;
    } else if (!sed.pflag && eat(/^\\([+?])/)) {
      if (!mult) { message = "multiple * or intervals"; return -1; }
      b += a[1]; mult = false;
    } else if (!sed.pflag && eat(/^\\(\|)/)) {
      b += a[1]; mult = false;
    } else if (!sed.pflag && eat(/^\\x[a-fA-F0-9]{2}/)) {
      b += a[0]; mult = true;
    } else if (eat(/^(\\[\]\\n*.^$\[])/)||eat(/^\\(.)/)||eat(/^([^\\])/)) {
      b += a[1]; mult = true;
    } else { break; }
  }
  message = "garbled RE"; return -1;
}

function rhscomp (d) {
  // b will hold the rhs in javascript syntax
  var b = "";
  while (linebuf !== "") {
    if (at(0) == d) { 
      eat(/./);
      return b;
    } else if (eat(/^([^\\&$])/)) {
      b += a[1];
    } else if (eat(/^\\([1-9])/)||eat(/^(&)/)) {
      b += "$"+a[1];
    } else if (eat(/^\\$/)) {
      b += "\n"; 
      if (lastline) { break; } 
      getline();
    } else if (!sed.pflag && eat(/^\\n/)) {
      b += "\n";
    } else if (!sed.pflag && eat(/^\\x[0-9a-fA-F]{2}/)) {
      b += a[0];
    } else if (eat(/^\\([^$])/)) {
      b += a[1];
    } else if (eat(/^\\?\$/)) {
      b += "$$";
    } 
  }
  message = "garbled command"; return -1;
}

function textcomp () {
  var b = "";
  if (lastline) { message = "truncated command"; return -1; }
  getline();
  while (linebuf !== "") {
    if (eat(/^([^\\]+)/)||eat(/^\\(.)/)) {
      b += a[1];
    } else if (eat(/^\\$/)) {
      b += "\n";
      if (lastline) { message = "truncated command"; return -1; }
      getline();
    } 
  }
  return b + "\n";
}

//----------------------------------- exec ------------------------------



function match (re) {
  if (re === "") {
    re = lastre;
    // It is unconvenient to report an error in exec phase, so I just 
    // suppose the "last RE" does not match.
    if (re === "") { return false; }
  } else {
    lastre = re;
  }
  r.compile(re);
  return (null != (a = r.exec(linebuf)));
}

function selected () {                               
  var selectd = true;
  f = cmd[pc];

  if (0 != (f & FLAG_IN)) {
    if (0 != (f & FLAG_L2)) {
      if ( ((cmd[pc+2] != -1) && (lineno >= cmd[pc+2])) ||
         ((cmd[pc+2] == -1) && lastline) ) {
        f = cmd[pc] &= ~FLAG_IN;
      }
    } else {
      if (match(cmd[pc+2])) {
        f = cmd[pc] &= ~FLAG_IN;
      }
    }
    pc += 3;
  } else if (0 != (f & (FLAG_L1R1))) {
    if (0 != (f & FLAG_L1)) {
      if (cmd[pc+1] == -1) {
        pc += (0 != (f & FLAG_L2R2)) ? 3 : 2;   
        return (0 != (f & FLAG_NOT)) ? !lastline : lastline;
      } 
      selectd = (lineno == cmd[pc+1]);
    } else {
      selectd = match(cmd[pc+1]);
    }
    if (selectd && 
      ((0 != (f & FLAG_R2)) || 
        ((0 != (f & FLAG_L2)) && 
          ! (cmd[pc+2] != -1 && lineno >= cmd[pc+2])))) {
      f = cmd[pc] |= FLAG_IN;
    }
    pc += (0 != (f & FLAG_L2R2)) ? 3 : 2;   
  } else { pc++; }
  return (0 != (f & FLAG_NOT)) ? !selectd : selectd;
}

function subst (f) {
  var did = false;
  if (!match(cmd[pc])) { return; }
  if ((0==(f&FLAG_G)) && (cmd[pc+2] <= 1)) {
    // easy case, neither /g nor /n flags
    linebuf = linebuf.replace(r, cmd[pc+1]);
    did = true;
  } else {
    // have another regexp hold the regexp with flag g
    var count = cmd[pc+2];
    var g = new RegExp();
    g.compile(lastre, "g");
    
    var b = "";
    var lastbeg = 0;
    var lastend = -1;
    var advance = 1;
    while (lastend + advance <= linebuf.length) {
      g.lastIndex = lastend + advance;
      if (null == (a = g.exec(linebuf))) { break; }
      advance = 0;
      if (a[0].length === 0) {
        advance = 1;
        if (a.index == lastend) { continue; }
      }
      lastend = a.index + a[0].length;
      if ((0!=(f&FLAG_G)) || (--count === 0)) {
        b += linebuf.substr(lastbeg, a.index - lastbeg);
        b += a[0].replace(r, cmd[pc+1]);
        lastbeg = a.index + a[0].length;
        did = true;
        if (count === 0) { break; }
      }
    }
    b += linebuf.substr(lastbeg);
    linebuf = b;   
  }
  if (did) {
    tflag = true;
    if (0 != (f&FLAG_P)) { sed.out(linebuf + "\n"); }
    if ("" !== cmd[pc+3]) { sed.write(linebuf + "\n", cmd[pc+3]); }
  }
}

function ell () {
  var i, k, c, b = "";
  for (i = 0; i < linebuf.length; i++) {
    c = at(i);
    if (-1 != (k = "\\\007\b\f\l\r\t\v".indexOf(c))) {
      k = "\\" + "\abflrtv".charAt(k);
    } else if (c == "\n") {
      sed.out(b + c); b = k = "";
    } else if (-1 != c.search(/[ -~]/)) { 
      k = c; 
    } else { 
      c = c.charCodeAt(0);  
      k = "\\" + (c >> 6) + ((c >> 3) & 7) + (c & 7);
    }
    if (b.length + k.length >= 72) { sed.out(b + "\\\n"); b = ""; }
    b += k;
  }
  sed.out(b + "$\n");
}


function appout () {
  var b, i;
  for (i = 0; i < appindex; i++) {
    b = appends[i];
    if (cmd[b++] == "r") {
      sed.out(sed.read(cmd[b]));
    } else {
      sed.out(cmd[b]);
    }
  }
  appends = [];
  appindex = 0;
}

function sedexec (input) {
  holdbuf = "";
  lastre = "";
  r = new RegExp();
  
  lineinit(input);
  
  while (!lastline) {
    appends = [];
    appindex = 0;
    var jumpcnt = 0;
    getline(); tflag = false;
    
    pc = 0;
    var del = false;
    while (!del) {
      
      // skip commands if they are not selected
      while (!selected()) {
        c = cmd[pc++];
        if (c == "s") { pc += 4; }
        else if (-1 != "abcirtwy".indexOf(c)) { pc++; }
      }
        
      switch (cmd[pc++]) {
      case "a": 
      case "r": 
        appends[appindex++] = -1 + pc++; 
        break;
      case "t": 
        if (!tflag) { pc++; break; } 
        tflag = false; 
        if (jumpcnt++ > sed.jumpmax) { 
          sed.err("too many jumps.\n"); return; 
        }
        pc = cmd[pc];
        break;
      case "b": 
        if (jumpcnt++ > sed.jumpmax) { 
          sed.err("too many jumps.\n"); return; 
        }
        pc = cmd[pc];
        break;
      case "c": 
        if (0 == (f&FLAG_IN)) { sed.out(cmd[pc]); }
        appout(); del = true; break;
      case "d": appout(); del = true; break;
      case "D": 
        appout(); 
        i = linebuf.indexOf("\n"); 
        if (-1 == i) { del = true; break; }
        linebuf = linebuf.substr(i+1);
        if (jumpcnt++ > sed.jumpmax) { 
          sed.err("too many jumps.\n"); return; 
        }
        pc = 0;
        break;
      case "e": 
        if (!nflag) { sed.out(linebuf + "\n"); }
        appout(); 
        del = true;
        break;
      case "g": linebuf = holdbuf; break;
      case "G": linebuf += "\n" + holdbuf; break;
      case "h": holdbuf = linebuf; break;
      case "H": holdbuf += "\n" + linebuf; break;
      case "i": sed.out(cmd[pc++]); break;
      case "l": ell(); break;
      case "n": 
        if (!nflag) { sed.out(linebuf + "\n"); }
        appout(); 
        if (lastline) { return; }
        getline(); jumpcnt = 0; tflag = false;
        break;
      case "N": 
        if (lastline) { return; }
        b = linebuf; 
        getline(); jumpcnt = 0; tflag = false;
        linebuf = b + "\n" + linebuf;
        break;
      case "p": sed.out(linebuf + "\n"); break;
      case "P": 
        i = linebuf.indexOf("\n"); 
        if (-1 == i) { sed.out(linebuf + "\n"); }
        else { sed.out(linebuf.substr(0, i+1)); }
        break;
      case "q":
        if (!nflag) { sed.out(linebuf + "\n"); }
        appout(); 
        return;
      case "s": subst(f); pc += 4; break;
      case "w": sed.write(linebuf + "\n", cmd[pc++]); break;
      case "x": b = linebuf; linebuf = holdbuf; holdbuf = b; break;
      case "y": 
        y = cmd[pc++];
        b = linebuf; linebuf = "";
        for (j = 0; j < b.length; j++) {
          linebuf += y.charAt(b.charCodeAt(j));
        }
        break;
      case "=": sed.out(lineno + "\n"); break;
      }
    }
  }
}

  var compiled = false;

function compile (script) {
  message = "";
  sedcomp(script);
  if (message !== "") {
    sed.err("line " + lineno + ": " + message + "\n");
    sed.err(savebuf+"\n");
    var n = savebuf.length - linebuf.length;
    sed.err(((savebuf.substr(0, n)).replace(/[^\t]/g, " "))+"^\n");
    compiled = false;
  } else {
    compiled = true;
  }
}

function execute (input) {
  if (!compiled) { return; }
  if (input === "") {
    sed.err("input is empty\n");
  } else {
    sedexec(input);
  }
}

sed = function (script, input) {
  compile(script);
  execute(input);
};

  sed.jumpmax = 10000; 

function entityify (s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
  sed.out = function(s) { document.write(entityify(s)); };
  sed.err = function(s) { document.write("<i>" + entityify(s) + "</i>"); };
  sed.read = function(f) { return "<<<contents of file " + f + ">>>\n"; };
  sed.write = function(str, fname) { };
  sed.nflag = sed.pflag = false;

  sed.compile = compile;
  sed.execute = execute;
  
  compiled = false;
  
})(sed);



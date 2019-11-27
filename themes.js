// cookies.js
// Derived from the Bill Dortch code at http://www.hidaho.com/cookies/cookie.txt

var today = new Date();
var expiry = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
const session = require('electron').remote.session.defaultSession;

function getCookieVal (offset) {
	var endstr = session.cookie.indexOf (";", offset);
	if (endstr == -1) { endstr = session.cookie.length; }
	return unescape(session.cookie.substring(offset, endstr));
	}

function GetCookie (name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = session.cookie.length;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		if (session.cookie.substring(i, j) == arg) {
			return getCookieVal (j);
			}
		i = session.cookie.indexOf(" ", i) + 1;
		if (i == 0) break; 
		}
	return null;
	}

function DeleteCookie (name,path,domain) {
	if (GetCookie(name)) {
		session.cookie = name + "=" +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		"; expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
	}

function SetCookie (name,value,expires,path,domain,secure) {
	session.cookie = name + "=" + escape (value) +
    ((expires) ? "; expires=" + expires.toGMTString() : "") +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    ((secure) ? "; secure" : "");
	}
	
//
// end of cookie.js
//

var THEME_KEY = "haf_theme";	// this key is used to store the selected theme.
var THEMES_FOLDER_PATH = "./css/";
var DEFAULT_THEME = "theme_default";

function updateTheme() {
	var s = GetCookie(THEME_KEY);
	if (s == null) s = DEFAULT_THEME;
	var t = document.getElementById('theme');
	t.setAttribute('href', THEMES_FOLDER_PATH + s + '.css'); 
	// document.writeln('<link href="'+THEMES_FOLDER_PATH+s+'.css" type="text/css" rel="stylesheet">');
}

function setTheme() {
	DeleteCookie(THEME_KEY);					
	SetCookie(THEME_KEY, document.getElementById('selectTheme').value);
	// self.location = self.location;	// simple trick to reload the current document
	updateTheme();
}
	
updateTheme();
	



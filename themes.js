
// const Store = require('electron-store');
// const store = new Store();
	
var THEME_KEY = "haf_theme";	// this key is used to store the selected theme.
var THEMES_FOLDER_PATH = "./css/";
var DEFAULT_THEME = "theme_default";

function updateTheme() {
	var s = store.get(THEME_KEY);
	if (s == null) s = DEFAULT_THEME;
	var t = document.getElementById('theme');
	t.setAttribute('href', THEMES_FOLDER_PATH + s); 
	// document.writeln('<link href="'+THEMES_FOLDER_PATH+s+'.css" type="text/css" rel="stylesheet">');
}

function setTheme() {					
	store.set(THEME_KEY, document.getElementById('selectTheme').value);
	// self.location = self.location;	// simple trick to reload the current document
	updateTheme();
}
	
updateTheme();
	



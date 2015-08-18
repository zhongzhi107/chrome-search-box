// chrome.browserAction.onClicked.addListener(function(tab) {
	// No tabs or host permissions needed!
	//console.log('Turning ' + tab.url + ' red!');
	// chrome.browserAction.setTitle({title: 'Baidu'});
	// chrome.browserAction.setIcon({path: 'icons/baidu-white.png'});
	//localStorage.setItem('engine', 'baidu');
	// alert(localStorage.getItem('engine'));
	// alert('1111');
	//chrome.tabs.executeScript(null, {file: "content_script.js"});
	// chrome.tabs.executeScript({
	// 	code: 'document.body.style.backgroundColor="red"'
	// });
// });

//alert(chrome.i18n.getMessage('baidu'));
// chrome.commands.onCommand.addListener(function(command) {
// 	//if (command === 'toggle') {
// 		alert('OK');
// 	//}
// /*Your stuff lies here*/
// });

var engineList = {
  Google: 'http://www.google.com/search?q=%s',
	Baidu: 'https://www.baidu.com/s?wd=%s',
  GitHub: 'https://github.com/search?q=%s',
  npm: 'https://www.npmjs.com/search?q=%s'
};

var defaultEngine = 'Baidu';

var ENGINE_LIST = 'CHROME_SEARCH_BOX_ENGINE_LIST';
var DEFAULT_ENGINE = 'CHROME_SEARCH_BOX_DEFAULT_ENGINE';

if (!localStorage.getItem(ENGINE_LIST)) {
	localStorage.setItem(ENGINE_LIST, JSON.stringify(engineList));
} else {
	engineList = JSON.parse(localStorage.getItem(ENGINE_LIST));
}

if (!localStorage.getItem(DEFAULT_ENGINE)) {
	localStorage.setItem(DEFAULT_ENGINE, defaultEngine);
} else {
	defaultEngine = localStorage.getItem(DEFAULT_ENGINE);
}

function navigate(url) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.update(tabs[0].id, {url: url});
	});
}

function resetDefaultSuggestion() {
	updateDefaultSuggestion('');
}

function updateDefaultSuggestion(text) {
	chrome.omnibox.setDefaultSuggestion({
		// content: engineList[defaultEngine].replace('%s', encodeURIComponent(text)),
		description: chrome.i18n.getMessage('omnibox_suggestion', [defaultEngine, text])
	});
}

function updateSuggestion(text, suggest) {
	var results = [];
	for(var key in engineList) {
		if (key !== defaultEngine) {
			results.push({
				content: engineList[key].replace('%s', encodeURIComponent(text)),
				description: chrome.i18n.getMessage('omnibox_suggestion', [key, text])
			});
		}
	}
	suggest(results);
	updateDefaultSuggestion(text);
}

chrome.omnibox.onInputStarted.addListener(function() {
	resetDefaultSuggestion();
});

chrome.omnibox.onInputCancelled.addListener(function() {
	resetDefaultSuggestion();
});

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
	updateSuggestion(text, suggest);
});

// Press Enter in address input
chrome.omnibox.onInputEntered.addListener(function(text) {
	if (text) {
		// handle default suggestion
		if (!/^http/.test(text)) {
			text = engineList[defaultEngine].replace('%s', encodeURIComponent(text));
		}
		navigate(text);
	}
});

'use strict';

var ENGINE_LIST = 'CHROME_SEARCH_BOX_ENGINE_LIST';
var DEFAULT_ENGINE = 'CHROME_SEARCH_BOX_DEFAULT_ENGINE';

var engineList = JSON.parse(localStorage.getItem(ENGINE_LIST));
var defaultEngine = localStorage.getItem(DEFAULT_ENGINE);

var engineSelect = document.getElementById('engine');
var keywordInput = document.getElementById('keyword');

function search() {
  if (keywordInput.value) {
    var element = engineSelect;
    var url = element
      .options[element.selectedIndex]
      .value
      .replace('%s', encodeURIComponent(keywordInput.value));

    if (tabURL === 'chrome://newtab/') {
      chrome.tabs.update(null, {
        url: url
      });
    } else {
      chrome.tabs.create({
        url: url,
        selected: true
      });
    }
  }
};

// 得到当前tab的url，chrome://newtab/
var tabURL = null;
chrome.tabs.getSelected(function(tab) {
  tabURL = tab.url;
});

var i = 0;
for(var key in engineList) {
  var option = new Option(key, engineList[key]);
  engineSelect.add(option);
  if (key === defaultEngine) {
    engineSelect.options[i].selected = true;
  }
  i++;
}

engineSelect.addEventListener('change', search, false);

keywordInput.addEventListener('keydown', function(event) {
  if (event.keyCode === 13) {
    search();
  }
}, false);

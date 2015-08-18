var ENGINE_LIST = 'CHROME_SEARCH_BOX_ENGINE_LIST';
var DEFAULT_ENGINE = 'CHROME_SEARCH_BOX_DEFAULT_ENGINE';
var engineList = JSON.parse(localStorage.getItem(ENGINE_LIST));
var defaultEngine = localStorage.getItem(DEFAULT_ENGINE);

function setDefaultEngine(event) {
  var element = event.target;
  var key = element.parentNode.parentNode.id;
  localStorage.setItem(DEFAULT_ENGINE, key);
}

function addEngine(event) {
  var name = document.getElementById('engineName').value.trim();
  var url = document.getElementById('engineURL').value.trim();
  if (name && url) {
    engineList[name] = url;
  }
  save();
  render();
}

function deleteEngine(event) {
  event.preventDefault();
  var element = event.target;
  var key = element.parentNode.parentNode.id;
  if (confirm(chrome.i18n.getMessage('popup_delete_confirm'))) {
    delete engineList[key];
    if (key === defaultEngine) {
      localStorage.removeItem(DEFAULT_ENGINE);
    }
    save();
    render();
  }
}

function save() {
  localStorage.setItem(ENGINE_LIST, JSON.stringify(engineList));
}

function render() {
  var html = [];
  for(var key in engineList) {
    var checked = key === defaultEngine ? 'checked' : '';
    html.push([
      '<tr id="' + key + '">',
        '<td><a href="#" class="del">' + chrome.i18n.getMessage('popup_delete_label') + '</a></td>',
        '<td><input type="radio" name="defaultEngine" ' + checked + ' class="set-default"> ' + key + '</td>',
        '<td>' + engineList[key] + '</td>',
      '</tr>'
    ].join(''));
  }
  html.push([
    '<tr>',
      '<td><input type="button" id="addEngine" value="' + chrome.i18n.getMessage('popup_add_button') + '"></td>',
      '<td><input id="engineName" placeholder="' + chrome.i18n.getMessage('popup_name_placeholder') + '"></td>',
      '<td><input id="engineURL" placeholder="' + chrome.i18n.getMessage('popup_url_placeholder') + '"></td>',
    '</tr>'
  ].join(''));
  document.getElementById('list').innerHTML = html.join('');

  // bind events
  var dels = document.querySelectorAll('.del');
  for (var i = 0, length = dels.length; i < length; i++) {
    dels[i].addEventListener('click', deleteEngine, false);
  }

  var setDefaults = document.querySelectorAll('.set-default');
  for (var i = 0, length = setDefaults.length; i < length; i++) {
    setDefaults[i].addEventListener('click', setDefaultEngine, false);
  }

  document.getElementById('addEngine').addEventListener('click', addEngine,false);
  document.querySelector('h3').innerHTML = chrome.i18n.getMessage('popup_title');
}

render();

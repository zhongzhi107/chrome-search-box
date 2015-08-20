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
  event.preventDefault();
  var name = document.getElementsByClassName('engineName')[0].value.trim();
  var url = document.getElementsByClassName('engineURL')[0].value.trim();
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
  console.log(chrome); //000000000000
  html.push([
    '<tr>',
      '<th class="o">' + chrome.i18n.getMessage('popup_operation_thead') + '</th>',
      '<th class="name">' + chrome.i18n.getMessage('popup_name_thead') + '</th>',
      '<th class="url">' + chrome.i18n.getMessage('popup_url_thead') + '</th>',
    '</tr>'
  ].join(''));
  for(var key in engineList) {
    console.log(defaultEngine);
    console.log(key + '\t' + defaultEngine);
    var checked = key === defaultEngine ? 'checked' : '';
    html.push([
      '<tr id="' + key + '">',
        '<td><a href="#" class="btn del">' + chrome.i18n.getMessage('popup_delete_label') + '</a></td>',
        '<td class="engine"><label><input type="radio" name="defaultEngine" ' + checked + ' class="set-default"> ' + key + '</label></td>',
        '<td>' + engineList[key] + '</td>',
      '</tr>'
    ].join(''));
  }
  html.push([
    '<tr>',
      '<td><a href="#" class="btn add" id="addEngine">' + chrome.i18n.getMessage('popup_add_button') + '</a></td>',
      '<td><input class="engineName" placeholder="' + chrome.i18n.getMessage('popup_name_placeholder') + '"></td>',
      '<td><input class="engineURL" placeholder="' + chrome.i18n.getMessage('popup_url_placeholder') + '"></td>',
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



function click(e) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

     // since only one tab should be active and in the current window at once
     // the return variable should only have one entry
     var activeTab = tabs[0];
     var activeTabId = activeTab.id; // or do whatever you need
     chrome.tabs.sendMessage(activeTabId, { type: e.target.id }, function(response) {});
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});

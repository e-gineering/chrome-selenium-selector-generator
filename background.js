var enabled = false;
chrome.browserAction.setIcon({path: "icon.png"});

chrome.browserAction.onClicked.addListener(function(tab){
	enabled = !enabled;
	var path = "icon.png";
	if(enabled){
		path = "icon-on.png";
	}

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {enabled: enabled}, function(response) {});
	});

	chrome.browserAction.setIcon({path: path});
});
if(chrome.storage){
	chrome.storage.sync.get("enabled", function(value){
		var path = "icon.png";
		if(value.enabled){
			path = "icon-on.png";
		}
		chrome.browserAction.setIcon({path: path});
	});
}

chrome.browserAction.onClicked.addListener(function(tab){
	chrome.storage.sync.get("enabled", function(value){
		console.log(value);
		var enabled = !value.enabled;
		chrome.storage.sync.set({"enabled": enabled}, function(){
			var path = "icon.png";
			if(enabled){
				path = "icon-on.png";
			}
			chrome.browserAction.setIcon({path: path});
		});
	});
});
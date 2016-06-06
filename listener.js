document.addEventListener('click', function(e){
	chrome.storage.sync.get("enabled", function(value){
		if(value.enabled){
			var selectors = {};
			e.preventDefault();
			//listen for click events and select src element
			var sourceElement = e.srcElement;
			//check if element has an id tag
			if(sourceElement.id){
				setIDSelector(sourceElement, selectors);
			}
			//if no id, generate xpath expression
			else{
				setXPATHSelector(sourceElement, selectors);
			}
			// generate selection by class
			if(sourceElement.className && sourceElement.className.split(" ").length === 1){
				setClassNameSelector(sourceElement, selectors);
			}
			//generate selection by css selector traits
			setCssSelector(sourceElement, selectors);

			//generate selection by element name
			if(sourceElement.name){
				setNameSelector(sourceElement, selectors);
			}

			// determine the best selector based on selector rankings
			determineBestSelector(selectors);
			// copy find by tag to clipboard
			copyToClipboard(selectors.recommendedSelector);

			console.log(selectors);
		}
	});
});

var setIDSelector = function(sourceElement, collector){
	collector.id = {
		selector: sourceElement.id,
		tag: '@FindBy(id="' + sourceElement.id + '")',
		element: document.getElementById(sourceElement.id)
	};

	collector.id.selected = collector.id.element === sourceElement;
}

var setNameSelector = function(sourceElement, collector){
	collector.name = {
		selector: sourceElement.name,
		tag: '@FindBy(name="' + sourceElement.name + '")',
		element: document.getElementsByName(sourceElement.name)[0]
	};

	collector.name.selected = collector.name.element === sourceElement;
}

var setXPATHSelector = function(sourceElement, collector){
	var parent;
	var element = sourceElement;
	var xpath = "";
	while(element.id === '' && element.tagName !== 'HTML'){
		parent = element.parentNode;
		var index;
		var counter = 0;
		for(var i = 0; i < parent.children.length; i++){
			if(parent.children[i].tagName === element.tagName){
				counter += 1;
				if(parent.children[i] === element){
					index = counter;
				}
			}
		}
		if(xpath === ""){
			if(counter === 1){
				xpath = element.tagName;
			}else{
				xpath = element.tagName + "["+index+"]";
			}
		}else{
			if(counter === 1){
				xpath = element.tagName + "/" + xpath;
			}else{
				xpath = element.tagName + "["+index+"]" + "/" + xpath;
			}
		}
		element = element.parentNode;
	}
	if(element.tagName === 'HTML'){
		xpath = "html/" + xpath.toLowerCase();
	}else{
		xpath = "//" + element.tagName + "[@id='"+element.id+"']/" + xpath.toLowerCase();
	}
	collector.xpath = {};
	collector.xpath.selector = xpath;
	collector.xpath.tag = '@FindBy(xpath="'+ xpath + '")';
	collector.xpath.element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	collector.xpath.selected = collector.xpath.element === sourceElement;
}

var setClassNameSelector = function(sourceElement, collector){
	collector.className = {
		selector: sourceElement.className,
		tag: '@FindBy(className="'+ sourceElement.className + '")',
		element: document.getElementsByClassName(sourceElement.className)[0]
	};

	collector.className.selected = collector.className.element === sourceElement
}

var setCssSelector = function(sourceElement, collector){
	var tagName = sourceElement.tagName;
	var id = sourceElement.id;
	var classNames = sourceElement.className;
	var cssSelector = "";
	if(tagName){
		if(sourceElement.getAttribute("name")){
			cssSelector += tagName.toLowerCase() + "[name='" + sourceElement.getAttribute("name") +"']";
		}else{
			cssSelector += tagName.toLowerCase();
		}
	}
	if(id){
		cssSelector += "#"+id;
	}
	if(classNames){
		var classes = classNames.split(" ");
		classes.forEach(function(name){
			cssSelector += "."+name;
		});
	}
	if(cssSelector !== "" && cssSelector !== tagName.toLowerCase()){
		collector.css = {
			selector: cssSelector,
			tag: '@FindBy(css="' + cssSelector + '")',
			element: document.querySelector(cssSelector)
		};

		collector.css.selected = collector.css.element === sourceElement;
	}		
}

var determineBestSelector = function(collector){
	if(collector["id"] && collector["id"].selected){
		collector.recommendedSelector = collector.id.tag;
	}else if(collector["name"] && collector["name"].selected){
		collector.recommendedSelector = collector.name.tag;
	}else if(collector["className"] && collector["className"].selected){
		collector.recommendedSelector = collector.className.tag;
	}else if(collector["css"] && collector["css"].selected){
		collector.recommendedSelector = collector.css.tag;
	}else if(collector["xpath"] && collector["xpath"].selected){
		collector.recommendedSelector = collector.xpath.tag;
	}
}
var copyToClipboard = function(text){
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
    console.log("Tag " + text + " copied to your clipboard.");
}

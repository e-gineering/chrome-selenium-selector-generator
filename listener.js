var enabled = false;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    enabled = !enabled;
});

document.addEventListener('click', function(e){
	if(enabled){
		var selectors = {};
		e.preventDefault();
		//listen for click events and select src element
		var sourceElement = e.srcElement;
		//check if element has an id tag
		if(sourceElement.id){
			selectors.id = {};
			selectors.id.selector = sourceElement.id;
			selectors.id.tag = '@FindBy(id="' + sourceElement.id + '")';
			selectors.id.element = document.getElementById(sourceElement.id);
			selectors.id.selected = selectors.id.element === sourceElement;
		}
		//if no id, generate xpath expression
		else{
			var parent;
			var xpath = "";
			var element = sourceElement;
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
				xpath = "//*[@id='"+element.id+"']/" + xpath.toLowerCase();
			}
			selectors.xpath = {};
			selectors.xpath.selector = xpath;
			selectors.xpath.tag = '@FindBy(xpath="'+ xpath + '")';
			selectors.xpath.element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			selectors.xpath.selected = selectors.xpath.element === sourceElement;
		}
		// generate selection by class
		if(sourceElement.className && sourceElement.className.split(" ").length === 1){
			selectors.className = {};
			selectors.className.selector = sourceElement.className;
			selectors.className.tag = '@FindBy(className="'+ sourceElement.className + '")';
			var elementsWithClassName = document.getElementsByClassName(sourceElement.className);
			selectors.className.element = document.getElementsByClassName(sourceElement.className)[0];
			selectors.className.selected = selectors.className.element === sourceElement;
		}
		//generate selection by css selector traits
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
			selectors.css = {};
			selectors.css.selector = cssSelector;
			selectors.css.tag = '@FindBy(css="' + cssSelector + '")';
			selectors.css.element = document.querySelector(cssSelector);
			selectors.css.selected = selectors.css.element === sourceElement;
		}

		if(selectors["id"] && selectors["id"].selected){
			selectors.recommendedSelector = "id";
		}else if(selectors["className"] && selectors["className"].selected){
			selectors.recommendedSelector = "className";
		}else if(selectors["css"] && selectors["css"].selected){
			selectors.recommendedSelector = "css";
		}else if(selectors["xpath"] && selectors["xpath"].selected){
			selectors.recommendedSelector = "xpath";
		}

		console.log(selectors);
	}
});
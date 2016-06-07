# chrome-selenium-selector-generator
This chrome extension helps to determine unique Selenium WebElement @FindBy tags that can be used with a PageFactory to initialize elements on a web page. It listens for user clicks on a web page to generate unique selectors for the click's source element and suggests the best method to find that element in a page model annotation like below:

```java
@FindBy(id=”addButton”)
public WebElement addButton;
```

# What it does
The extension processes the clicked element to determine the following selectors for that specific element:

1. ID
2. Name
3. ClassName
4. CSS
5. Xpath

Once those have been determined, it selects the best available unique option for selection based on the rankings above and prints the results to the console. The specifc @FindBy tag is also copied directly to the clipboard.

#Setup

1. Download and unzip.
2. Open Google Chrome and navigate to chrome://extensions.
3. Click the "Developer mode" check box.
4. Click "Load unpacked extension..." and point it to the unzipped folder.
5. The icon has now been added to your browser bar. Click it to turn on the selector.
6. Right click on the page you are inspecting and select "Inspect". Open the console tab.
7. Click away!

// Console log does not work here.
console.log("background.js ran");

//chrome.runtime.onInstalled.addListener(() => {
	// default state goes here
	// this runs ONE TIME ONLY (unless the user reinstalls your extension)
//});

// Listen for messages
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting === "hello")
      sendResponse({farewell: "goodbye"});
  }
);


let active = true;

// Called when the extension UI button is clicked
chrome.action.onClicked.addListener((tab) => {
	if (active) {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ['foreground.js']
		})
		.then(() => {
			chrome.action.setIcon({path: 'images/icon48_on.png', tabId: tab.id}); // Change icon for current tab only
			console.log("background.js executeScript injected the foreground script");
		})
		.catch(err => console.log('executeScript error:', err));
	} 
});

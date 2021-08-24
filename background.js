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
			//console.log("background.js executeScript injected the foreground script");
		})
		.catch(err => console.log('executeScript error:', err));
	} 
});

// Called when the extension UI button is clicked
chrome.action.onClicked.addListener((tab) => {
		chrome.scripting.executeScript({
			target: { tabId: tab.id, allFrames: true },
			files: ['foreground.js']
		})
		.then(() => {
			chrome.action.setIcon({path: 'images/icon48_on.png', tabId: tab.id}); // Change icon for current tab only
		})
		.catch(err => console.log('executeScript error:', err));
});

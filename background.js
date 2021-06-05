//console.log("background.js ran");

chrome.runtime.onInstalled.addListener(() => {
	// default state goes here
	// this runs ONE TIME ONLY (unless the user reinstalls your extension)
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			files: ['foreground.js']
		})
		.then(() => {
			console.log("executeScript injected the foreground script");
		})
		.catch(err => console.log('executeScript error:', err));
	}
});


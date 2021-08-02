console.log('options_script called');
/*
function clickExtensionIcon(tab) {
	console.log(000);
    
    if (active) {
        chrome.action.onClicked.setBadgeBackgroundColor({color: '#999'});
		console.log(111);
        active = false;
    } else {
        chrome.action.onClicked.setBadgeBackgroundColor({color: '#0f0'});
        active = true;
		console.log(222);
    }
}

clickExtensionIcon(tab);

//let active = false; 
chrome.action.onClicked.setBadgeBackgroundColor({color: '#0f0'});

chrome.action.onClicked.addListener((tabId, changeInfo, tab) => {
	console.log('options_script chrome.action.onClicked called');

	if (changeInfo.status === 'complete') {
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			files: ['foreground.js']
		})
		.then(() => {
			chrome.action.onClicked.setBadgeBackgroundColor({color: '#999'});
			console.log("executeScript injected the foreground script");
		})
		.catch(err => console.log('executeScript error:', err));
	}
});
*/
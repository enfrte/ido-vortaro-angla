console.log("contentScript.js ran");

// message passing example - sends to all
chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);  
});

ido_data = {}; // See contentScript.js
url = chrome.runtime.getURL('db/20210525_ido_min.json'); // returns database url

fetch(url) // Fetch the database
.then((response) => response.json()) // assuming file contains json
.then((json) => {
	ido_data = json;
	document.addEventListener('mouseup', handleSelection, false);
});

// Kick things off
appendIdoPopupStyle();
createIdoLightBox();

/**
 * FUNCTIONS START 
 */

// Process the text selection 
function handleSelection() {
	//debugger;
	let search = window.getSelection().toString().trim().toLowerCase();
	//search = 'abandonar'; // exact match for debugging 
	//search = 'abandono'; // alternative match for debugging 

	if (search === "") { // 2nd click of double click gets the selected text, or just paint text
		closeIdoLightBox(); // Close results output before looking up
		return; 
	}

	let result = '';
	let alternativeResults = [];
	let basicEndings = ['o','a','e','i','ar','as'];
	let searchWithoutEnding = '';

	// Incase nothing is found, check for match without the basic ending
	basicEndings.some((ending) => {
		// Parse the search string into something that can be checked against the basicForm
		// Search: desboltagas -> desboltag
		if (search.slice(-1) == ending) { // a,e,i,o
			searchWithoutEnding = search.slice(0,-1); // bakteria -> bakteri
			return true;
		}
		if (search.slice(-2) == ending) { // ar,as
			searchWithoutEnding = search.slice(0,-2); // desboltagar -> desboltag
			return true;
		}
	});

	// Main loop - search the dictionary
	for (const key in ido_data) {
		// Unparse the key words, like anti-bakteri.a to antibakteria
		let unparsedKey = key.replace(/\./g, ''); // replace .
		unparsedKey = unparsedKey.replace(/\-/g, ''); // replace -
		
		// Check for an exact match
		if (unparsedKey == search) {
			result = {key: key, meaning: ido_data[key].meaning};
			break; // quit the search if you are happy with this
		}

		// We can also collect non exact matches
		let keyWithoutEnding = key.slice(0, key.lastIndexOf(".")); // des.bolt.ag.ar -> des.bolt.ag
		keyWithoutEnding = keyWithoutEnding.replace(/\./g, ''); // replace . so des.bolt.ag -> desboltag
		// If searchWithoutEnding is set, try search for that
		if (searchWithoutEnding !== '' && searchWithoutEnding == keyWithoutEnding) {
			alternativeResults.push({key: key, meaning: ido_data[key].meaning});
		}
	}
	//console.log("Result 1", result);
	//console.log("Result 2", alternativeResults);
	
	// Call output display 
	showIdoLightBox({
		result: result,
		alternativeResults: alternativeResults
	});
}

function appendIdoPopupStyle() {
    let lightBoxStyle = "#IdoLightBox {display:none; background:#fff; opacity:1; position:fixed; top:10%; left:3%; width:300px; height:60px; z-index:1000; border:2px solid #000;margin: 0px; padding:10px; padding-top:5px;}";
    let dlStyle = "#IdoLightBox > dl {margin: 0px; padding:0px;}";
    let dtStyle = "#IdoLightBox > dl > dt {margin: 0px; padding:0px; padding-top:5px; font-family:'Times New Roman',serif; font-size:16px; color:black; line-height: 1.0; font-weight: bold; text-decoration: none;}";
    let ddStyle = "#IdoLightBox > dl > dd {margin: 0px; padding:0px; padding-top:2px; font-family:'Times New Roman',serif; font-size:16px; color:black; line-height: 1.0; font-weight: normal; text-decoration: none;}";
	let resultTitle = "#IdoLightBox > h5 {font-family: Arial, Helvetica, sans-serif; color:black;}";
    let css = document.createElement('style');

	if (css.styleSheet) {
        css.styleSheet.cssText = styles;
    } else {
        css.appendChild(document.createTextNode(lightBoxStyle));
        css.appendChild(document.createTextNode(dlStyle));
        css.appendChild(document.createTextNode(dtStyle));
        css.appendChild(document.createTextNode(ddStyle));
		css.appendChild(document.createTextNode(resultTitle));
    }
    document.body.appendChild(css);
}

function createIdoLightBox() {
    let lightBox = document.createElement("div");
    lightBox.setAttribute("id", "IdoLightBox");
    document.body.appendChild(lightBox);
}

// The results output
function showIdoLightBox(response) {
	//debugger;
    if (!response) console.log('Error: Missing response');
	
	let lightBoxDiv = document.getElementById('IdoLightBox');

	// Remove any old entries
	while (lightBoxDiv.hasChildNodes()) {
		lightBoxDiv.removeChild(lightBoxDiv.lastChild);
	}

	lightBoxDiv.style.display = 'block';
	lightBoxDiv.style.height = 'auto';

	let defintionList = response;
	let resultTemplate = '';
	let alternativeResultsTemplate = '';

	// Main result - type {}
	if (defintionList.result !== '') {
		resultTemplate = 
			`<dt>${defintionList.result.key}</dt>
				<dd>${defintionList.result.meaning}</dd>`;
	}

	// Alternative results - type []
	for (let i = 0; i < defintionList.alternativeResults.length; i++) {
		alternativeResultsTemplate += 
			`<dt>${defintionList.alternativeResults[i].key}</dt>
				<dd>${defintionList.alternativeResults[i].meaning}</dd>`;
	}

	// Compose output
	if (resultTemplate !== '') {
		lightBoxDiv.insertAdjacentHTML('beforeend', `<dl>${resultTemplate}</dl>`);
	} else if (alternativeResultsTemplate !== '') {
		lightBoxDiv.insertAdjacentHTML('beforeend', `<h5>Alternative results</h5><dl>${alternativeResultsTemplate}</dl>`);
	} else {
		lightBoxDiv.insertAdjacentHTML('beforeend', `<h5>No results</h5>`);
	} 
}

function closeIdoLightBox() {
    document.getElementById('IdoLightBox').style.display = 'none';
}



import { errorWordTpl } from "./templates.html";

var BackgroundPage  = chrome.extension.getBackgroundPage();
var lastErrorWords  = [];

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	
	if ( request.event == "po-update" ) {
		var spellcyData = request.data;
		update( spellcyData );
	}

});

function update( spellcyData ) {
	lastErrorWords = [];

	// Set errors count to UI
	$errorCounter.text( spellcyData.length );
	// Update badge
	chrome.browserAction.setBadgeText({ text : spellcyData.length + "" });

	for(var i in spellcyData) {
		var errorWord  = spellcyData[i]["word"];
		var fixes      = spellcyData[i]["fix"];
		var errorFix   = "";

		for(var j in fixes) {
			errorFix += fixes[j] + ", ";
		}

		// Delete last ', ' in string
		errorFix = errorFix.substring(0, errorFix.length - 2);

		$content.append( $( errorWordTpl( errorWord, errorFix ) ) );

		lastErrorWords.push( errorWord );
	}

	// Fix bug with bad popup resize 
	// after dynamicly added content
	setTimeout(function() {
		$content.fadeIn(350, function() {});		
	}, 200);
	
}

function highlightAllWords() {
	if ( $markerId.css("visibility") == "hidden" ) {
		// Mark all words
		$markerId.css("visibility", "visible"); 	

		chrome.tabs.query({ active : true, currentWindow : true }, function(tabs) {	
			BackgroundPage.Messages.toTab( tabs[0].id, "cs-search-all", lastErrorWords );
		});		
	}
	else {
		// Clear all markers
		$markerId.css("visibility", "hidden"); 		
		
		chrome.tabs.query({ active : true, currentWindow : true }, function(tabs) {	
			BackgroundPage.Messages.toTab( tabs[0].id, "cs-clear" );
		});
	}	
}

$(function() {

	// Caching selectors
	window.$watchDomain     = $("#watch_domain");
	window.$errorCounter    = $("#errorCounter");
	window.$content         = $("#content");
	window.$markerId        = $("#marker_id");
	window.$errorsCounterId = $("#errors_counter_id");

	// Load and set 'isWatching' flag to UI
	chrome.tabs.query({ active : true, currentWindow : true }, function(tabs) {		    
	    var url = tabs[0].url;		

	    if ( BackgroundPage.storage.isWatching( url ) ) {
	    	$watchDomain.prop('checked', true);
	    }			 

	    BackgroundPage.checkTab( tabs[0].id );
	});	

	// Save 'isWatching' flag
	$watchDomain.click( function() {
		chrome.tabs.query({ active : true, currentWindow : true }, function(tabs) {		    
		    BackgroundPage.storage.set( tabs[0].url, $watchDomain.is(':checked') );
		});	
	});

	// Search current word in page
	window.$content.on("click", ".errors", function() {
		var word = $(this).attr("data-word");

		chrome.tabs.query({ active : true, currentWindow : true }, function(tabs) {	
			BackgroundPage.Messages.toTab( tabs[0].id, "cs-search", word );
		});
	});

	window.$errorsCounterId.click( highlightAllWords );
	window.$markerId.click( highlightAllWords );

});
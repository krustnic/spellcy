import Page from "./page";

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log("event", request);

	if ( request.event == "cs-get-text" ) {		

		var $html = $("body").clone().find("script,noscript,style").remove().end();		
		var text  = Page.toText( $html.get() );

		sendResponse({
			data : text
		});
	}
	else if ( request.event == "cs-search" ) {
		var word = request.data;

		var $target = Page.search( word );
		$.scrollTo( $target, 500, { offset : -150 } );
	}  	
	else if ( request.event == "cs-search-all" ) {
		var words = request.data;

		Page.searchAll( words );		
	} 
	else if ( request.event == "cs-clear" ) {
		Page.clear();		
	} 
	
	return true;
});

$(function() {
	//On escape button clear highlight
	$(document).keyup(function(e) {
  		if (e.keyCode == 27) {
  			Page.clear();
  		}   
	});	
});
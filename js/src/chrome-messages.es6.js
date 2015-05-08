export default {

	toTab : function( tabId, eventName, data, callback ) {
		chrome.tabs.sendMessage( tabId, {            
	    	event   : eventName,
	    	data    : data
    	}, function(response) {
    		var result = response ? response.data : null;
    		callback( result );            
    	});
	},

	toPopup : function( eventName, data, callback ) {
		chrome.runtime.sendMessage({
			event : eventName,
			data  : data
		}, function(response) {
			if ( callback ) {
				var result = response ? response.data : null;
    			callback( result ); 
			} 
		});
	}

}
import Storage from "./storage";
import Cache from "./cache";
import Messages from "./chrome-messages";

window.Messages = Messages;
window.storage  = new Storage();
window.storage.load();

window.cache   = new Cache();

function setBadgeText( text ) {
    // Set default color
    chrome.browserAction.setBadgeBackgroundColor({
        color : [0, 0, 0, 0]
    });

    if ( parseInt( text ) === 0 ) {
        // Green if there is no errors
        chrome.browserAction.setBadgeBackgroundColor( {
            color : "#01BA48"            
        } );
    }

    chrome.browserAction.setBadgeText({ text : text + "" });
}

window.checkTab = function( tabId ) {
    
    Messages.toTab( tabId, "cs-get-text", null, ( text ) => {
        if ( !text ) return;

        cache.get( text, false, function( spellcyData ) {
            // Update badge
            setBadgeText( spellcyData.length + "" );

            Messages.toPopup( "po-update", spellcyData );
        } ); 
    } );            
}

chrome.tabs.onActivated.addListener( function( activeInfo ) {
    setBadgeText( "" );

    chrome.tabs.query( { active: true, currentWindow: true }, function(tabs){

        if ( tabs.length == 0 ) return;
        if ( !storage.isWatching( tabs[0].url ) ) return;

        checkTab( tabs[0].id );    
    	
	});    
});

chrome.tabs.onUpdated.addListener( function( tabId, changeInfo, tab ) {    
    if ( changeInfo["status"] && changeInfo["status"] == "complete" ) {

        setBadgeText( "" );       

        if ( !storage.isWatching( tab.url ) ) return;
        checkTab( tabId );    
    }
});
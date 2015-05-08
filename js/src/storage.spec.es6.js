import url from "url";

// Mock window.URL function
global.URL = function( urlString ) {
	var parts = url.parse( urlString );
	for( var key in parts ) {
		this[key] = parts[key];
	}
}

import Storage from "./storage";

describe( "Storage", function() {
	
	it( "Check _parseURL function", function() {
		var storage = new Storage();

		var parts = storage._parseURL( "https://www.google.com/?q=spellcy" );		
		expect( parts["host"] ).toEqual( "www.google.com" );		

		parts = storage._parseURL( "https://www.google.com:8080/search/page?q=spellcy" );		
		expect( parts["host"] ).toEqual( "www.google.com:8080" );

		parts = storage._parseURL( "https://www.google.com" );		
		expect( parts["host"] ).toEqual( "www.google.com" );
	});
	
	it( "set 'isWatching' flag", function() {
		var storage = new Storage();

		var url = "https://www.google.ru";
		storage.set( url, true );
		expect( storage.isWatching( "https://www.google.ru" ) ).toEqual( true );

		storage.set( url, false );
		expect( storage.isWatching( "https://www.google.ru" ) ).toEqual( false );
		expect( storage._watching[ storage._parseURL( "https://www.google.ru" )["host"] ] ).toEqual( undefined );
	});
});
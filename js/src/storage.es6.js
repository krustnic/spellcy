export default class Storage {

	constructor() {
		this._watching = {};
	}

	load() {
		// Check for testing node environment
		if ( !this.isBrowser() ) return;

		var self = this;

		chrome.storage.sync.get("domains", function (obj) {            
            if ( obj["domains"] != undefined ) {
                self._watching = obj["domains"];
            }

        });
	}

	_parseURL( url ) {
		return new URL( url );		
	}

	isWatching( url ) {
		var parts = this._parseURL( url );

		if ( !parts || !parts["host"] ) return false;

		if ( this._watching[ parts["host"] ] == undefined ) return false;

		return this._watching[ parts["host"] ];
	}

	set( url, isWatching ) {
		var parts = this._parseURL( url );

		if ( !parts || !parts["host"] ) return;
		if ( !isWatching && this._watching[ parts["host"] ] != undefined ) {
			delete this._watching[ parts["host"] ];
			this.save();
			return;
		}
		
		this._watching[ parts["host"] ] = true;
		this.save();
	}
	
	save() {		
		// Check for testing node environment
		if ( !this.isBrowser() ) return;
		chrome.storage.sync.set( { "domains" : this._watching }, function() {} );
	}

	isBrowser() {
		if (typeof chrome === 'undefined') return false;
		return true;
	}

}
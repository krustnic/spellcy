import HASH from "./hash";

export default class Cache {

	constructor() {
		this._url   = "http://speller.yandex.net/services/spellservice.json/checkText";
    	this._cache = {};
	} 

	has( hash ) {
		return this._cache[hash] ? true : false;
	}

	set( hash, value ) {
		this._cache[hash] = value;
	}

	_get( hash ) {
		return this._cache[hash];
	}

	/**
	 * Parsing yandex's speller response
	 */
	_parse( data ) {
		var spellcyData = [];
    
	    for(var i in data) {
	        var error_word = data[i]["word"];
	        var error_fix = "";
	        
	        if ( data[i]["s"].length == 0 ) continue;	        

	        spellcyData.push({
	          "word" : error_word,
	          "fix"  : data[i]["s"]
	        });
	    }

	    return spellcyData;
	}
	
	/**
	 * Get speller data from cache or from server if
	 * forceCheck is true 
	 */
    get( text, forceCheck, callback ) {
    	var self = this;

    	var hash = HASH( text );

    	/**
    	 * If "forceCheck" enabled or there is no data in cache
    	 * we load it from server    	 
    	 */
    	if ( forceCheck || !this.has(hash) ) {
    		$.post( this._url, { 
    			text : text, 
    			lang : "ru", 
    			options : 535 
    		}, function( data ) {  
    			var spellcyData = self._parse( data );
                self.set( hash, spellcyData );

                callback( spellcyData );
            });

            return;
    	}

    	// Get from cache
    	callback( this._get( hash ) );
    	return;
    }
	
}
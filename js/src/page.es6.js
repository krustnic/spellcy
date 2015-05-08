import {wrapWordTpl} from "./templates.html";

export default {

	_wrapErrorSelector : "__spellcy_error_word",

	_collectTextNodes : function( element, text ) {
		for (var child = element.firstChild; child !== null; child = child.nextSibling) {
	        if ( child.nodeType === 3 ) {
	            text.push(child);
	        }
	        else if ( child.nodeType === 1 ) {
	            this._collectTextNodes(child, text);
	        }
	    }	
	},

	_getTextWithSpaces : function( element ) {
		var text = [];
	    this._collectTextNodes(element, text);
	    for( var i = text.length; i-->0; ) {
	        text[i]= text[i].data;
	    }
	    return text.join(' ');	
	},
	
	toText : function( htmlElementsArray ) {
		var text = "";

		for( var i = 0; i < htmlElementsArray.length; i++ ) {			
			text += " " + this._getTextWithSpaces( htmlElementsArray[i] );
		}
		// Replace all tabs to spaces
		text = text.replace(/\t/g,' ');
		// Replace all Returns to spaces
		text = text.replace(/\n/g,' ');
		// Remove all multiple spaces
		text = text.replace(/ +(?= )/g,'');
		// Remove the leading and trailing whitespace
		text = text.trim();

		return text;
	},
	
	search : function( word ) {
		this._wrapErrorWord( word );

		var $target = null;

		$("." + this._wrapErrorSelector).each(function() {
    		if ( $(this).text() == word ) {
    			$target = $(this);
    			return false;
    		}
    	}); 

    	return $target;
	},

	searchAll : function( words ) {
		for(var i in words) {
			var word = words[i];
			this._wrapErrorWord( word );
		}
	},

	clear : function() {
		$("." + this._wrapErrorSelector).each(function() {        		
        	$(this).replaceWith( $(this).text() );        	        		
        }); 
	},

	_wrapErrorWord : function( word ) {
		var searchTermRegEx = new RegExp(word,"ig");

		// Avoiding double wrapp    
		var isAlreadyMarked = false;
		$( "." + this._wrapErrorSelector ).each(function() {
    		if ( $(this).text() == word ) {
    			//$(this).replaceWith(word);        	
    			isAlreadyMarked = true;
    			return false;
    		}
    	}); 

    	if ( isAlreadyMarked ) return;

    	// wrapp
    	var elements = this._findElementsDirectlyContainingText( $("body").get(0), word );
    	for(var i in elements) {
    		$(elements[i]).html($(elements[i]).html().replace(searchTermRegEx, this._wrappWord(word) ));
    	}
        	
	},

	_wrappWord : function( word ) {		
		return wrapWordTpl( this._wrapErrorSelector, word );
	},	

	_findElementsDirectlyContainingText : function( ancestor, text ) {
	    var elements = [];

	    this._deepWalk( ancestor, text, elements );

	    return elements;	    
	},
	
	// Recursively search 'elements' with 'text'
	// and start with 'element'
	_deepWalk : function( element, text, elements ) {
        var n = element.childNodes.length;
        for (var i = 0; i<n; i++) {
            var child = element.childNodes[i];
            if ( child.nodeType === 3 && child.data.indexOf(text) !== -1 ) {
                elements.push(element);
                break;
            }
        }
        for (var i = 0; i<n; i++) {
            var child = element.childNodes[i];
            if ( child.nodeType === 1 ) {
                this._deepWalk( child, text, elements );
            }
        }
    }

}
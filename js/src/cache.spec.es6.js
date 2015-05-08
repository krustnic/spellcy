import Cache from "./cache";

describe( "Cache set/get", function() {

	it( "set/has", function() {
		var cache = new Cache();
		cache.set( 1, "qwerty" );		
		expect( cache.has(1) ).toEqual( true );
		expect( cache.has(2) ).toEqual( false );
		cache.set( 2, "qwerty" );
		expect( cache.has(2) ).toEqual( true );
	});

});

describe( "Cache _parse Yandex's speller response", function() {
	it( "Yandex's example", function() {
		var data = [
		   { "code": 1, "pos": 0, "row": 0, "col": 0, "len": 14,
		     "word": "синхрофазатрон",
		     "s": [ "синхрофазотрон" ]
		   },
		   { "code": 3, "pos": 17, "row": 0, "col": 17, "len": 5,
		     "word": "дубне",
		     "s": [ "Дубне" ]
		   }
		];

		var cache = new Cache();
		var spellcyData = cache._parse( data );		

		expect( spellcyData ).toEqual( [ 
			{ word: 'синхрофазатрон', fix: [ 'синхрофазотрон' ] },
  			{ word: 'дубне', fix: [ 'Дубне' ] } 
  		] );
	});

});
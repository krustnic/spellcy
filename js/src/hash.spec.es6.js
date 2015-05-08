import HASH from "./hash";

describe("hash function like in Java", function() {
	it( "Same beginning/ending", function() {
		var hash1 = HASH("qwerty");
		var hash2 = HASH("qwerty qwerty");
		
		expect( hash1 ).toNotEqual( hash2 );
	});

	it( "Idempotence", function() {
		var hash1 = HASH("This is sparta!");
		var hash2 = HASH("This is sparta!");
		
		expect( hash1 ).toEqual( hash2 );
	});
})
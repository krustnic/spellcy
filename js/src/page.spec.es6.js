import cheerio from "cheerio";
import Page from "./page";

describe("Get text from html", function() {
	it("Single tag", function() {
		var html = "<body><div id='div-id'>text</div></body>";

		var $ = cheerio.load( html );	
		var elements = $("body").get();
		var text     = Page.toText( elements );

		expect( text ).toEqual( "text" );		
	});

	it("inherit", function() {
		var html = "<body>This text is: <div id='div-id'>text<span>inner-text</span></div></body>";

		var $ = cheerio.load( html );	
		var elements = $("body").get();
		var text     = Page.toText( elements );

		expect( text ).toEqual( "This text is: text inner-text" );		
	});
});

describe("Recursively search for 'text' in HTMLElements.", function() {

	it("One-deep level", function() {
		var html = "<div><span>qwerty</span><span>qwerty</span></div>";
		var $ = cheerio.load( html );

		var elements = [];
		Page._deepWalk( $("div").get(0), "qwerty", elements );

		expect( elements.length ).toEqual( 2 );		
	});

	it("Three-deep level", function() {
		var html = "<div><span>qwerty<span>qwerty<span>qwerty</span></span></span></div>";
		var $ = cheerio.load( html );

		var elements = [];
		Page._deepWalk( $("div").get(0), "qwerty", elements );

		expect( elements.length ).toEqual( 3 );		
	});

	it("Text is a part of word", function() {
		var html = "<div><span>qwertyString</span><span>qwerty</span></div>";
		var $ = cheerio.load( html );

		var elements = [];
		Page._deepWalk( $("div").get(0), "qwerty", elements );

		expect( elements.length ).toEqual( 2 );		
	});

});
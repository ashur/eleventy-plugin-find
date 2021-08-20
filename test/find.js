/* global describe, it */

const {assert} = require( "chai" );
const findFilter = require( "../index" );

describe( "find", () =>
{
	it( "should return if first argument is not an array", () =>
	{
		assert.isUndefined( findFilter( "not an array" ) );
	});

	it( "should support a single primitive as ruleset", () =>
	{
		let array = ["apple", "banana", "cherry"];
		let ruleset = "cherry";
		let expected = "cherry";

		assert.equal( findFilter( array, ruleset ), expected );
	});

	it( "should support array of primitives as ruleset", () =>
	{
		let array = ["apple", "banana", "cherry"];
		let ruleset = ["banana", "cherry"];

		// Because it's an array of primitives and can't match "all", it should return the first
		// match found.
		let expected = "banana";

		assert.equal( findFilter( array, ruleset ), expected );
	});

	it( "should support property/value object as ruleset", () =>
	{
		let array = [
			{
				name: "apple",
				color: "green",
			},
			{
				name: "banana",
				color: "yellow",
			},
			{
				name: "cherry",
				color: "red",
			}
		];

		let ruleset = {
			property: 'color',
			value: 'red'
		};

		let expected = array[2];

		assert.equal( findFilter( array, ruleset ), expected );
	});

	it( "should support dot notation for nested property names in property/value object as ruleset", () =>
	{
		let array = [
			{
				data: {
					season: 1,
					episode: 1,
				}
			},
			{
				data: {
					season: 1,
					episode: 2,
				}
			},
			{
				data: {
					season: 1,
					episode: 3,
				}
			}
		];

		let ruleset = {
			property: 'data.episode',
			value: 3
		};

		let expected = array[2];

		assert.equal( findFilter( array, ruleset ), expected );
	});

	it( "should support array of property/value objects as ruleset", () =>
	{
		let array = [
			{
				name: "apple",
				color: "red",
				sour: false,
			},
			{
				name: "banana",
				color: "yellow",
				sour: false,
			},
			{
				name: "lemon",
				color: "yellow",
				sour: true,
			}
		];

		let ruleset = [
			{
				property: 'color',
				value: 'yellow'
			},
			{
				property: 'sour',
				value: true
			},
		];

		let expected = array[2];

		assert.equal( findFilter( array, ruleset ), expected );
	});

	it( "should support dot notation for nested property names in array property/value object rulesets", () =>
	{
		let array = [
			{
				data: {
					season: 1,
					episode: 1,
				}
			},
			{
				data: {
					season: 1,
					episode: 2,
				}
			},
			{
				data: {
					season: 1,
					episode: 3,
				}
			}
		];

		let ruleset = [
			{
				property: 'data.season',
				value: 1
			},
			{
				property: 'data.episode',
				value: 3
			},
		];

		let expected = array[2];

		assert.equal( findFilter( array, ruleset ), expected );
	});
});

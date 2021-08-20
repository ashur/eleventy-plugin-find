const dotProp = require( "dot-prop" );

/**
 * @param {Array} array
 * @param {Array} ruleset
 * @return {any}
 */
module.exports = (array, ruleset) =>
{
	if( !Array.isArray( array ) )
	{
		return;
	}

	if( typeof ruleset === "string" )
	{
		return array.find( arrayItem => arrayItem === ruleset );
	}

	if( Array.isArray( ruleset ) )
	{
		return array.find( arrayItem =>
		{
			return ruleset.reduce( (didMatch, rulesetItem, index) =>
			{
				if( index === 0 )
				{
					didMatch = (typeof rulesetItem) === "object";
				}

				// ruleset is array of primitives
				if( typeof rulesetItem !== "object" )
				{
					return didMatch || (arrayItem === rulesetItem);
				}

				// ruleset is array of property/value definitions
				else
				{
					let itemProperty = dotProp.get( arrayItem, rulesetItem.property );
					return didMatch && itemProperty === rulesetItem.value;
				}

			}, null );
		});
	}
	else if( typeof ruleset === "object" )
	{
		return array.find( arrayItem =>
		{
			let itemProperty = dotProp.get( arrayItem, ruleset.property );
			return itemProperty === ruleset.value;
		});
	}
};

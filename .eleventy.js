module.exports = eleventyConfig =>
{
	eleventyConfig.addFilter( "find", require( "./index" ) );
};

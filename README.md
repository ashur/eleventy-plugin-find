# eleventy-plugin-find

An Eleventy utility filter to find array members that match a set of rules.

## Setup

To install this plugin, run the following command at the root of your Eleventy project:

```
npm install --save @aaashur/eleventy-plugin-find
```

Next, add the following to the body of the `module.exports` in your [Eleventy config file](https://www.11ty.dev/docs/config/):

```
eleventyConfig.addPlugin( require("@aaashur/eleventy-plugin-find") );
```

## Example Scenario

Say you're building a podcast site with Eleventy and the content structure is organized by episode, each consisting of a details page and a transcript page:

```
+-- src/
  +-- _data/
  +-- _includes/
  +-- content/
    +-- s01/
	  +-- e01/
	    +-- index.md
	    +-- transcript.md
	  +-- e02/
	    +-- index.md
	    +-- transcript.md
    +-- s02/
+-- .eleventy.js
```

The frontmatter for an episode's details page might look like this:

```yaml
---
season: 1
episode: 1
title: Unbridled Moose Game
keywords: [unbridled moose game, games, moose]
enclosure:
  duration: "45:13"
  filename: unbridled-moose-game.mp3
  length: 66561568

tags: [episodes]
---
```

For simplicity of content management by a variety of contributors it's important that all metadata about an episode exist in the `index.md` frontmatter (rather than using a JSON- or JavaScript-based [directory data file](https://www.11ty.dev/docs/data-template-dir/) to define shared data.)

However, the episode details page and the transcript page both need to displaythe episode's title and episode number. How can we accomplish without duplicating data between files?

Using an [array of `property-value` rules](#array-of-property-value-objects) to search by `season` and `episode` values, our transcript layout can use the `find` filter to extract the correct Eleventy template object from our `episodes` [collection](https://www.11ty.dev/docs/collections/):

```njk
---
layout: layouts/transcript.njk
---
{%- set episodeTemplate = collections.episodes | find([
	{ property: "data.season", value: season },
	{ property: "data.episode", value: episode }
]) -%}
```

By setting the filter result to a template variable, as in `episodeTemplate` in the [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) example above, we can then refer to any property on the of the Eleventy template object.

For example, to display the the `title` variable defined in `index.md` on the transcript page for the same episode:

```njk
<h1>Episode {{ episodeTemplate.data.episode }}: {{ episodeTemplate.data.title }}</h1>
```

becomes

```html
<h1>Episode 1: Unbridled Moose Game</h1>
```

> If the title changes to something, say, a little more fowl, changing that value in `index.md` will automatically update the title displayed on the corresponding transcript page. Honk! 🎉

## Usage

```
{{ <array> | find( <ruleset> ) }}
```

While filtering collection objects using a `property-value` format is probably the `find` filter's most common use, it supports a variety of ruleset formats.

### Single primitive

```njk
---
fruits:
  - apple
  - banana
  - cherry
---
{{ fruits | find( "cherry" ) }}
```

This will return `"cherry"`

### Array of primitives

```njk
---
fruits:
  - apple
  - banana
  - cherry
---
{{ fruits | find( ["banana", "cherry"] ) }}
```

This will return `"banana"`, the first matching primitive

### Single property-value object

```njk
---
fruits:
  - name: apple
    color: red
    sour: false

  - name: banana
    color: yellow
    sour: false

  - name: lemon
    color: yellow
    sour: true
---
{{ fruits | find(
	{ property: "name", value: "banana" }
)}}
```

This will return the first array item whose property `name` has the value `"banana"`, `{ name: "banana", [...] }`

> 🤹 `find` supports dot notation for specifying nested property names (ex., `property: "data.title"`)

### Array of property-value objects

```njk
---
fruits:
  - name: apple
    color: red
	sour: false

  - name: banana
    color: yellow
	sour: false

  - name: lemon
    color: yellow
	sour: true
---
{{ fruits | find([
	{ property: "color", value: "yellow" },
	{ property: "sour", value: true }
]) }}
```

This will return the first array item whose property `color` has the value `"yellow"` _and_ whose property `sour` has the value `true`, `{ name: "lemon", [...] }`

> 🤹 `find` supports dot notation for specifying nested property names (ex., `property: "data.title"`)

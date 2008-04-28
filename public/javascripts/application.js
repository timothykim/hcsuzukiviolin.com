// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

window.onload = function() {
	$$('div.flash').each(function (flash) {
		Effect.Fade(flash, {duration: 5})
	});
}
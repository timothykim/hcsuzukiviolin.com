// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

/*window.onload = function() {
	$$('div.flash').each(function (flash) {
		Effect.SlideUp(flash, {duration: 5})
	});
}
*/
Element.addMethods({  
  getInnerText: function(element) {
    element = $(element);
    return element.innerText && !window.opera ? element.innerText
      : element.innerHTML.stripScripts().unescapeHTML().replace(/[\n\r\s]+/g, ' ');
  }
});

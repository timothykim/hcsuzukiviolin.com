// this is a test



document.observe("dom:loaded", function() {
  var apikey = "AIzaSyCMTiZkmZrwhpLM1vDewJIfBmptvVEyHKI";
  var url = "https://www.googleapis.com/plus/v1/people/114358390409109642812/activities/public?alt=json&key=" + apikey;


  var render = function (p) {
    var rendering = '<div class="post"><div class="date">' + new Date(p.published).toDateString() + '</div><div class="content">' + p.object.content + '</div></div></div>';
    return rendering;
  };


  new Ajax.Request(url, {
    method: 'get',
      onSuccess: function(transport) {
        var posts = transport.responseText.evalJSON(true);
        posts.items.each(function (post) {
          var r = render(post);
          $('updates').insert(render(post));
        });
      }
  });
});

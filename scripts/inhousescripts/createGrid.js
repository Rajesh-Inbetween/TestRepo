$(document).ready(function () {
  createMustacheTemplate();
});

createMustacheTemplate = function () {
  console.log("********** creating mustache template");
  var aData = [{
                 "label": "product1",
                 "description": "description",
                 "path": "../images/ui-icons_444444_256x240.png"
               }, {
                 "label": "product2",
                 "description": "description",
                 "path": "../images/ui-icons_444444_256x240.png"
               }, {}, {
                 "label": "product4",
                 "description": "description",
                 "path": "../images/ui-icons_444444_256x240.png"
               }, {}, {
                 "label": "product5",
                 "description": "description",
                 "path": "../images/ui-icons_444444_256x240.png"
               }];

  var $div = $("#temp");

  $div.load("MustacheTemplate.html", function () {
    for (var i = 0; i < aData.length; i++) {
      var output = Mustache.to_html($div.html(), aData[i]);
      $(".grid .row .col").eq(i).html(output);

    }
  });

};

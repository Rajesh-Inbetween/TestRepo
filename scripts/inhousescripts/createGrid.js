$(document).ready(function () {
  //getMustacheTemplateDom(oData);
  addProductDetailsToCells(aContentData);
  //addProductDetailsToCell(0,1,aContentData);
});


addProductDetailsToCell = function(rowCount, cellCount, oData){
  var $div = $("#temp");
  var $row = $(".grid .grid-row ").eq(rowCount);
  var $column = $row.find('.grid-cell').eq(cellCount);

  $div.load("MustacheTemplate.html", function(){
    var output = Mustache.to_html($div.html(), oData);
    $column.html(output);
  });
}

addProductDetailsToCells = function (aData) {
  var $div = $("#temp");

  $div.load("MustacheTemplate.html", function () {
    for (var i = 0; i < aData.length; i++) {
      var output = Mustache.to_html($div.html(), aData[i]);
      $(".grid .grid-row .grid-cell").eq(i).html(output);

    }
  });

};

getMustacheTemplateDom = function(oData){
  var $div = $("#temp");
  $div.load("MustacheTemplate.html");
  return  Mustache.to_html($div.html(), oData);
}

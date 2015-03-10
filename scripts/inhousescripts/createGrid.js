$(document).ready(function () {
  //getMustacheTemplateDom(oData);
  //addProductDetailsToCells(aContentData);
  //addProductDetailsToCell(0,1,aContentData);
  populateGrids();
});

var sMustacheTemplate =
    "<div class='product_template_label'>{{image}}</div>" +
    "<div class='product_template_description'>{{description}}</div> " +
    "<div class='product_template_image'>" +
    "<img src = {{{image}}} alt = 'image' height='200px' width='200px'/>" +
    " </div>";

addProductDetailsToCell = function(rowCount, cellCount, oData){
  var $row = $(".grid .grid-row ").eq(rowCount);
  var $column = $row.find('.grid-cell').eq(cellCount);
  var output = Mustache.to_html(sMustacheTemplate, oData);
  $column.html(output);
}

addProductDetailsToCells = function (aData) {
  for (var i = 0; i < aData.length; i++) {
    var output = Mustache.to_html(sMustacheTemplate, aData[i]);
    $(".grid .grid-row .grid-cell").eq(i).html(output);
  }

};

getMustacheTemplateDom = function(oData){
  return  Mustache.to_html(sMustacheTemplate, oData);
}

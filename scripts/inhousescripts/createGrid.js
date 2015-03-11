$(document).ready(function () {
  //getMustacheTemplateDom(oData);
  //addProductDetailsToCells(aContentData);
  //addProductDetailsToCell(0,1,aContentData);
  //$('.grid .grid-row .grid-cell').on('click',cellClicked);
  populateGrids();
  refreshUserData();
});

addProductDetailsToCell = function(rowCount, cellCount, oData){
  var $row = $("#content-grid.grid .grid-row ").eq(rowCount);
  var $column = $row.find('.grid-cell').eq(cellCount);
  var output = Mustache.to_html(sMustacheSmallTemplate, oData);
  $column.html(output);
}

addProductDetailsToCells = function (aData) {
  var $gridCells = $("#content-grid.grid .grid-row .grid-cell");
  for (var i = 0; i < aData.length; i++) {
    var output = '';
    if($gridCells.eq(i).hasClass('large-grid-cell')){
      output = Mustache.to_html(sMustacheLargeTemplate, aData[i]);
    } else {
      output = Mustache.to_html(sMustacheSmallTemplate, aData[i]);
    }
    $gridCells.eq(i).html(output);
  }

};

getMustacheTemplateDom = function(oData){
  return  Mustache.to_html(sMustacheSmallTemplate, oData);
}

cellClicked = function(oEvent){
  var oTarget = oEvent.currentTarget;
  $('.grid-cell').removeClass('cellSelected');
  $(oTarget).addClass('cellSelected');
  var $productTemplate = $(oTarget).find('.product_template');
  computeUserDataRelevanceAndUpdateGrids(oTarget);
  var $maskedCell = $('<div class="maskedCell"></div>');
  $(oTarget).append($maskedCell);
  //showDialog(oTarget, $productTemplate.attr('data-content'));
}

function showDialog ( oTarget, dataContentt) {
  $('#dialog').html(dataContentt);
  $('#dialog').dialog({
    title:"Content"

  });
}

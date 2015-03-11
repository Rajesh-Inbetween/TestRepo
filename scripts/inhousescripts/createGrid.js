$(document).ready(function () {
  //getMustacheTemplateDom(oData);
  //addProductDetailsToCells(aContentData);
  //addProductDetailsToCell(0,1,aContentData);
  $('.grid .grid-row .grid-cell').on('click',cellClicked);
  populateGrids();
});

addProductDetailsToCell = function(rowCount, cellCount, oData){
  var $row = $(".grid .grid-row ").eq(rowCount);
  var $column = $row.find('.grid-cell').eq(cellCount);
  var output = Mustache.to_html(sMustacheTemplate, oData);
  $column.html(output);
}

addProductDetailsToCells = function (aData) {
  for (var i = 0; i < aData.length; i++) {
    var output = Mustache.to_html(sMustacheTemplate, aData[i]);
    $(".grid .grid-row .grid-cell").eq(i).attr("data-content","content");
    $(".grid .grid-row .grid-cell").eq(i).html(output);
  }

};

getMustacheTemplateDom = function(oData){
  return  Mustache.to_html(sMustacheTemplate, oData);
}

cellClicked = function(oEvent){
  var oTarget = oEvent.target;
  if(oTarget.className == "grid-cell"){
    showDialog($(oTarget), oTarget.getAttribute("data-content"));
  }
}

function showDialog ( oTarget, dataContentt) {
  $('#dialog').html(dataContentt);
  $('#dialog').dialog({closeText: "",
                      position : { of : oTarget}});
}

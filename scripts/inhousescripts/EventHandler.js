
function gridCellClicked (oEvent) {
  var $gridCell = $(oEvent.currentTarget);
  var $contentTemplate = $gridCell.find('.product_template');
  var iContentId = $contentTemplate.attr('data-id');
  var oContent = getContentById(iContentId);
  setUserRelevance(oContent);

  for (sKey in sessionData.userData){console.log(sKey + " : " + sessionData.userData[sKey].relevance)}
}
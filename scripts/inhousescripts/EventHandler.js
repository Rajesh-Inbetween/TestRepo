
function gridCellClicked (oEvent) {
  var $contentTemplate = $(oEvent.target);
  var iContentId = $contentTemplate.attr('data-id');
  var oContent = getContentById(iContentId);
  setUserRelevance(oContent);
}
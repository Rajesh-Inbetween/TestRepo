
function gridCellClicked (oEvent) {
  cellClicked(oEvent);
}

function refreshUserData () {
  var sDisplayUserString = "";
  for (sKey in sessionData.userData) {
    sDisplayUserString += sKey + " : " + sessionData.userData[sKey].relevance + "<br>";
    console.log(sKey + " : " + sessionData.userData[sKey].relevance)
  }
  $('#display-user-data').html(sDisplayUserString);
}

function computeUserDataRelevanceAndUpdateGrids(oCell){
  var $gridCell = $(oCell);
  var $contentTemplate = $gridCell.find('.product_template');
  var iContentId = $contentTemplate.attr('data-id');
  var oContent = getContentById(iContentId);
  setUserRelevance(oContent);

  refreshUserData();
}
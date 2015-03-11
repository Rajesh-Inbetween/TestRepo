
function gridCellClicked (oEvent) {
  cellClicked(oEvent);
}

function refreshUserData () {
  var sDisplayUserString = "";
  for (sKey in sessionData.userData) {
    var userRelevance = sessionData.userData[sKey].relevance;
    var color = "white";
    if(userRelevance > 90 && userRelevance <= 100){
      color = "green";
    } else if(userRelevance > 50 && userRelevance <= 90){
      color = "rgb(80, 178, 96)";
    } else if(userRelevance > 0 && userRelevance <= 50){
      color = "lightgreen";
    } else if(userRelevance >= -50 && userRelevance < 0){
      color = "rgb(219, 231, 162)";
    } else if(userRelevance > -100 && userRelevance < -50){
      color = "rgb(224, 187, 71)";
    } else if(userRelevance == -100){
      color = "red";
    }
    //sDisplayUserString += sKey + " : " + sessionData.userData[sKey].relevance + "<br>";
    sDisplayUserString += "<tr>" +
    "<td class='user-data-cell'>" + sKey + "</td>" +
    "<td class='user-data-cell'>" + userRelevance + "</td>" +
    "<td class='user-data-cell' style='background-color: " + color + ";width:50px'></td>" +
    "</tr>"
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
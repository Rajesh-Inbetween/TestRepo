
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
    "<td class='user-data-cell'>" + userRelevance.toFixed(2) + "%</td>" +
    "<td class='user-data-cell' style='background-color: " + color + ";width:50px'></td>" +
    "</tr>"
  }
  $('#display-user-data').html(sDisplayUserString);
}

function computeUserDataRelevanceAndUpdateGrids($gridCell){
  var $contentTemplate = $gridCell.find('.product_template');
  var iContentId = $contentTemplate.attr('data-id');
  var oContent = getContentById(iContentId);
  sessionData.viewedContentIds.push(oContent.id);
  setUserRelevance(oContent);
  var aClonedContents = $.extend(true,[],aContentData);
  prioritizeContent(aClonedContents);
  populateGrids(aClonedContents);
  updateProductRelevanceTable(oContent);
  refreshUserData();
}

function updateProductRelevanceTable(oContent){

  var oUserData = sessionData.userData;
  var tableColumns = sessionData.tableColumns;

  var tableHTML = "<tr class='product-relevance-table-data'>";
  tableHTML += "<td>" + oContent.label +"</td>";
  var aContentTargetGroups = oContent["Target Group"];
  for( var iTableColumnIndex = 1 ; iTableColumnIndex < tableColumns.length ; iTableColumnIndex++){
    var sTargetGroup = tableColumns[iTableColumnIndex];
    var bFoundTargetGroup = false;
    for(var iTargetGroupIndex = 0 ; iTargetGroupIndex < aContentTargetGroups.length ; iTargetGroupIndex++){
      var oTargetGroup = aContentTargetGroups[iTargetGroupIndex];
      if(oTargetGroup.name == sTargetGroup){
        bFoundTargetGroup = true;
        var iTargetGroupRelevance = oTargetGroup.relevance;
        var sTargetGroupStrength = oTargetGroup.strength;
        var sStrengthColour = "transparent";
        if(iTargetGroupRelevance != 0){
          switch(sTargetGroupStrength){
            case 'absolute':
              sStrengthColour = "rgb(255, 110, 110)";
              break;
            case 'strong':
              sStrengthColour = "rgb(126, 126, 255)";
              break;
            case 'weak':
              sStrengthColour = "rgb(101, 205, 101)";
              break;
            case 'indicator':
              sStrengthColour = "rgb(110, 110, 110)";
              break;
          }
        }
        tableHTML += "<td style='background-color: " + sStrengthColour + "'>" + iTargetGroupRelevance.toFixed(2) + "%</td>";
        break;
      }
    }
    if(!bFoundTargetGroup){
      tableHTML += "<td>0%</td>";
    }
  }
  tableHTML += "</tr>";

  tableHTML += "<tr class='product-relevance-table-data'>";
  tableHTML += "<td></td>"

  for( var iTableColumnIndex = 1 ; iTableColumnIndex < tableColumns.length ; iTableColumnIndex++){
    var sTargetGroup = tableColumns[iTableColumnIndex];
    var iUserDataTargetGroupRelevance = oUserData[sTargetGroup].relevance;
    tableHTML += "<td>" + iUserDataTargetGroupRelevance.toFixed(2) + "%</td>";
  }
  tableHTML += "</tr>";
  $('#product-relevance-table tbody').append(tableHTML);

}
function computeUserRelevance(productDataTargetGroup, userTargetGroup){

  var productTargetGroupRelevance = productDataTargetGroup.relevance;
  var productTargetGroupStrength = productDataTargetGroup.strength;
  var computedRelevance = 0;
  switch (productTargetGroupStrength){
    case 'absolute':
      computedRelevance = productTargetGroupRelevance;
      break;
    case 'strong':
      computedRelevance = userTargetGroup.relevance;
      computedRelevance += (productTargetGroupRelevance/2);
      break;
    case 'weak':
      computedRelevance = userTargetGroup.relevance;
      computedRelevance += (productTargetGroupRelevance/4);
      break;
    case 'indicator':
      computedRelevance = userTargetGroup.relevance;
      computedRelevance += (productTargetGroupRelevance/10);
      break;
    default:
      alert("Wrong tag group Strength");
      break;
  }
  //userTargetGroup.relevance = computedRelevance;
  return computedRelevance;
}

function getContentById(id){
  var aContent = aContentData;
  for(var iContentIndex = 0 ; iContentIndex < aContentData.length ; iContentIndex++){
    var oContent = aContent[iContentIndex];
    if(oContent.id == id){
      return oContent;
    }
  }
  console.error("Content Not Found");
  return false;
}

function populateGrids(){

  var aContent = aContentData;

  var oUserData = oDefaultUserSessionData;

  

}
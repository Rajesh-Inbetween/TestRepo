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

  var aContent = $.extend(true, [], aContentData);
  var oUserData = sessionStorage.userData;
  var oRuleData = $.extend(true,{},oRules);
  for(sTargetGroupType in oRuleData.targetGroup){
    if(oRuleData.targetGroup[sTargetGroupType] > 0){
      var oContent = getContentWithTargetGroup(aContent, sTargetGroupType);
      if(oContent){
        oRuleData.targetGroup[sTargetGroupType]--;
        var aRegions = oContent["Region"];
        for(var iRegionIndex = 0 ; iRegionIndex < aRegions.length ; iRegionIndex++){
          var sRegionName = aRegions[iRegionIndex].name;
          if(oRuleData.region[sRegionName] > 0){
            oRuleData.region[sRegionName]--;
          }
        }
      }
    }
  }
  console.log(oRuleData);

}

/**
 *
 * @param aClonedContent - Content that has been Cloned!!!
 * @param sTargetGroup
 */
function getContentWithTargetGroup(aClonedContent, sTargetGroup){
  for(var iContentIndex = 0 ; iContentIndex < aClonedContent.length ; iContentIndex++){
    var oContent = aClonedContent[iContentIndex];
    var aContentTargetGroups = oContent["Target Group"];
    for(var iTargetGroupIndex=0 ; iTargetGroupIndex < aContentTargetGroups.length ; iTargetGroupIndex++){
      var oTargetGroup = aContentTargetGroups[iTargetGroupIndex];
      if(oTargetGroup.name == sTargetGroup && oTargetGroup.relevance > 0){
        aClonedContent.splice(iContentIndex,1);
        return oContent;
      }
    }
  }
  return false;
}

function getContentForRegion(aContent, sRegion){

}
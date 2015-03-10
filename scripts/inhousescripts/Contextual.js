function setUserRelevance (oContent) {
  var aContentTargetGroups = oContent["Target Group"];

  for (var iTargetGroupIndex = 0; iTargetGroupIndex < aContentTargetGroups.length; iTargetGroupIndex++) {
    var oContentTargetGroup = aContentTargetGroups[iTargetGroupIndex];
    var oUserData = sessionData.userData[oContentTargetGroup.name];
    var iUpdatedUserDataRelevance = computeUserRelevance(oContentTargetGroup, oUserData);
    oUserData.relevance = iUpdatedUserDataRelevance;
  }
}

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

function getContentById(iContentid){
  var aContent = aContentData;
  for(var iContentIndex = 0 ; iContentIndex < aContentData.length ; iContentIndex++){
    var oContent = aContent[iContentIndex];
    if(oContent.id == iContentid){
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
  var iGridSize = sessionData.gridSize[0]*sessionData.gridSize[1];
  var aContentToUse = [];

  targetGroup:
  for(sTargetGroupType in oRuleData.targetGroup){
    while (oRuleData.targetGroup[sTargetGroupType] > 0) {
      var oContent = getContentWithTargetGroup(aContent, sTargetGroupType);
      if (oContent) {
        oRuleData.targetGroup[sTargetGroupType]--;
        var aRegions = oContent["Region"];
        for (var iRegionIndex = 0; iRegionIndex < aRegions.length; iRegionIndex++) {
          var sRegionName = aRegions[iRegionIndex].name;
          if (oRuleData.region[sRegionName] > 0) {
            oRuleData.region[sRegionName]--;
          }
        }
        aContentToUse.push(oContent);
        if(aContentToUse.length >= iGridSize){
          break targetGroup;
        }
      } else {
        break;
      }
    }
  }
  region:
  for(sRegionType in oRuleData.region){
    while(oRuleData.region[sRegionType] > 0){
      console.log(sRegionType);
      var oContent = getContentForRegion(aContent, sRegionType);
      if (oContent) {
        oRuleData.region[sRegionType]--;
        aContentToUse.push(oContent);
        if(aContentToUse.length >= iGridSize){
          break region;
        }
      } else{
        break;
      }
    }
  }
  console.log(oRuleData);
  console.log(aContentToUse.length);

  



  var iContentIndex = 0;
  while(aContentToUse.length < iGridSize && iContentIndex < aContent.length){
    aContentToUse.push(aContent[iContentIndex]);
  }
  console.log(aContentToUse.length);
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

function getContentForRegion(aClonedContent, sRegion){
  for(var iContentIndex = 0 ; iContentIndex < aClonedContent.length ; iContentIndex++){
    var oContent = aClonedContent[iContentIndex];
    var aContentRegions = oContent["Region"];
    for(var iTargetGroupIndex=0 ; iTargetGroupIndex < aContentRegions.length ; iTargetGroupIndex++){
      var oRegion = aContentRegions[iTargetGroupIndex];
      if(oRegion.name == sRegion && oRegion.relevance > 0){
        aClonedContent.splice(iContentIndex,1);
        return oContent;
      }
    }
  }
  return false;
}
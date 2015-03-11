const RELEVANCE_ALL = 'all';
const RELEVANCE_ONE = 'one';
const RELEVANCE_TWO = 'two';
const RELEVANCE_THREE = 'three';

function setUserRelevance (oContent) {
  var aContentTargetGroups = oContent["Target Group"];

  for (var iTargetGroupIndex = 0; iTargetGroupIndex < aContentTargetGroups.length; iTargetGroupIndex++) {
    var oContentTargetGroup = aContentTargetGroups[iTargetGroupIndex];
    var oUserData = sessionData.userData[oContentTargetGroup.name];
    var iUpdatedUserDataRelevance = computeUserRelevance(oContentTargetGroup, oUserData);
    oUserData.relevance = iUpdatedUserDataRelevance;
  }

  populateGrids();
}

function computeUserRelevance(productDataTargetGroup, userTargetGroup){

  var productTargetGroupRelevance = productDataTargetGroup.relevance;
  var productTargetGroupStrength = productDataTargetGroup.strength;
  var computedRelevance = 0;
  if(productTargetGroupRelevance == 0){
    return userTargetGroup.relevance;
  }
  switch (productTargetGroupStrength){
    case 'absolute':
      computedRelevance = productTargetGroupRelevance;
      break;
    case 'strong':
      computedRelevance = userTargetGroup.relevance + (productTargetGroupRelevance/2);
      break;
    case 'weak':
      computedRelevance = userTargetGroup.relevance + (productTargetGroupRelevance/4);
      break;
    case 'indicator':
      computedRelevance = userTargetGroup.relevance + (productTargetGroupRelevance/10);
      break;
    default:
      computedRelevance = userTargetGroup.relevance;
      break;
  }
  if (computedRelevance > 100) {
    computedRelevance = 100;
  } else if (computedRelevance < -100) {
    computedRelevance = -100;
  }
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
  var oUserData = $.extend(true, {}, sessionData.userData);
  var oRuleData = $.extend(true,{},oRules);
  var iGridSize = sessionData.gridSize[0]*sessionData.gridSize[1];
  var aContentToUse = [];

  //Applying content as per rule set.
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

  // Applying content as per User Data.
  for (var sTargetGroupName in oUserData) {
    var sScaleCount = getScaleForRelevance(oUserData[sTargetGroupName].relevance);
    addContentAccordingToUserRelevance(sTargetGroupName, sScaleCount, aContent, aContentToUse);
  }

  var iContentIndex = 0;
  while(aContentToUse.length < iGridSize && iContentIndex < aContent.length){
    aContentToUse.push(aContent[iContentIndex]);
    iContentIndex++;
  }
  //var $aGridCells = $('#content-grid').find('.grid-cell');
  //for(var iGridCellIndex = 0 ; iGridCellIndex < $aGridCells.length ; iGridCellIndex++){
  //  var oTemplate = getMustacheTemplateDom(aContentToUse[iGridCellIndex]);
  //  $aGridCells.eq(iGridCellIndex).html(oTemplate);
  //}
  addProductDetailsToCells(aContentToUse);
}

function addContentAccordingToUserRelevance (sTargetGroupName, sScaleCount, aClonedContent, aContentToUse) {
  var iLoopLength;
  console.log(sTargetGroupName + " : " + sScaleCount);
  switch(sScaleCount){
    case RELEVANCE_ALL:
      iLoopLength = aClonedContent.length;
      break;

    case RELEVANCE_ONE:
      iLoopLength = 1;
      break;

    case RELEVANCE_TWO:
      iLoopLength = 2;
      break;

    case RELEVANCE_THREE:
      iLoopLength = 3;
      break;

    default :
      iLoopLength = 0;
  }

  for (var iCount = 0; iCount < iLoopLength; iCount++) {
    var oContent = getContentWithTargetGroup(aClonedContent, sTargetGroupName);
    if (oContent) {
      aContentToUse.push(oContent);
      console.log(oContent.label);
    } else {
      break;
    }
  }
  /*if (sScaleCount == RELEVANCE_ALL) {
    var oContent;
    do {
      oContent = getContentWithTargetGroup(aClonedContent, sTargetGroupName);
      if (oContent) {
        aContentToUse.push(oContent);
      }
    } while (oContent);
  } else if (sScaleCount == RELEVANCE_ONE) {
    var oContent = getContentWithTargetGroup(aClonedContent, sTargetGroupName);
    if (oContent) {
      aContentToUse.push(oContent);
    }
  } else if (sScaleCount == RELEVANCE_TWO) {
    for (var iCount = 0; iCount < 2; iCount++) {
      var oContent = getContentWithTargetGroup(aClonedContent, sTargetGroupName);
      if (oContent) {
        aContentToUse.push(oContent);
      } else {
        break;
      }
    }
  } else if (sScaleCount == RELEVANCE_THREE) {
    for (var iCount = 0; iCount < 3; iCount++) {
      var oContent = getContentWithTargetGroup(aClonedContent, sTargetGroupName);
      if (oContent) {
        aContentToUse.push(oContent);
      } else {
        break;
      }
    }
  }*/
}

function getScaleForRelevance (fRelevance) {
  if (fRelevance == 100) {

    return RELEVANCE_ALL;
  } else if (fRelevance > 10 && fRelevance < 40) {

    return RELEVANCE_ONE;
  } else if (fRelevance > 40 && fRelevance < 80) {

    return RELEVANCE_TWO;
  } else if (fRelevance > 80 && fRelevance < 100) {

    return RELEVANCE_THREE;
  } else {

    return false;
  }
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
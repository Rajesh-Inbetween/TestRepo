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
      computedRelevance = userTargetGroup.relevance + (productTargetGroupRelevance - userTargetGroup.relevance)/2;
      break;
    case 'weak':
      computedRelevance = userTargetGroup.relevance + (productTargetGroupRelevance - userTargetGroup.relevance)/4;
      break;
    case 'indicator':
      computedRelevance = userTargetGroup.relevance + (productTargetGroupRelevance - userTargetGroup.relevance)/10;
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
  var iGridSize = sessionData.gridSize;
  var aContentToUse = [];

  //Applying content as per rule set.
  targetGroup:
  for(sTargetGroupType in oRuleData.targetGroup){
    while (oRuleData.targetGroup[sTargetGroupType] > 0) {
      var oContent = getContentWithTargetGroup(aContent, sTargetGroupType);
      if (oContent) {
        oRuleData.targetGroup[sTargetGroupType]--;
        var aCategories = oContent["category"];
        for (var iCategoryIndex = 0; iCategoryIndex < aCategories.length; iCategoryIndex++){
          var sCategory = aCategories[iCategoryIndex].name;
          if (oRuleData.category[sCategory] > 0) {
            oRuleData.category[sCategory]--;
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
  category:
  for(sCategory in oRuleData.category){
    while(oRuleData.category[sCategory] > 0){
      console.log(sCategory);
      var oContent = getContentForRegion(aContent, sCategory);
      if (oContent) {
        oRuleData.category[sCategory]--;
        aContentToUse.push(oContent);
        if(aContentToUse.length >= iGridSize){
          break category;
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
  var oUserData = sessionData.userData;

  for (var iCount = 0; iCount < iLoopLength; iCount++) {
    var oContent = getContentForUserTargetGroup(aClonedContent, sTargetGroupName, oUserData[sTargetGroupName].relevance);
    //var oContent = getContentWithTargetGroup(aClonedContent, sTargetGroupName);
    if (oContent) {
      aContentToUse.push(oContent);
      console.log(oContent.label);
    } else {
      break;
    }
  }
}

function getContentForUserTargetGroup(aClonedContent, sTargetGroup, iTargetGroupRelevance){
  for(var iContentIndex = 0 ; iContentIndex < aClonedContent.length ; iContentIndex++){
    var oContent = aClonedContent[iContentIndex];
    var aContentTargetGroups = oContent["Target Group"];
    for(var iTargetGroupIndex=0 ; iTargetGroupIndex < aContentTargetGroups.length ; iTargetGroupIndex++){
      var oTargetGroup = aContentTargetGroups[iTargetGroupIndex];
      var iRelevanceDifference = iTargetGroupRelevance - oTargetGroup.relevance;
      var bIsBothNegative = iTargetGroupRelevance < 0 && oTargetGroup.relevance < 0;
      var bIsBothPositive = iTargetGroupRelevance > 0 && oTargetGroup.relevance > 0;
      if(oTargetGroup.name == sTargetGroup &&
          ((bIsBothNegative || bIsBothPositive) && iRelevanceDifference > -10 && iRelevanceDifference < 10)){
        aClonedContent.splice(iContentIndex,1);
        return oContent;
      }
    }
  }
  return false;
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

function getContentForRegion(aClonedContent, sCategoryName){
  for(var iContentIndex = 0 ; iContentIndex < aClonedContent.length ; iContentIndex++){
    var oContent = aClonedContent[iContentIndex];
    var aContentCategories = oContent["category"];
    for(var iCategoryIndex=0 ; iCategoryIndex < aContentCategories.length ; iCategoryIndex++){
      var oCategoryForContent = aContentCategories[iCategoryIndex];
      if(oCategoryForContent.name == sCategoryName && oCategoryForContent.relevance > 0){
        aClonedContent.splice(iContentIndex,1);
        return oContent;
      }
    }
  }
  return false;
}
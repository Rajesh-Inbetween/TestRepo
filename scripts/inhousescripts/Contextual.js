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

function populateGrids(aContents){

  //var aContent = $.extend(true, [], aContentData);
  var oUserData = $.extend(true, {}, sessionData.userData);
  var oRuleData = $.extend(true,{},oRules);
  var iGridSize = sessionData.gridSize;
  var aContentToUse = [];

  //Applying content as per rule set.
  targetGroup:
  for(var sTargetGroupType in oRuleData.targetGroup){
    while (oRuleData.targetGroup[sTargetGroupType] > 0) {
      var oContent = getContentWithTargetGroup(aContents, sTargetGroupType);
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
      var oContent = getContentForRegion(aContents, sCategory);
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
  for(var iContentIndex = aContents.length - 1; aContentToUse.length < iGridSize && iContentIndex >= 0 ; iContentIndex--){
    aContentToUse.push(aContents[iContentIndex]);
  }
  addProductDetailsToCells(aContentToUse);
}

/**
 *
 * @param aClonedContent - Content that has been Cloned!!!
 * @param sTargetGroup
 */
function getContentWithTargetGroup(aClonedContent, sTargetGroup){
  for(var iContentIndex = aClonedContent.length - 1 ; iContentIndex >= 0 ; iContentIndex--){
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
  for(var iContentIndex = aClonedContent.length - 1 ; iContentIndex >= 0 ; iContentIndex--){
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

function prioritizeContent (aContents) {

  for (var iContentIndex = 0; iContentIndex < aContents.length; iContentIndex++) {
    var oUserData = sessionData.userData;
    var oContent = aContents[iContentIndex];
    var aContentTargetGroups = oContent["Target Group"];
    var bIsConflicting = false;
    var bIsSameDirection = true;
    var iContentScore = 0;
    var iRelevanceSum = 0;

    for(var iTargetGroupIndex = 0 ; iTargetGroupIndex < aContentTargetGroups.length ; iTargetGroupIndex++){
      var oContentTargetGroup = aContentTargetGroups[iTargetGroupIndex];
      var oUserTargetGroup = oUserData[oContentTargetGroup.name];
      var bIsBothNegative = oUserTargetGroup.relevance < 0 && oContentTargetGroup.relevance < 0;
      var bIsBothPositive = oUserTargetGroup.relevance >= 0 && oContentTargetGroup.relevance >= 0;
      var iRelevanceDifference = oUserTargetGroup.relevance - oContentTargetGroup.relevance;
      iRelevanceSum += iRelevanceDifference;
      if (Math.abs(iRelevanceDifference) == 200) {
        bIsConflicting = true;
        bIsSameDirection = false;
      } else if (bIsBothNegative || bIsBothPositive) {
        iContentScore++;
      } else {
        bIsSameDirection = false;
        iContentScore--;
      }
    }

    if(bIsConflicting){
      iContentScore = -100;
    } else if(bIsSameDirection){
      iContentScore += 100;
    }
    if(sessionData.viewedContentIds.indexOf(oContent.id) >= 0){
      iContentScore = -30;
    }

    var iRelevanceMean = iRelevanceSum / aContentTargetGroups.length;
    if (Math.abs(iRelevanceMean) <= 10) {
      iContentScore += 4;
    } else if (Math.abs(iRelevanceMean) <= 20) {
      iContentScore += 3;
    } else if (Math.abs(iRelevanceMean) <= 30) {
      iContentScore += 2;
    } else if (Math.abs(iRelevanceMean) <= 50) {
      iContentScore += 1;
    }

    oContent.score = iContentScore;
  }

  aContents.sort(function(a,b){
    return a.score - b.score;
  });
}

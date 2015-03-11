var oUserData = {};

if (sessionStorage.userData) {
  oUserData = JSON.parse(sessionStorage.userData);
} else {
  oUserData = oDefaultUserSessionData;
}

sessionData = {
  viewedContentIds :[],
  tableColumns : ["Content Title","Financial Affinity","Internationality",
    "Digital Affinity", "Socioeconomics", "Family Status", "Cultural Type","Philantropy & Responsibility"],
  gridSize: 7,
  userData: oUserData
};

$(window).unload(function () {
  sessionStorage.userData = JSON.stringify(sessionData.userData);
});

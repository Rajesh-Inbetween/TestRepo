var oUserData = {};

if (sessionStorage.userData) {
  oUserData = JSON.parse(sessionStorage.userData);
} else {
  oUserData = oDefaultUserSessionData;
}

sessionData = {
  gridSize: 6,
  userData: oUserData
};

$(window).unload(function () {
  sessionStorage.userData = JSON.stringify(sessionData.userData);
});

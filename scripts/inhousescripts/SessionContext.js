var oUserData = {};

if (sessionStorage.userData) {
  debugger;
  oUserData = JSON.parse(sessionStorage.userData);
} else {
  oUserData = oDefaultUserSessionData;
}

sessionData = {
  userData: oUserData
};

$(window).unload(function () {
  debugger;
  sessionStorage.userData = JSON.stringify(sessionData.userData);
});
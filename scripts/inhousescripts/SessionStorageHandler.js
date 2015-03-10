var oUserData = {};

if (sessionStorage.userData) {
  oUserData = JSON.parse(sessionStorage.userData);
} else {
  oUserData = oDefaultUserSessionData;
}

sessionData = {
  userData: oUserData
};

$(window).unload(function () {
  sessionStorage.userData = JSON.stringify(sessionData.userData);
});

function SessionStorageHandler () {

  var oSessionStorage = sessionData;

  this.getSessionData = function () {

    return oSessionStorage;
  }

  this.setDataToSession = function (sKey, oData) {
    oSessionStorage[sKey] = oData;
  }

  this.getDataFromSession = function (sKey) {

    return oSessionStorage[sKey];
  }

}


SessionStorageHandler._instance = null;

SessionStorageHandler.getInstance = function () {

  if (!SessionStorageHandler._instance) {
    SessionStorageHandler._instance = new SessionStorageHandler();
  }

  return SessionStorageHandler._instance;
}

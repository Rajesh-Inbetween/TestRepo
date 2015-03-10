
function SessionStorageHandler () {

  var oSessionStorage = window.sessionStorage;

  this.getSessionData = function () {
    if (!oSessionStorage.getItem('dataModel')) {
      oSessionStorage.setItem('dataModel', {defaultUserContext: oDefaultUserSessionData});
    }

    return oSessionStorage.getItem('dataModel');
  }

  this.setDataToSession = function (sKey, oData) {
    oSessionStorage.dataModel[sKey] = oData;
  }

  this.getDataFromSession = function (sKey) {

    return oSessionStorage.dataModel[sKey];
  }

  this.clearSessionData = function () {
    oSessionStorage.clear();
  }

}


SessionStorageHandler._instance = null;

SessionStorageHandler.getInstance = function () {

  if (!SessionStorageHandler._instance) {
    SessionStorageHandler._instance = new SessionStorageHandler();
  }

  return SessionStorageHandler._instance;
}


function SessionStorageHandler () {

  var oSessionStorage = window.sessionStorage;

  this.getSessionData = function () {
    if (!oSessionStorage.getItem('dataModel')) {
      oSessionStorage.setItem('dataModel', JSON.stringify(oDefaultUserSessionData));
    }

    return JSON.parse(oSessionStorage.getItem('dataModel'));
  }

  this.setDataToSession = function (sKey, oData) {
    oSessionStorage.setItem(sKey, JSON.stringify(oData));
  }

  this.getDataFromSession = function (sKey) {

    return JSON.parse(oSessionStorage.getItem(sKey));
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

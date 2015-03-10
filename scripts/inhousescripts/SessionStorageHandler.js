
function SessionStorageHandler () {

}


SessionStorageHandler._instance = this.sessionStorage;

SessionStorageHandler.getCurrentSessionData = function () {


  if (!SessionStorageHandler._instance['dataModel']) {
    SessionStorageHandler._instance = defaultUserData;
  }

  return SessionStorageHandler._instance;
}

const venom = require("venom-bot");
const { clientOptions, responseActions } = require("../utils");
const { getClient, saveClient, removeClient } = require("./clients");

function loadWhatsapp(data, cb) {
  console.log("loadWhatsapp");
  if (!data.hasOwnProperty("userId")) {
    cb(responseActions.loadWhatsappError, { msg: "missing parameter userId" });
    return;
  }

  if (getClient(data.userId)) {
    console.log("client already present in memory");
    cb(responseActions.clientLoaded, {});
  } else {
    _createWhatsappClient(data.userId,
      (base64QrImg, asciiQR, attempts, /*urlCode*/) => { //qrCatcher
      // console.log("Number of attempts to read the qrcode: ", attempts);
      // console.log("Terminal qrcode: ", asciiQR);
        // console.log("base64 image string qrcode: ", base64QrImg);
        // console.log("urlCode (data-ref): ", urlCode);
        // sendJSON(ws, "qrCode", { base64QrImg: base64QrImg, asciiQR: asciiQR, attempts: attempts });
        cb(responseActions.waQrCode, { base64QrImg: base64QrImg, attempts: attempts });
      },
      (statusSession, session) => { //statusCatcher
      /*
       * Gets the return if the session is `isLogged` or `notLogged` or `browserClose`
       * or `qrReadSuccess` or `qrReadFail` or `autocloseCalled` or `desconnectedMobile`
       * or `deleteToken` or `Create session wss return "serverClose" case server for close`
       */
        // console.log("Status Session: ", statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
        //Create session wss return "serverClose" case server for close
        // console.log("Session name: ", session);
        cb(responseActions.waConnectionStatus, { statusSession: statusSession, session: session });
      },
      (client) => { // called after qr is scanned (or existing session is loaded)
        cb(responseActions.clientLoaded, {});
        saveClient(data.userId, client);
      }
    );
  }
}

function unloadWhatsapp(data, cb) {
  console.log("unloadWhatsapp");
  if (!data.hasOwnProperty("userId")) {
    cb(responseActions.unloadWhatsappError, { msg: "missing parameter userId" });
    return;
  }

  removeClient(data.userId);
}

function _createWhatsappClient(userId, qrCatcher, statusCatcher, cb) {
  venom.create(

    userId.toString(), // Pass the name of the client you want to start the bot

    qrCatcher,

    statusCatcher,

    clientOptions,

  ).then((client) => cb(client))
    .catch((error) => console.log(error));

}

module.exports = {
  loadWhatsapp,
  unloadWhatsapp,
};


const { sendJSON } = require("../utils");
const { actionHandlers, removeAllMsgListeners } = require("../bl");
const url = require("url");
const { responseActions, requestActions } = require("../utils");

let wsConnCounter = 0;

function onUpgrade(res, req, context) {
  // 1st thing to hit
  console.log("got new connection, checking for socket upgrade, URL: " + req.getUrl());
  // You can add logic to identify if connection is valid or not.

  // if(! req.getParameter(0)){
  //   upgradeAborted.aborted = true;
  // }

  const wsObj = {
    url: req.getUrl(),
  };

  res.onAborted(() => {
    console.log("Connection aborted!");
  });

  const secWebSocketKey = req.getHeader("sec-websocket-key");
  const secWebSocketProtocol = req.getHeader("sec-websocket-protocol");
  const secWebSocketExtensions = req.getHeader("sec-websocket-extensions");
  const upgradeAborted = { aborted: false };

  // const _cookie = req.getHeader('cookie');
  // if(!_cookie){
  //   upgradeAborted.aborted = true;
  // }
  // const _decodedCookie = decodeURIComponent(_cookie.split("=")[1]);

  if (upgradeAborted.aborted) {
    console.log("Aborted a request as it was unauthorized!");
    /* You must not upgrade now */ // res.close();
    res.cork(() => { res.writeStatus("401").write("Aborted your request as you are unauthorized!"); });
  } else {
    wsObj.connCount = ++wsConnCounter;

    res.upgrade(/* This immediately calls open handler, you must not use res after this call */
      wsObj,
      /* Use our copies here */
      secWebSocketKey,
      secWebSocketProtocol,
      secWebSocketExtensions,
      context
    );
  }
}

function onOpen(ws, req) {
  wsConnCounter += 1;
  ws.uniqueId = wsConnCounter; // to be shared among all sockets;
  console.log("onOpen", wsConnCounter);
  let userId = url.parse(req.url, true).query.userId;

  if (!userId) {
    sendJSON(ws, responseActions.warning, { msg: "no userId found in query parameteres, manually send loadWhatsapp action to load driver" });
    return;
  }
  sendJSON(ws, 'ready');
  _attachHandler(ws, requestActions.loadWhatsapp, { userId: userId });
}

function onMessage(ws, msg) {
  try {
    const jsonData = JSON.parse(msg); // {a: "action1", d: {uid: 1234}}
    console.log("_processMsg ", jsonData);
    _attachHandler(ws, jsonData.a, jsonData.d);
  } catch (ex) {
    console.log(ex);
  }
}

function _attachHandler(ws, action, data) {
  let handler = actionHandlers[action];

  if (!handler) {
    sendJSON(ws, responseActions.noHandler, { msg: "unrecognized event received" });
  } else {
    handler(data, (action, jsonData) => {
      // can be called multiple times to notify client from handler
      sendJSON(ws, action, jsonData);
    }, ws.uniqueId);
  }
}

function onClose(ws/*code, message*/) {
  _onWSDestroy(ws);
  console.log("WebSocket onClose");
}

function onError(ws/* error*/) {
  _onWSDestroy(ws);
  console.log("WebSocket onError");
}

function _onWSDestroy(ws) {
  removeAllMsgListeners(ws.uniqueId);
  wsConnCounter--;
}

module.exports = {
  onMessage,
  onUpgrade,
  onOpen,
  onClose,
  onError,
};

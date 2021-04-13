const WebSocket = require("ws");
const eventHandlers = require("./eventHandler");
const process = require("process");
const PORT = 10001;

const startWebsocketServer = () => {
  console.log('starting ws server on port', PORT);
  const wss = new WebSocket.Server({
    port: PORT,
    path: "/whatsapp",
    'Access-Control-Allow-Origin': "*"
  });
  wss.on("connection", (ws, request) => {
    ws.on("close", (code, reason) => {
      eventHandlers.onClose(ws, code, reason);
    });

    ws.on("error", (error) => {
      console.log("ws onError ", error);
      eventHandlers.onError(ws, error);
    });

    ws.on("message", (message) => {
      eventHandlers.onMessage(ws, message);
    });

    eventHandlers.onOpen(ws, request);

  });
};

process.title = "hpswhatsapp";
console.log("process pid ", process.pid, " process title ", process.title);

module.exports = {
  startWsServer: startWebsocketServer,
};

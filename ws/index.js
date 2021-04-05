const WebSocket = require("ws");
const eventHandlers = require("./eventHandler");
const process = require("process");
const PORT = 9099;

const startWebsocketServer = () => {
  const wss = new WebSocket.Server({
    port: PORT,
    path: "/whatsapp"
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

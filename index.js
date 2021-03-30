const { startWsServer } = require("./ws");
const { removeAllWAClients } = require("./bl");

process.on("uncaughtException", (ex, /*origin*/) => {
  console.log("Exception caught Server", JSON.stringify(ex, Object.getOwnPropertyNames(ex)));
});

process.on("SIGINT", function() {
  removeAllWAClients();
  process.exit();
});

startWsServer();

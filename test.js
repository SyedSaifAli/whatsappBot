const WebSocket = require("ws");

let wscons = {};
let connCounter = 0;
let connecttonThresh = 4000;
let ip = "localhost";
let port = "10001";

function connect(id) {
  let url = "ws://" + ip + ":" + port+ "/whatsapp";
  const ws = new WebSocket(url);
  wscons["" + id] = ws;

  ws.on("open", function() {
    console.log("onopen", id);
    if (connCounter < connecttonThresh) {
      connect(connCounter);
    }
    connCounter += 1;
  });

  ws.on("message", function(data) {
    console.log("onmsg", data);
  });

  ws.on("error", function(data) {
    console.log("error", data);
  });

  ws.on("close", function(data) {
    connCounter -= 1;
    console.log("close ", data, id, " total closed ", connCounter);
  });
}

connect(connCounter); // called recursively from open event

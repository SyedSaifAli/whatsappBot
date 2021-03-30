# WhatsappBot

## What is this repository for?
Simple websocket server using VenomBot for sending texts and images over whatsapp


## server receives data in JSON format consisting action(a) and data(d) keys
``` javascript

let req = {
  "a":"sendText",
  "d":{
    "userId": 1, // unique session id(token name) to save whatsapp token for subsequent automatic login
    "mob": "0123456789, 0123456789, 0123456789", // comma separated mobile numbers without country code
    "text": "send this text to all the contacts" // message to send to all contacts
  }
};

```

## how to get started

``` javascript

let ip = "192.168.29.79";
let port = "9099";
let tokenId = 1;
let url = "ws://" + ip + ":" + port +"/whatsapp?userId=" + tokenId;
const ws = new WebSocket(url);

// event listner method depends on Web-Socket client. This works on console of browsers
ws.addEventListener('open', function() {
  console.log("onopen",id);
});

ws.addEventListener('message', function(msg) {
  console.log("onmsg", msg); // will receive all response actions here, as soon as whatsapp client gets loaded
  // scan qr
  try {
    let data = JSON.parse(msg.data);
    if (data.a == "clientLoaded") {
      ws.send(JSON.stringify(req));
    }
  } catch(error) {
    console.log("Error ", error);
  }
});

ws.addEventListener('error', function(data) {
  console.log("error", data)
});

ws.addEventListener('close', function(data) {
  console.log("close ", data, id)
});


````

## server receives following web socket actions
``` javascript

const requestActions = { // ws client should send these actions only
  loadWhatsapp: "loadWhatsapp",
  sendText: "sendText",
  sendImage: "sendImage",
  getMessages: "getMessages",
  getUnreadMessages: "getUnreadMessages",
  unloadWhatsapp: "unloadWhatsapp",
  loadEarlierMessages: "loadEarlierMessages",
};

```


## server sends following web socket actions
``` javascript

const responseActions = { // client can expect these actions from ws server
  loadWhatsappError: "loadWhatsappError",
  sendTextError: "sendTextError",
  sendImageError: "sendImageError",
  getMessagesError: "getMessagesError",
  loadEarlierMessagesError: "loadEarlierMessages",
  unloadWhatsappError: "unloadWhatsappError",
  waQrCode: "waQrCode",
  waConnectionStatus: "waConnectionStatus",
  clientLoaded: "clientLoaded",
  noHandler: "noHandler",
  error: "error",
  warning: "warning",
  jobComplete: "jobComplete",  // generic action for any job completion status
  getMessages: "getMessages",
  getUnreadMessages: "getUnreadMessages",
};

```

## Capabilities

### loadWhatsapp -> to manually load whatsapp after unloading it, initially whatsapp is loaded using token id from queryString of websocket url.

### sendText -> to send message to multiple contacts at once

### sendImage -> to send image with caption to multiple contacts

### getMessages -> to load chat of particular contact, sometimes loads only few messages. send loadEarlierMessages action to load more messages

### getUnreadMessages -> to get contact wise unread messages with count and messages both


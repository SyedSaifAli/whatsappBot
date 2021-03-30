const clientOptions = {
  folderNameToken: "tokens", //folder name when saving tokens
  mkdirFolderToken: "", //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
  headless: true, // Headless chrome
  devtools: false, // Open devtools by default
  useChrome: true, // If false will use Chromium instance
  debug: false, // Opens a debug session
  logQR: false, // Logs QR automatically in terminal
  browserWS: "", // If u want to use browserWSEndpoint
  browserArgs: [ "" ], // Parameters to be added into the chrome browser instance
  puppeteerOptions: {}, // Will be passed to puppeteer.launch
  disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
  disableWelcome: true, // Will disable the welcoming message which appears in the beginning
  updatesLog: true, // Logs info updates automatically in terminal
  autoClose: 3600, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
  createPathFileToken: true, //creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
};

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

const requestActions = { // ws client should send these actions only
  loadWhatsapp: "loadWhatsapp",
  sendText: "sendText",
  sendImage: "sendImage",
  getMessages: "getMessages",
  getUnreadMessages: "getUnreadMessages",
  unloadWhatsapp: "unloadWhatsapp",
  loadEarlierMessages: "loadEarlierMessages",
};

function sendJSON(ws, action, json) {
  try {

    let obj = { a: action, d: json };
    console.log("sendJSON ", ws.readyState, obj);
    ws.send(JSON.stringify(obj));

  } catch (e) {
    console.log("error sending json ", e);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getChatIdFromMob(mob) {
  return "91" + mob + "@c.us";
}

function getProjectedMessagesFromRawArr (msgArr) {
  return msgArr.reduce((accumulator, currVal) => {
    accumulator.push({
      id: currVal.id,
      content: currVal.content,
      type: currVal.type,
      ts: currVal.timestamp,
      senderName: currVal.sender.formattedName
    });
    return accumulator;
  }, []);
}

function getUnreadProjectedMessagesFromArr (msgArr, groupAllowed) {
  return msgArr.reduce((accumulator, currVal) => {
    if (groupAllowed || !currVal.isGroup) {
      let obj = {
        user: {
          mob: currVal.contact.id.user,
          name: currVal.contact.name,
          pushName: currVal.contact.pushname,
        },
        unreadCount: currVal.unreadCount,
        messages: getProjectedMessagesFromRawArr(currVal.messages),
        notSpam: currVal.notSpam,
        type: currVal.kind,
      };
      if (groupAllowed) obj.isGroup = currVal.isGroup;
      accumulator.push(obj);
    }
    return accumulator;
  }, []);
}

module.exports = {
  clientOptions,
  sendJSON,
  responseActions,
  requestActions,
  getRandomInt,
  getChatIdFromMob,
  getProjectedMessagesFromRawArr,
  getUnreadProjectedMessagesFromArr,
};

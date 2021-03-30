const { loadWhatsapp, unloadWhatsapp } = require("./init");
const { sendText, getMessages, sendImage, loadEarlierMessages, getUnreadMessages } = require("./msg");
const { removeAllWAClients } = require("./clients");
const { requestActions } = require("../utils");

const actionHandlers = {
  [requestActions.loadWhatsapp]: loadWhatsapp,
  [requestActions.sendText]: sendText,
  [requestActions.getMessages]: getMessages,
  [requestActions.sendImage]: sendImage,
  [requestActions.unloadWhatsapp]: unloadWhatsapp,
  [requestActions.loadEarlierMessages]: loadEarlierMessages,
  [requestActions.getUnreadMessages]: getUnreadMessages,
};

module.exports = {
  actionHandlers,
  removeAllWAClients,
};

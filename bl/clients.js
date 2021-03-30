const _inMemWhatsappClients = {};

function saveClient (userId, client) {
  _inMemWhatsappClients[userId] = client;
}

function getClient (userId) {
  return _inMemWhatsappClients[userId];
}

function removeClient (userId) {
  console.log("removing in memory client for userId ", userId);
  if (_inMemWhatsappClients.hasOwnProperty(userId)) {
    _inMemWhatsappClients[userId].close();
  }
  delete _inMemWhatsappClients[userId];
  console.log("remaining clients count ", Object.keys(_inMemWhatsappClients).length);
}

function removeAllWAClients () {
  Object.keys(_inMemWhatsappClients).forEach((userId) => {
    removeClient(userId);
  });
}

module.exports = {
  saveClient,
  getClient,
  removeClient,
  removeAllWAClients,
};

var slackbot = require('node-slackbot');
const request = require('request');
const CDP = require('chrome-remote-interface');
var bot = new slackbot('KEY-GOES-HERE')


bot.use(function(message, cb) {
  if ('message' == message.type) {
      console.log(message);
  }
  cb();
});

bot.connect();

CDP((client) => {
    // extract domains
    const {Network, Page, Runtime} = client;
    global.Page = Page;
    // setup handlers
    Network.webSocketFrameReceived((params) => {
        if (params.response.payloadData.indexOf("subTitlesFileCreated") !== -1) {
          var data = JSON.parse(params.response.payloadData);
          if (data["id"] == "subTitlesFileCreated") {
              bot.sendMessage("C3YFR6CNS", data["speaker"] + ": " + data["text"]);
              console.log(data)
          }
        };
    });
    Network.enable();
}).on('error', (err) => {
    console.error('Cannot connect to remote endpoint:', err);
});
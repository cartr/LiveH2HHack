const slackbot = require('node-slackbot');
const request = require('request');
const CDP = require('chrome-remote-interface');
const say  = require('say');
const _ = require('lodash');

var API_TOKEN = process.env.SLACKBOT_API_TOKEN || null;
var bot = new slackbot(API_TOKEN);

var currentChannel = null;

var VOICES = _.shuffle([
    'Agnes',
    'Princess',
    'Vicki',
    'Victoria',
    'Alex',
    'Bruce',
    'Fred',
    'Junior',
    'Ralph'
]);
var userStack = {};

bot.use(function(message, cb) {
    if ('message' == message.type) {
        console.log(message)
        if (message.text.indexOf("!LiveH2H ") === 0) {
            currentChannel = message.channel;
            const meetingID = message.text.slice(9).replace(/-/g, "");
            const requestOptions = {
                url: 'https://sandbox.liveh2h.com/tutormeetweb/rest/v1/meetings/join',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    "meetingId": meetingID,
                    "name": "Slackbot"
                },
                json: true
            };
            request.post(requestOptions, function(error, response, body) {
                console.log("Got response")
                if (!error && response.statusCode == 200) {
                    bot.sendMessage(currentChannel, "Successfully joined meeting!");
                    Page.navigate({
                        url: body.data.meetingURL
                    }).then(() => {
                        Page.addScriptToEvaluateOnLoad({
                            scriptSource: "$('#islivetranscriptenabled').trigger('click');"
                        });
                    });
                } else {
                    console.log(error);
                    console.log(response);
                    console.log(body);
                }
          })
      } else if (message.channel == currentChannel) {
          if (!(message.user in userStack)) {
              userStack[message.user] = VOICES.pop();
          }
          console.log(VOICES, userStack, message.user);
          say.speak(message.text, userStack[message.user]);
      }
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
              bot.sendMessage(currentChannel, data["speaker"] + ": " + data["text"]);
              console.log(data)
          }
        };
    });
    Network.enable();
}).on('error', (err) => {
    console.error('Cannot connect to remote endpoint:', err);
});

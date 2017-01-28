var slackbot = require('node-slackbot');

var API_TOKEN = process.env.SLACKBOT_API_TOKEN || null;

var bot = new slackbot(API_TOKEN);


bot.use(function(message, cb) {
  if ('message' == message.type) {
      console.log(message);
  }
  cb();
});

bot.connect();


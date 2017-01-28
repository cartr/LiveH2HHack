var slackbot = require('node-slackbot');
var bot = new slackbot('xoxp-134546539991-133787358531-133149689360-6c85b8b0d7cf6c0f65dd0186d09e733e')

bot.use(function(message, cb) {
  if ('message' == message.type) {
      console.log(message);
  }
  cb();
});

bot.connect();


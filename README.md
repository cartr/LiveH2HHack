LiveH2H Slackbot
================

This is code for a minimum viable product slackbot for liveh2h.

# Installation

```sh
$ npm install
```

## Get API Token and Setup Environment

Create a slackbot API token from [this link](https://api.slack.com/docs/oauth-test-tokens) and set it to the environment variable.

```sh
$ export SLACKBOT_API_TOKEN="YOUR API Token"
```

## Start Chrome headless

Start a headless Chrome instance that the server will use to handle the calls.

```sh
$ chrome --headless --remote-debugging-port=9222 http://example.com
```

You'll also need to set up loopback audio, so the audio output of the `npm` command is sent to the audio input of `chrome`. This is necessary for the text-to-speech feature to work.

## Start Server

```sh
$ npm start
```

Once your server has started setup initialize your slackbot into your liveh2h session by using `!LiveH2H H2H Session`

![Session](./img/session.png)


Now all chat sessions from this liveh2h session will be updated in realtime on slack!

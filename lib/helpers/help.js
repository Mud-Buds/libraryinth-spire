module.exports = (input, response, error) => {
  switch(input){
    case 'register':
    case 'signup':
      response = {
        msg: '/signup &lt;username&gt; &lt;password&gt;<br /><br />\
        Sign up by typing this command in the box below with your username and password. You need to have an account to chat and play.<br /><br />',
        // <pre style="color:goldenrod; font-weight: bold;">    /signup <span style="color:lime">&lt;username&gt; &lt;password&gt;</span></pre>',
        style: 'help',
        html: true
      };
      break;
    case 'login':
      response = {
        msg: '/login &lt;username&gt; &lt;password&gt;<br /><br />\
        Log in by typing this command in the box below with your username and password. You need to be logged in to play.<br /><br />',
        style: 'help',
        html: true
      };
      break;
    case 'whisper':
      response = {
        msg: '/whisper &lt;username&gt; &lt;message&gt;<br /><br />\
        Chat Only. Use this command to send a private message to another user.<br /><br />\
        &nbsp;&nbsp;Aliases: /w, /t, /tell <br />\
        &nbsp;&nbsp;Example: /whisper Ryan Does this seem okay?<br /><br />',
        style: 'help',
        html: true
      };
      break;
    case 'emote':
      response = {
        msg: '/emote &lt;message&gt;<br /><br />\
        Chat Only. Allows you to show yourself taking an action in chat instead of sending a message.<br /><br />\
        &nbsp;&nbsp;Aliases: /m, /me, /e, /em <br />\
        &nbsp;&nbsp;Example: /me laughs at how ridiculous emotes are.<br /><br />',
        style: 'help',
        html: true
      };
      break;
    case 'who':
      response = {
        msg: '/who<br /><br />\
        Chat Only. List all users currently in the channel.<br /><br />',
        style: 'help',
        html: true
      };
      break;
    default:
      if(!input) {
        response = {
          msg: '/help &lt;message&gt;<br /><br />\
          To interact with the game, try using actions like look, use, take, and talk. You can use /help <command> to see help info about that command. Help is available for the following commands:<br /><br />\
          &nbsp;&nbsp;signup<br />\
          &nbsp;&nbsp;login<br />\
          &nbsp;&nbsp;whisper<br />\
          &nbsp;&nbsp;emote<br /><br />',
          style: 'help',
          html: true
        };
      } else {
        error = {
          msg: 'No help entry found for <span style="color:lime">' + input + '</span>',
          style: 'help',
          html: true
        };
      }
  }

  return Promise.resolve({ response, error });
};

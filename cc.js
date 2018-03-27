var Discord = require('discord.js');
var bot = new Discord.Client();
var isReady = true;
const settings = require('./settings.json');

bot.on('message', message => {
  if (isReady && message.content === 'tocar')
  {
  isReady = false;
  var voiceChannel = message.member.voiceChannel;
  voiceChannel.join().then(connection =>
  {
     const dispatcher = connection.playFile('./1.mp3');
     dispatcher.on("end", end => {
       voiceChannel.leave();
       });
   }).catch(err => console.log(err));
   isReady = true;
  }
});


bot.login(settings.token);

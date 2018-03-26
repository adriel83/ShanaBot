
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
var musica = 'home/adrieldragon/1.mp3';
client.on('ready',() => {
	console.log('Pronta para salvar o dia');
	client.user.setPresence({ status: 'online', game: { name: 'o Yuuji da sacada' } });
});
client.on('message', message => {
  if (message.content === 'avatar') {
    message.channel.send(message.author.avatarURL);
  }
});
client.on('message', message => {
  if (message.content === 'canal') {
  const channel = message.member.voiceChannel;
  channel.join()
  .then(connection => console.log('Conectada'))
  .catch(console.error);
  }
});
client.on('message', message => {

		if(message.content== 'sair') {
	const channel = message.member.voiceChannel;
	channel.leave();
  }
});
client.on('message', message => {
	if (message.author === client.user) return;
	if (message.content.startsWith('Vc me ama?')) {
		message.channel.sendMessage('Claro, Baka');
	}
});
client.on('message', message => {
  if (message.content === 'tocar')
  {
  var voiceChannel = message.member.voiceChannel;
  voiceChannel.join().then(connection =>
  {
     const dispatcher = connection.playFile(musica);
     dispatcher.on("end", end => {
       });
   }).catch(err => console.log(err));
  }
});

client.login(settings.token);

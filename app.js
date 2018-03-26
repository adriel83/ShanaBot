
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

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
	client.leaveVoiceChannel(message.author.voiceChannel);
  }
});
client.on('message', message => {
	if (message.author === client.user) return;
	if (message.content.startsWith('Vc me ama?')) {
		message.channel.sendMessage('Claro, Baka');
	}
});

client.login(settings.token);

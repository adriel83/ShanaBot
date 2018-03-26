
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
var musica = 'home/adrieldragon/1.mp3';
client.on('ready',() => {
	console.log('Pronta para salvar o dia');
	client.user.setPresence({ status: 'online', game: { name: 'o Yuuji da sacada' } });
});
client.on('message', message => {
  if (message.content === 'tocar'){
  message.member.voiceChannel.join().then(connection =>
  {
     var voiceChannel = message.member.voiceChannel;
     const dispatcher = connection.playFile(musica);
     dispatcher.on("end", end => {
       voiceChannel.leave();
       });
   }).catch(err => console.log(err));
  }
});
client.on('message', message => {
  if (message.content === 'avatar') {
    message.channel.send(message.author.avatarURL);
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
client.login(settings.token);

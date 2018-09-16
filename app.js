const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const broadcast = client.createVoiceBroadcast();
client.on('ready',() => {
	console.log('Pronta para salvar o dia');
	client.user.setPresence({ status: 'online', game: { name: 'o Yuuji da sacada' } });
});
var tocando = 0;
client.on('message', message => {
  if (message.content === 'avatar') {
    message.channel.send('Seu avatar '+ message.author.avatarURL);
}
});
client.on('message', message => {
if (message.content.startsWith('tocar')){
	if (tocando === 0) {
		const channel = message.member.voiceChannel;
		if (!channel) return message.channel.send('Você não está em um canal de voz.');
		var link = message.content.slice('tocar'.length)
		channel.join()
		.then(connection => {
		const stream = ytdl(link, { filter : 'audioonly' });
		broadcast.playStream(stream);
		tocando = 1;
		const dispatcher = connection.playBroadcast(broadcast);
            /*if (connection.speaking = false) {
                dispatcher.end();
                tocando = 0;
            }*/
		})
	}else if (tocando === 1) {
		return message.channel.send('Já existe uma musica tocando');
	}
}
});
client.on('message', message => {
if(message.content== 'sair') {
	const channel = message.member.voiceChannel;
	broadcast.end();
	tocando = 0;
	channel.leave();
  }
});
client.login(settings.token);

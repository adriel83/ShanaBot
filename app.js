
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
var musica = 'home/adrieldragon/1.mp3';
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const broadcast = client.createVoiceBroadcast();
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
        const channel = message.member.voiceChannel;
	if(message.content== 'tocar')
	channel.join()
	  .then(connection => {
	    const stream = ytdl('https://www.youtube.com/watch?v=dXdkYVNnuhs', { filter : 'audioonly' });
	    broadcast.playStream(stream);
	    const dispatcher = connection.playBroadcast(broadcast);
	  })
	  .catch(console.error);
})
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

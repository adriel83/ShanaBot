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
client.on('message', message => {
  if (message.content === 'avatar') {
    message.channel.send('Seu avatar '+ message.author.displayAvatarURL);
}
});
client.on('message', message => {
        const channel = message.member.voiceChannel;

	if(message.content== 'tocar')
	channel.join()
	  message.channel.send('manda o link');
		if (message.content == message.content) {
			const link = message.content;
			(connection => {
				const stream = ytdl(link, { filter : 'audioonly' });
				broadcast.playStream(stream);
				const dispatcher = connection.playBroadcast(broadcast);
			})
			console.log('Tocando')
		}

});
client.on('message', message => {
	if(message.content== 'tocar 2')
	channel.join()
	(connection => {
	    const stream = ytdl('https://www.youtube.com/watch?v=vh5qg6baBY8', { filter : 'audioonly' });
	    broadcast.playStream(stream);
	    const dispatcher = connection.playBroadcast(broadcast);
	  })
		console.log('Tocando')
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

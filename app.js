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
        const channel = message.member.voiceChannel;
        if (!channel) return message.channel.send('Você não está em um canal de voz.');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if(!permissions.has('CONNECT')){
            return message.channel.send('Não posso entrar nesse canal.');
        }
        if(!permissions.has('SPEAK')){
            return message.channel.send('Não posso falar nesse canal.');
        }
        var link = message.content.slice('tocar'.length)
        channel.join()
            .then(connection => {
                const stream = ytdl(link, { filter : 'audioonly' });
                broadcast.playStream(stream);
                const dispatcher = connection.playBroadcast(broadcast);
                dispatcher.on('end',reason => {
                    channel.leave();
                })
            })
    }
});

client.on('message', message => {
if(message.content== 'sair') {
	const channel = message.member.voiceChannel;
	broadcast.end();
	if (channel){
        channel.leave();
    }else{
        return message.channel.send('Não estou em um canal de voz.');
    }
  }
});
client.login(settings.token);

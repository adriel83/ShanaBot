
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

client.on('ready',() => {
	console.log('Pronta para salvar o dia');
	client.user.setGame('o Yuuji da sacada')
});

client.on('message', message => {
	 if (!message.content.startsWith(prefix) || message.author.bot) return;
	if (message.author === client.user) return;
	if (message.content.startsWith('Vc me ama?')) {
		message.channel.send('Claro, Baka');
	}
});

client.login(settings.token);

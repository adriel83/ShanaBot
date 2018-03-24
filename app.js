
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

client.on('ready',() => {
	console.log('I\'m Online\nI\'m Online');
});

var prefix = "-"
client.on('message', message => {
	if (message.author === client.user) return;
	if (message.content.startsWith(prefix + 'fon')) {
		message.channel.sendMessage('fon');
	}
});

client.login(settings.token);

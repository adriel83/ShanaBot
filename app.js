const Discord = require('discord.js');
const fs = require('fs');
const settings = require('./settings.json');
const prefix = settings.prefix;
const client = new Discord.Client();
client.commands = new Discord.Collection();
const arquivosComandos = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const arquivo of arquivosComandos) {
    const comando = require(`./comandos/${arquivo}`);
    client.commands.set(comando.name, comando);
}

client.once('ready', () => {
    console.log('Ikkuso!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Houve um erro na execução desse comando.');
    }
});

client.login(settings.token).then( ()=>
    console.log("Loguei")
);

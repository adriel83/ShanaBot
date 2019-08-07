const Discord = require('discord.js');
const fs = require('fs');
const settings = require('./settings.json');
const prefix = settings.prefix;
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const arquivosComandos = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const arquivo of arquivosComandos) {
    const comando = require(`./comandos/${arquivo}`);
    client.commands.set(comando.name, comando);
}
console.log(client.commands);

client.once('ready', () => {
    console.log('Ikkuso!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const nomeComando = args.shift().toLowerCase();
    const comando = client.commands.get(nomeComando);

    if (!client.commands.has(comando)) return;

    //Argumentos
    if(comando.args && !args.length){
        let reply = `${message.author}, você não colocou nenhum argumento.!`;
        if(comando.usage){
            reply += `\nVocê deve usar: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    //Cooldowns
    if (!cooldowns.has(comando.name)) {
        cooldowns.set(comando.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(comando.name);
    const quantidadeCooldown = (comando.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const tempoExpiracao = timestamps.get(message.author.id) + quantidadeCooldown;
        if (now < tempoExpiracao) {
            const tempoRestante = (tempoExpiracao - now) / 1000;
            return message.reply(`Opa, faltam ${tempoRestante.toFixed(1)} segundo(s) de cooldown.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), quantidadeCooldown);


    try {
        comando.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Houve um erro na execução desse comando.');
    }
});

client.login(settings.token).then( ()=>
    console.log("Loguei")
);

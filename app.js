const Discord = require('discord.js');
const fs = require('fs');
const settings = require('./settings.json');
const prefixo = settings.prefixo;
const client = new Discord.Client({ intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ]});
const cooldowns = new Discord.Collection();
const arquivosComandos = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

client.comandos = new Discord.Collection();
for (const arquivo of arquivosComandos) {
    const comando = require(`./comandos/${arquivo}`);
    client.comandos.set(comando.name, comando);
}

client.once('ready', () => {
    console.log('Ikkuso!');
});

client.on('error', error =>{
   client.destroy().then(() => {
       console.log("Ocorreu um erro, "+error);
   });
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefixo) || message.author.bot) return;
    console.log(message.content.startsWith(prefixo));

    const args = message.content.slice(prefixo.length).split(/ +/);
    const nomeComando = args.shift().toLowerCase();
    const comando = client.comandos.get(nomeComando) || client.comandos.find(cmd => cmd.alias && cmd.alias.includes(nomeComando));


    if (!comando) {console.log(`Comando não encontrado:${comando}`); return}

    //Argumentos
    if(comando.args && !args.length){
        let reply = `${message.author}, você não colocou nenhum argumento.!`;
        if(comando.usage){
            reply += `\nVocê deve usar: \`${prefixo}${comando.name} ${comando.usage}\``;
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
).catch((err)=>{
    console.log(err);
});


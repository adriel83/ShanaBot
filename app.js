const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const ytdl = require('ytdl-core');

//Bom, ela conecta, pega o url mas não toca e não dá erro.

let fila = {};

const commands = {
    'tocar' :(message) =>{
        if (fila === undefined) return message.channel.send(`Coloque uma música na fila.`);
        if (fila.playing) return message.channel.send('Já estou tocando.');
        if (!message.guild.voiceConnection) return commands.join(message).then(() => commands.play(message));
        let dispatcher;
        fila.playing = true;

        function tocar(song){
            message.channel.send(`Tocando:*${song.title}`);
            dispatcher = message.guild.voiceConnection.playStream(ytdl(song.url, { audioonly: true }));
        }
    },
    'entrar' : (message) =>{
        const channel = message.member.voiceChannel;
        if (!channel || channel.type !== 'voice') return message.reply('Não posso entrar nesse canal.');
        channel.join();
    },
    'sair' : (message) =>{
        const channel = message.member.voiceChannel;
        if (!channel || channel.type !== 'voice') return message.reply('Não estou em um canal de voz.');
        channel.leave();
    },
    'fila': (message) => {
        if (fila === undefined) return message.channel.send(`Adicione uma musica á fila.`);
        let tosend = [];
        fila.songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.url} - Pedido por: ${song.requester}`);});
        message.channel.send(`\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
        // message.channel.send(tosend.length);

    },
    'adicionar': (message) => {
        let url = message.content.split(' ')[1];
        //if (url == '' || url === undefined) return msg.channel.sendMessage();
        ytdl.getInfo(url, (err, info) => {
            if(err) return message.channel.send('Link Inválido: ' + err);
            fila.playing = false, fila.songs = [];
            fila.songs.push({url: url, title: info.title, requester: message.author.username});
            message.channel.send(`**${info.title}** adicionado á fila`);
        });
    },
}

client.on('message', message => {
    if (commands.hasOwnProperty(message.content.toLowerCase().split(' ')[0])) commands[message.content.toLowerCase().split(' ')[0]](message);
});

client.on('ready',() => {
    console.log('Pronta para salvar o dia');
    client.user.setPresence({ status: 'online', game: { name: 'o Yuuji da sacada' } });
});

client.login(settings.token);

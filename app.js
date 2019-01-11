const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const ytdl = require('ytdl-core');
url = "https://www.youtube.com/watch?v=Nn7aQYyKsQM";

//Bom, ela conecta, pega o url mas não toca e não dá erro.

let fila = {};

const commands = {
    'tocar' :(message) =>{
        if (fila[message.guild.id] === undefined) return message.channel.send(`Coloque uma música na fila.`);
        if (fila[message.guild.id].playing) return message.channel.send('Já estou tocando.');
        // if (!message.guild.voiceConnection) return commands.entrar(message).then(()=> commands.tocar(message));
        let dispatcher;
        fila[message.guild.id].playing = true;
        // console.log(fila);
        (function tocar(song) {
            console.log(song);
            if (song === undefined) return message.channel.send('a Fila está vazia.').then(() => {
                fila[message.guild.id].playing = false;
                message.member.voiceChannel.leave();
            });
            message.channel.send(`Tocando: **${song.title}`);
            dispatcher = message.guild.voiceConnection.playStream(ytdl(url, { audioonly: true }));
            // dispatcher.on('end', () => {
            //     tocar(fila[message.guild.id].songs.shift());
            // });
            dispatcher.on('error', (err) => {
                return message.channel.send('Erro Dispatcher: ' + err).then(() => {
                    console.log(err)
                    // tocar(fila[message.guild.id].songs.shift());
                });
            });
        })(fila[message.guild.id].songs.shift());;
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
        if (fila[message.guild.id] === undefined) return message.channel.send(`Adicione uma musica á fila.`);
        let tosend = [];
        fila[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} ${song.url} - Pedido por: ${song.requester}`);});
        message.channel.send(`\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
        // message.channel.send(tosend.length);

    },
    'adicionar': (message) => {
        let url = message.content.split(' ')[1];
        //if (url == '' || url === undefined) return msg.channel.sendMessage();
        ytdl.getInfo(url, (err, info) => {
            if(err) return message.channel.send('Link Inválido: ' + err);
            if (!fila.hasOwnProperty(message.guild.id)) fila[message.guild.id] = {},fila[message.guild.id].playing = false, fila[message.guild.id].songs = [];
            fila[message.guild.id].songs.push({url: url, title: info.title, requester: message.author.username});
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

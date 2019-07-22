const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const ytdl = require('ytdl-core');
const http = require('http');

let fila = {};
let prefixo = null;
let dispatcher;

function tocar(song) {
    console.log(song);
    if (song === undefined) return message.channel.send('a Fila está vazia.').then(() => {
        fila[message.guild.id].playing = false;
        message.member.voiceChannel.leave();
    });
    message.channel.send(`Tocando: **${song.title}**`);
    dispatcher = message.guild.voiceConnection.playStream(ytdl(song.url, { audioonly: true }));
    client.user.setPresence({ status: 'online', game: { name: `Tocando: ${song.title}` } });
    dispatcher.on('end', () => {
        tocar(fila[message.guild.id].songs.shift());
    });
    dispatcher.on('error', (err) => {
        return message.channel.send('Erro Dispatcher: ' + err).then(() => {
            console.log(err);
            tocar(fila[message.guild.id].songs.shift());
        });
    });
}


const commands = {
    'tocar' :(message) =>{
        if (fila[message.guild.id] === undefined) return message.channel.send(`Coloque uma música na fila.`);
        if (fila[message.guild.id].playing) return message.channel.send('Já estou tocando.');
        if (!message.guild.voiceConnection) return commands.entrar(message).then(()=> commands.tocar(message));
        fila[message.guild.id].playing = true;
        client.user.setPresence({ status: 'online', game: { name: 'o Yuuji da sacada' } });
        tocar();
    },
    'entrar' : (message) =>{
        return new Promise((resolve,reject)=>{
            const channel = message.member.voiceChannel;
            if (!channel) return message.reply('Você não está em um canal de voz.');
            if(channel){
                if (channel.type !== 'voice') return message.reply('Não posso entrar nesse canal.');
                channel.join().then(connection => {
                    resolve(connection)
                }) .catch(err => reject(err));
            }
            fila[message.guild.id].songs.shift();
        });
    },
    'sair' : (message) =>{
            let channel = client.voiceConnections.first();
            if (!channel) return message.reply('Não estou em um canal de voz.');
            channel.disconnect();
    },
    'fila': (message) => {
        if (fila[message.guild.id] === undefined || fila[message.guild.id].songs.keys() > 0) return message.channel.send(`A fila está vazia, adicione uma musica á fila usando "adicionar."`);
        let tosend = [];
        fila[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title}, URL: ${song.url} - Pedido por: ${song.requester}`);});
        if(!tosend.length > 0){
            return message.channel.send(`A fila está vazia, adicione uma musica á fila usando adicionar`);
        }
        message.channel.send(`\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);

    },
    'adicionar': (message) => {
        let url = message.content.split(' ')[1];
        if (url === '' || url === undefined) return message.channel.send("Link Inválido");
        ytdl.getInfo(url, (err, info) => {
            if(err) return message.channel.send('Link Inválido: ' + err);
            if (!fila.hasOwnProperty(message.guild.id)) fila[message.guild.id] = {},fila[message.guild.id].playing = false, fila[message.guild.id].songs = [];
            fila[message.guild.id].songs.push({url: url, title: info.title, requester: message.author.username, skip:message.author.id});
            // message.react(;
            message.channel.send(`**${info.title}** adicionado á fila`);
        });
    },
    'pular' : (message) => {
        if (fila[message.guild.id] === undefined || fila[message.guild.id].songs.keys() > 0) return message.channel.send(`A fila está vazia, adicione uma musica á fila usando "adicionar."`);
        if((message.author.id) === fila[message.guild.id].songs[1].skip){
            tocar(fila[message.guild.id].songs.shift());
            return message.reply(`Pulando **${info.title}**`);
        }
        if(!(message.author.id) === fila[message.guild.id].songs[1].skip){
            return message.reply(`Você não pode pular a música de outra pessoa.`);
        }
    },
    'eval' : (message) => {
        function clean(text) {
            if (typeof(text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }
        const args = message.content.split(" ").slice(1);
        if (message.content.startsWith("eval")) {
            if(message.author.id !== settings.ownerID) return;
            try {
                const code = args.join(" ");
                let evaled = eval(code);
                message.channel.send(clean(evaled), {code:"xl"});
            } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
        }
    },
    'prefixo':(message) =>{
        if(message.toString().length <= 0){
            message.channel.send(`Para adicionar um prefixo, use "prefixo + o prefixo que você quer."`);
        }
        if (!prefixo.hasOwnProperty(message.guild.id)){
            prefixo[message.guild.id] = message.toString();
        }
    }
};

client.on('message', message => {
    if(prefixo){
        if (commands.hasOwnProperty(message.content.toLowerCase().split(' ')[0])) commands[message.content.toLowerCase().split(' ')[0]](message);
    }
    if (prefixo = null){
        message.channel.send("Defina um prefixo para os comandos.");
    }
});

client.on('ready',() => {
    http.createServer((req, res) => {
        res.writeHead(200, {
            'Content-type': 'text/plain'
        });
        res.write('Hey');
        res.end();
        console.log('Servidor Rodando');
    }).listen(4000);
    console.log('Pronta para salvar o dia');
    client.user.setActivity('HorribleSubs',{type: 'WATCHING'})
        .then(presence => console.log(`Mudei a presença pra:  ${presence.game ? presence.game.name : 'none'}`))
        .catch(console.error);
});

client.login(settings.token).then( ()=>
    console.log("Loguei")
);

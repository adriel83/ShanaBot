const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const ytdl = require('ytdl-core');

//Status de conexão fica 1 pra sempre, talvez esteja relacionado á promessas.

let fila = {};
client.on('debug', console.log);

const commands = {
    'tocar' :(message) =>{
        if (fila[message.guild.id] === undefined) return message.channel.send(`Coloque uma música na fila.`);
        if (fila[message.guild.id].playing) return message.channel.send('Já estou tocando.');
        if (!message.guild.voiceConnection) return commands.entrar(message).then(()=> commands.tocar(message));
        let dispatcher;
        fila[message.guild.id].playing = true;
        (function tocar(song) {
            console.log(song);
            if (song === undefined) return message.channel.send('a Fila está vazia.').then(() => {
                fila[message.guild.id].playing = false;
                message.member.voiceChannel.leave();
            });
            message.channel.send(`Tocando: **${song.title}**`);
            dispatcher = message.guild.voiceConnection.playOpusStream(ytdl(song.url, { audioonly: true }));
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
        })(fila[message.guild.id].songs.shift());
        client.user.setPresence({ status: 'online', game: { name: 'o Yuuji da sacada' } });
    },
    'entrar' : (message) =>{
        return new Promise((resolve,reject)=>{
            const channel = message.member.voiceChannel;
            if (!channel) return message.reply('Você não está em um canal de voz.');
            if(channel){
                if (channel.type !== 'voice') return message.reply('Não posso entrar nesse canal.');
                channel.join().then(connection => {
                    message.reply('Entrei');
                    resolve(connection)
                }) .catch(err => reject(err));
            }
        });
    },
    'sair' : (message) =>{
        return new Promise((resolve,reject)=>{
            const channel = message.member.voiceChannel;
            if (!channel) return message.reply('Não estou em um canal de voz.');
            channel.leave();
        });
    },
    'fila': (message) => {
        if (fila[message.guild.id] === undefined) return message.channel.send(`Adicione uma musica á fila.`);
        let tosend = [];
        fila[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title}, URL: ${song.url} - Pedido por: ${song.requester}`);});
        message.channel.send(`\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);

    },
    'adicionar': (message) => {
        let url = message.content.split(' ')[1];
        if (url === '' || url === undefined) return message.channel.send("Link Inválido");
        ytdl.getInfo(url, (err, info) => {
            if(err) return message.channel.send('Link Inválido: ' + err);
            if (!fila.hasOwnProperty(message.guild.id)) fila[message.guild.id] = {},fila[message.guild.id].playing = false, fila[message.guild.id].songs = [];
            fila[message.guild.id].songs.push({url: url, title: info.title, requester: message.author.username});
            message.channel.send(`**${info.title}** adicionado á fila`);
        });
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
    }
}

client.on('message', message => {
    if (commands.hasOwnProperty(message.content.toLowerCase().split(' ')[0])) commands[message.content.toLowerCase().split(' ')[0]](message);
});

client.on('ready',() => {
    console.log('Pronta para salvar o dia');
    client.user.setPresence({ status: 'online', game: { name: 'o Yuuji da sacada' } });
});

client.login(settings.token);

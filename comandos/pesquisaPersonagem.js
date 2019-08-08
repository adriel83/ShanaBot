const Discord = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();

module.exports = {
    name: 'pesquisarp',
    description: 'Pesquisa um personagem no MAL.!',
    args: true,
    usage: '<nome do personagem>',
    alias: ['pp'],
    cooldown: 5,
    execute(message, args) {
        nome = message.author.username;
        nomePersonagem = args;
        // message.channel.send("O "+ nome + " ama muito a "+ nomeWaifu);
        //TODO:Resolver promesas rejeitadas.
        mal.search('character', nomePersonagem, 1).then((result) =>{
            personagem = result.results[0];
            console.log(result.results[0]);
            // message.reply(", não encontrei ninguem chamado " + nomePersonagem);
            mal.findCharacter(waifu.mal_id, '').then((result) =>{
                console.log(result);
                personagem = result;
                const embedWaifu = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(personagem.name)
                    .setColor("BLUE")
                    .setImage(personagem.image_url)
                    .setDescription(personagem.name_kanji + '\n' + personagem.nicknames[0])
                    .addField('Página no MAL', waifu.url)
                    .addField('Anime origem', personagem.animeography[0].name +'\n'+ personagem.animeography[0].url, true)
                    .setURL(personagem.animeography[0].url)
                    // .addBlankField()
                    .setTimestamp();
                message.channel.send(embedWaifu);
            });
        });

    },
};

const Discord = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();

module.exports = {
    name: 'waifu',
    description: 'Mostra o amor à sua waifu.!',
    args: true,
    usage: '<waifu>',
    cooldown: 5,
    execute(message, args) {
        nome = message.author.username;
        nomeWaifu = args;
        // message.channel.send("O "+ nome + " ama muito a "+ nomeWaifu);

        mal.search('character', nomeWaifu, 1).then((result) =>{
            waifu = result.results[0];
            mal.findCharacter(waifu.mal_id, '').then((result) =>{
                console.log(result);
                waifu = result;
                const embedWaifu = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(waifu.name)
                    .setColor("BLUE")
                    .setImage(waifu.image_url)
                    .setDescription(waifu.name_kanji + '\n' + waifu.nicknames[0])
                    .addField('Página no MAL', waifu.url)
                    .addField('Anime origem', waifu.animeography[0].name +'\n'+ waifu.animeography[0].url, true)
                    .setURL(waifu.animeography[0].url)
                    // .addBlankField()
                    .setTimestamp();
                message.channel.send(embedWaifu);
            });
        });

    },
};

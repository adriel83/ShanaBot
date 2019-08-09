const Discord = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();

//TODO: Implementar um coletor de reação na mensagem que o bot envia para poder determinar qual personagem pesquisar no MAL

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
        mal.search('character', nomePersonagem, 1).then((result) =>{
            personagem = result.results[0];

            personagens = result.results;
            for (i = 0; i < personagens.length; i++){
                personagens[i].anime.sort((a,b) => (a.mal_id > b.mal_id) ? 1 : ((b.mal_id> a.mal_id) ? -1 : 0))
            }
            // console.log(animePersonagens);
            console.log(personagens[0].anime[0]);
            console.log(personagens[1].anime[0]);
            console.log(personagens[2].anime[0]);
            console.log(personagens[3].anime[0]);

            // console.log(personagens[0].anime);

            const embedSelecao = new Discord.RichEmbed()
                .addField(`1  ${personagens[0].name}`, personagens[0].anime[0].name, false)
                .addField(`2  ${personagens[1].name}`, personagens[1].anime[0].name, false)
                .addField(`3  ${personagens[2].name}`, personagens[2].anime[0].name, false)
                .addField(`4  ${personagens[3].name}`, personagens[3].anime[0].name, false)
                .addField(`4  ${personagens[4].name}`, personagens[4].anime[0].name, false)
                .setTimestamp();

            message.channel.send(embedSelecao);
            // message.react();

            //:one:, :two: ,:three: ,:four:
            const filter = (reaction, user) => reaction.emoji.name === ":one:" && user.id === message.author.id;
            message.awaitReactions(filter, { time: 15000 })
                .then(collected => console.log(`Collected ${collected.size} reactions`))
                .catch(console.error);

            mal.findCharacter(personagem.mal_id, '').then((result) =>{
                // console.log(result);
                personagem = result;
                const embedWaifu = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(personagem.name)
                    .setColor("BLUE")
                    .setImage(personagem.image_url)
                    .setDescription(personagem.name_kanji + '\n' + personagem.nicknames[0])
                    .addField('Página no MAL', waifu.url)
                    .addField('Anime origem', personagem.animeography[0].name +'\n'+ personagem.animeography[0].url, true)
                    .addField('Dublador(a)', personagem.voice_actors[0] , true)
                    .setURL(personagem.animeography[0].url)
                    // .addBlankField()
                    .setTimestamp();
                message.channel.send(embedWaifu);
            }).catch(() =>{
                // message.channel.send(`Não encontrei nenhum personagem chamado ${nomePersonagem}.`);
            });
        });

    },
};

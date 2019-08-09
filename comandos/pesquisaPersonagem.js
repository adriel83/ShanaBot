const Discord = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();
function criarDescricao (personagens){
    var anime;
    var nome;
    let c;
    for (i = 0; i<personagens.length && i < 10; i++){
        if(personagens[i] !== undefined){
            nome = personagens[i].name;
            anime = personagens[i].anime[0].name;
        }
        if(i===0){
            c = `${i+1}: Nome: ${nome} \n Anime: ${anime} \n \n`;
        }
        c += `${i+1}: Nome: ${nome} \n Anime: ${anime} \n \n`;
    }
    return c;
}
//TODO: Implementar um coletor de reação na mensagem que o bot envia para poder determinar qual personagem pesquisar no MAL
//TODO: Implementar uma maneira de preencher o embed dinamicamente, com no máximo 5 personagem(talvez fazer paginação também).
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
            var animePersonagens = [];
            for (i = 0; i < personagens.length; i++){
                personagens[i].anime.sort((a,b) => (a.mal_id > b.mal_id) ? 1 : ((b.mal_id> a.mal_id) ? -1 : 0));
            }
            const embedSelecao = new Discord.RichEmbed()
                .setTitle("Resultados")
                .setDescription(criarDescricao(personagens))
                .setTimestamp();
            message.channel.send(embedSelecao);


            //React de mensagem
            //:one:, :two: ,:three: ,:four:
            // const filter = (reaction, user) => reaction.emoji.name === ":one:" && user.id === message.author.id;
            // message.awaitReactions(filter, { time: 15000 })
            //     .then(collected => console.log(`Collected ${collected.size} reactions`))
            //     .catch(console.error);

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

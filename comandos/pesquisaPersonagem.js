const Discord = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();
function criarDescricao (personagens){
    let c = "";
    for (i = 0; i < personagens.length && i<10; i++){
        let personagem = personagens[i];
        let nome = personagem.name;
        let anime = personagem.anime;
        let manga = personagem.manga;
        let nomeAnime = "";
        let nomeManga = "";
        if(typeof anime !== 'undefined' && anime.length > 0){
            nomeAnime = anime[0].name;
            c += `${i+1}: **${nome}** \n ${nomeAnime} \n \n`;
        }else
        if(typeof manga !== 'undefined' && manga.length > 0){
            nomeManga = manga[0].name;
            c += `${i+1}: **${nome}** \n ${nomeManga} \n \n`;
        }
        // console.log(anime);
        // anime = personagens[i].anime[1].name;
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
            personagens = result.results;
            let numerosFiltro = [];
            for (i = 0; i<personagens.length && i < 10; i++){
                numerosFiltro += i.toString();
                console.log(numerosFiltro);
            }
            for (i = 0; i < personagens.length; i++){
                personagens[i].anime.sort((a,b) => (a.mal_id > b.mal_id) ? 1 : ((b.mal_id> a.mal_id) ? -1 : 0));
            }
            const embedSelecao = new Discord.RichEmbed()
                .setTitle("Resultados")
                .setDescription(criarDescricao(personagens))
                .setTimestamp();
            message.channel.send(embedSelecao);
            message.channel.send("Escolha o personagem desejado enviando o numero correspondente").then(() => {
                let i;
                // const filter =  m => numerosFiltro.includes(m.content);
                message.channel.awaitMessages(response => {
                        for(i = 0; i<numerosFiltro.length; i++){
                            if(response.content === numerosFiltro[i]){
                                return true
                            }
                        }
                }
                    , {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                })
                    .then(collected => {
                        mal.findCharacter(personagens[i-1].mal_id, '').then((result) =>{
                            // console.log(result);
                            personagem = result;
                            const embedWaifu = new Discord.RichEmbed()
                                .setColor('#0099ff')
                                .setTitle(personagem.name)
                                .setColor("BLUE")
                                .setImage(personagem.image_url)
                                .setDescription(personagem.nicknames[0])
                                .addField('Página no MAL', personagem.url)
                                .addField('Anime origem', personagem.animeography[0].name +'\n'+ personagem.animeography[0].url, true)
                                .addField('Dublador(a)', personagem.voice_actors[0].name , true)
                                .setURL(personagem.animeography[0].url)
                                // .addBlankField()
                                .setTimestamp();
                            message.channel.send(embedWaifu);
                        });
                    })
                    .catch(collected => {
                        message.channel.send('O tempo acabou.');
                    });
            });


            //React de mensagem
            //:one:, :two: ,:three: ,:four:
            // const filter = (reaction, user) => reaction.emoji.name === ":one:" && user.id === message.author.id;
            // message.awaitReactions(filter, { time: 15000 })
            //     .then(collected => console.log(`Collected ${collected.size} reactions`))
            //     .catch(console.error);

        }).catch((response) => {
            console.log(response);
            message.channel.send(`Nao encontrei nenhum personagem chamado ${nomePersonagem}`);
        });

    },
};

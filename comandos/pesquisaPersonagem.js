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
    }
    return c;
}
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
        mal.search('character', nomePersonagem, 1).then((result) =>{
            personagens = result.results;
            let numerosFiltro = [];
            for (i = 0; i<personagens.length && i < 10; i++){
                numerosFiltro += i.toString();
                console.log(numerosFiltro);
            }
            for (i = 0; i < personagens.length; i++){
                personagens[i].anime.sort((a,b) => (a.mal_id > b.mal_id) ? 1 : ((b.mal_id > a.mal_id) ? -1 : 0));
            }
            const embedSelecao = new Discord.RichEmbed()
                .setTitle("Resultados")
                .setDescription(criarDescricao(personagens))
                .setTimestamp();
            // message.channel.send(, embedSelecao);
            message.channel.send("Escolha o personagem desejado enviando o numero correspondente", embedSelecao).then((msg) => {
                let i;
                message.channel.awaitMessages(response => {
                        for(i = 0; i<numerosFiltro.length; i++){
                            if(response.content === numerosFiltro[i]){
                                response.delete();
                                return true
                            }
                        }
                }
                    , {
                    max: 1,
                    time: 10000,
                    errors: ['time'],
                })
                    .then(collected => {
                        mal.findCharacter(personagens[i-1].mal_id, '').then((result) =>{
                            personagem = result;
                            console.log(personagem.voice_actors);
                            const embedWaifu = new Discord.RichEmbed()
                                .setColor('#0099ff')
                                .setTitle((personagem.name) ? personagem.name : '')
                                .setColor("BLUE")
                                .setImage(personagem.image_url)
                                .setDescription((personagem.nicknames[0]) ? personagem.nicknames[0] : '')
                                .addField('Página no MAL', personagem.url)
                                .addField('Obra', personagem.animeography[0].name +'\n'+ personagem.animeography[0].url, true)
                                .addField('Dublador(a)', personagem.voice_actors[0].name , true)
                                .setURL(personagem.animeography[0].url)
                                .setTimestamp();
                            message.channel.send(embedWaifu);
                            msg.delete();
                        });
                    })
                    .catch(collected => {
                        message.channel.send('O tempo acabou.');
                        msg.delete();
                    });
            });
        }).catch((response) => {
            console.log(response);
            message.channel.send(`Nao encontrei nenhum personagem chamado ${nomePersonagem}`);
        });
    },
};

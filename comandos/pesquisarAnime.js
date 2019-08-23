const Discord = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();
function criarDescricao (animes){
    let c = "";
    for (i = 0; i < animes.length && i<10; i++){
        let anime = animes[i];
        let nome = anime.title;
        let score = anime.score;
        let url = anime.url;
        c += `${i+1}: **${nome}** \n **Nota:**${score} \n \n`;
    }
    return c;
}
module.exports = {
    name: 'pesquisara',
    description: 'Pesquisa um anime no MAL.!',
    args: true,
    usage: '<nome do anime>',
    alias: ['pa'],
    cooldown: 5,
    execute(message, args) {
        nome = message.author.username;
        nomeAnime = args;
        mal.search('anime', nomeAnime, 1).then((result) =>{
            let animes = result.results;
            let numerosFiltro = [];
            for (i = 0; i<animes.length && i < 10; i++){
                numerosFiltro += i.toString();
            }
            const embedSelecao = new Discord.RichEmbed()
                .setTitle("Resultados")
                .setDescription(criarDescricao(animes))
                .setTimestamp();
            message.channel.send(embedSelecao);
            message.channel.send("Escolha o anime desejado enviando o numero correspondente").then(() => {
                let i;
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
                        mal.findAnime(animes[i-1].mal_id).then((result) =>{
                            console.log(result);
                            anime = result;
                            const embedAnime = new Discord.RichEmbed()
                                .setColor('#0099ff')
                                .setTitle(anime.title)
                                .setColor("BLUE")
                                .setImage(anime.image_url)
                                .setDescription(anime.title_japanese)
                                .addField('Página no MAL', anime.url)
                                .addField('Membros', anime.members, true)
                                .addField('Estúdio', anime.studios[0].name, true)
                                .setURL(anime.url)
                                .setTimestamp();
                            message.channel.send(embedAnime);
                        });
                    })
                    .catch(collected => {
                        message.channel.send('O tempo acabou.');
                    });
            });
        }).catch((response) => {
            console.log(response);
            message.channel.send(`Nao encontrei nenhum personagem chamado ${nomePersonagem}`);
        });
    },
};

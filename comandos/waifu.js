module.exports = {
    name: 'waifu',
    description: 'Mostra o amor à sua waifu.!',
    args: true,
    usage: '<waifu>',
    cooldown: 5,
    execute(message, args) {
        nome = message.author.username;
        nomeWaifu = args[0];
        message.channel.send("O "+ nome + " ama muito a "+ nomeWaifu);
    },
};

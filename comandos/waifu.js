module.exports = {
    name: 'waifu',
    description: 'Mostra o amor à sua waifu.!',
    args: true,
    usage: '<waifu>',
    cooldown: 5,
    execute(message, args) {
        message.channel.send(`Ò {message.author.name} ama muito a {args[0]}.`);
    },
};

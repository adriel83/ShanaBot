module.exports = {
    name: 'avatar',
    description: 'Responde o seu avatar!',
    execute(message, args) {
        console.log(message.author.avatarURL());
        message.channel.send({ files: [message.author.avatarURL({size: 4096})] });
    },
};

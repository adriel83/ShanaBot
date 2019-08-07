const Attachment = require('discord.js');
module.exports = {
    name: 'avatar',
    description: 'Responde o seu avatar!',
    execute(message, args) {
        const att = new Attachment(`${message.author.avatarURL}`);
        message.channel.send(`O seu avatar:${att}` );
    },
};

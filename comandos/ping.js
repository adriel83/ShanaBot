module.exports = {
    name: 'ping',
    description: 'Pinga no servidor e retorna o tempo de resposta!',
    execute(message, args) {
        message.channel.send("Ping: " + Math.round(message.client.ping) + ' ms');
    },
};

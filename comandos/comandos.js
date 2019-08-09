const prefixo = require('../settings.json');
module.exports = {
    name: 'comandos',
    description: 'Lista todos os comandos ou informa sobre uma comando especifico.',
    usage: '[nome do comando]',
    cooldown: 5,
    execute(message, args) {
        const data = [];

        const {comandos} = message.client.comandos;
        //Comando não especificado
        if(!args.length){
            data.push('Aqui vai uma lista de todos os comandos:');
            data.push(comandos.map(comando =>  comando.name).join(', '));
            data.push(`Você pode enviar "${prefixo}comandos <nome do comando>" para saber 
                                                            mais informações sobre o mesmo`);
            return message.author.send(data, {split: true}).then(() => {
                if(message.channel.type === 'dm') return;
                message.reply("Te mandei um pv com todos os meus comandos.");
                }).catch(error =>{
                    console.error(`Não consegui enviar um pv para:${message.author.tag}.\n`, error);
                    message.reply(`Não consigo te mandar pv, verifique suas configurações de privacidade.`);
            })
        }
        //Comando especifico
        const nome = args[0].toLowerCase();
        const comando = comandos.get(nome);

        if(!comando){
            message.reply(`Esse comando não existe, para saber todos os comandos digite "${prefixo}comandos"`);
        }
        data.push("Nome do comando:" + comando.title);
        if(comando.description) {data.push("Descrição:" + comando.description);}
        if(comando.cooldown) {data.push("Cooldown:" + comando.cooldown);}
        if(comando.usage)       {data.push(`Como usar: ${prefix}${comando.name} ${comando.usage}`)}
        message.reply(data, {split : true});
    },
};

exports.run =  async (client, message, args) => {
    try {
        const lista = require("../index.js");
        const Discord = require("discord.js");
        const config = require("../config.json");
        var voicechannel = message.member.voice.channel;
        var serverQueue = lista.queue.get(message.guild.id);
        if(serverQueue) {
            var embed = new Discord.MessageEmbed()
            .setDescription(`***・Estou tocando música no momento!***`)
            .setColor(config.embedColor)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            if(serverQueue.music === true) return message.channel.send(embed)
        }
        if(message.guild.members.cache.get(client.user.id).voice.channel) {
            if(voicechannel) {
                if(message.member.voice.channel === message.guild.members.cache.get(client.user.id).voice.channel) {
                    let vc = message.guild.members.cache.get(client.user.id).voice.channel;
                    message.guild.members.cache.get(client.user.id).voice.kick().catch(()=>{});
                    var embed = new Discord.MessageEmbed()
                    .setDescription(`***・Acabei sair do canal de voz **__${vc.name}__** com sucesso!***`)
                    .setColor(config.embedColor)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
                    message.channel.send(embed).catch(()=>{});
                } else {
                    var embed = new Discord.MessageEmbed()
                    .setDescription(`***・Você não esta conectado no mesmo canal que eu!***`)
                    .setColor(config.embedColor)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
                    message.channel.send(embed).catch(()=>{});
                };
            } else {
                var embed = new Discord.MessageEmbed()
                .setDescription(`***・Entre em algum canal de voz!***`)
                .setColor(config.embedColor)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(embed).catch(()=>{});
            };
        } else {
            var embed = new Discord.MessageEmbed()
            .setDescription(`***・Não estou conectado em nenhum canal de voz!***`)
            .setColor(config.embedColor)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            message.channel.send(embed).catch(()=>{});
        };
    } catch (e) {
        console.log(e);
    };
}
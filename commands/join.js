const Discord = require('discord.js')
const config = require ('../config.json')

exports.run =  async (client, message) => {
    try {
        var voicechannel = message.member.voice.channel;
        var embed = new Discord.MessageEmbed()
        .setDescription(`***・Você não esta em algum canal de voz!***`)
        .setColor(config.embedColor)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
        if(!voicechannel) return message.channel.send(embed).catch(()=>{})
        var embed = new Discord.MessageEmbed()
        .setDescription(`***・Eu já estou em um canal de voz!***`)
        .setColor(config.embedColor)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
        if(message.guild.members.cache.get(client.user.id).voice.channel) return message.channel.send(embed).catch(()=>{})
        return new Promise((resolve, reject) => {
            var permissions = voicechannel.permissionsFor(message.client.user);
            var embed = new Discord.MessageEmbed()
            .setDescription(`***・Eu não tenho permissão de entrar nesse canal de voz!***`)
            .setColor(config.embedColor)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            if(!permissions.has('CONNECT')) return message.channel.send(embed).catch(()=>{})
            if(voicechannel && voicechannel.type == 'voice') {
                voicechannel.join().then(connection => {
                    client.speakers = [];
                    resolve(connection);
                    var embed = new Discord.MessageEmbed()
                    .setDescription(`***・Conectei no canal de voz: **__\`${voicechannel.name}\`__** com sucesso!***`)
                    .setColor(config.embedColor)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
                    message.channel.send(embed).catch(()=>{})
                }).catch(err => reject(err));
            } else {
                var embed = new Discord.MessageEmbed()
                .setDescription(`***・Você não está em algum canal de voz!***`)
                .setColor(config.embedColor)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(embed).catch(()=>{})
            }
        })
    } catch (e) {
        console.log(e)
    }
}
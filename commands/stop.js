const lista = require('../index.js')
const Discord = require('discord.js')
const config = require ('../config.json')

exports.run =  async (client, message, args) => {
    try {
        var serverQueue = lista.queue.get(message.guild.id)
        if(!serverQueue) {
            var embed = new Discord.MessageEmbed()
            .setDescription(`${message.author} ***・Não estou tocando nada no momento!***`)
            .setColor(config.embedColor)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            return message.channel.send(embed).catch(()=>{})
        } else if(message.member.voice.channel !== message.guild.members.cache.get(client.user.id).voice.channel) {
            var embed = new Discord.MessageEmbed()
            .setDescription(`${message.author} ***・Você não está no mesmo canal que eu!***`)
            .setColor(config.embedColor)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            return message.channel.send(embed).catch(()=>{})
        } else {
            if (serverQueue.soms) {
                serverQueue.soms = [];
                serverQueue.connection.dispatcher.end('Stop');
                var embed = new Discord.MessageEmbed()
                .setDescription(`${message.author} ***・Musica parada com sucesso!***`)
                .setColor(config.embedColor)
                .setFooter(message.author.username, message.author.avatarURL())
                .setTimestamp();
                return message.channel.send(embed).catch(()=>{})
            }
        }
    } catch (e) {
        console.log(e)
    }
}
const Discord = require('discord.js')
const lista = require('../index.js')
const config = require('../config.json')

exports.run =  async (client, message) => {
  const serverQueue = lista.queue.get(message.guild.id)
  if(!serverQueue) {
    var embed = new Discord.MessageEmbed()
    .setDescription(`***・Não estou tocando nada!***`)
    .setColor(config.embedColor)
    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
    return message.channel.send(embed).catch(()=>{})
  }
  if(message.member.voice.channel !== message.guild.members.cache.get(client.user.id).voice.channel) {
    var embed = new Discord.MessageEmbed()
    .setDescription(`***・Você não esta conectado no mesmo canal que eu!***`)
    .setColor(config.embedColor)
    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
    return message.channel.send(embed).catch(()=>{})
  } else {
    if (serverQueue.restart) {
        serverQueue.restart = false
        message.react('🔄').catch(()=>{})
        var embed = new Discord.MessageEmbed()
        .setDescription(`***・Loop Desativado com sucesso!***`)
        .setColor(config.embedColor)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
        return message.channel.send(embed).catch(()=>{})
    } else {
        serverQueue.restart = true
        message.react('🔄').catch(()=>{})
        var embed = new Discord.MessageEmbed()
        .setDescription(`***・Loop Ativado com sucesso!***`)
        .setColor(config.embedColor)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
        return message.channel.send(embed).catch(()=>{})
    }
  }
}
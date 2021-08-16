const Discord = require('discord.js')
const lista = require('../index.js')
const config = require('../config.json')

exports.run =  async (client, message) => {
  const serverQueue = lista.queue.get(message.guild.id)
  if(!serverQueue) {
    var embed = new Discord.MessageEmbed()
    .setDescription(`${message.author}***・Não estou tocando nada!***`)
    .setColor(config.embedColor)
    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
    return message.channel.send(embed).catch(()=>{})
  }
  if(message.member.voice.channel !== message.guild.members.cache.get(client.user.id).voice.channel) {
    var embed = new Discord.MessageEmbed()
    .setDescription(`${message.author}***・Você não esta conectado no mesmo canal que eu!***`)
    .setColor(config.embedColor)
    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
    return message.channel.send(embed).catch(()=>{})
  } else {
    if (serverQueue.soms) {
    }
    serverQueue.restart = true
    serverQueue.connection.dispatcher.end('Restart');
    setTimeout(() => {
        serverQueue.restart = false
    }, 5000);
    message.react('🔄').catch(()=>{})
  }
}
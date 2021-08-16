const Discord = require('discord.js')
const lista = require('../index.js')
const config = require('../config.json')

exports.run =  async (client, message) => {
  const serverQueue = lista.queue.get(message.guild.id)
  if(!serverQueue) {
    var embed = new Discord.MessageEmbed()
    .setDescription(`${message.author}***・A fila de musica está vazia!***`)
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
      if (serverQueue.soms[0].author !== message.author.id) {
      }
      serverQueue.repeat = 0
      serverQueue.connection.dispatcher.end('Skip');
      message.react('⏩').catch(()=>{})
    }
  }
}
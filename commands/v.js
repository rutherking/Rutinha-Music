const lista = require('../index.js')
const Discord = require('discord.js')
const config = require ('../config.json')

exports.run =  async (client, message, args) => {
    try {
        var serverQueue = lista.queue.get(message.guild.id);
        var deleteCount = parseInt(args[0], 10);
        if(!serverQueue) {
            var embed = new Discord.MessageEmbed()
            .setDescription(`${message.author}***・Não estou tocando musica no momento!***`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
            .setColor(config.embedColor)
            .setTimestamp();
            return message.channel.send(embed).catch(()=>{})
        } else if(message.member.voice.channel !== message.guild.members.cache.get(client.user.id).voice.channel) {
            var embed = new Discord.MessageEmbed()
            .setDescription(`${message.author}***・Você não está em nenhum canal de voz!***`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
            .setColor(config.embedColor)
            .setTimestamp();
            return message.channel.send(embed).catch(()=>{})
        } else if(serverQueue.music) {
            if(!args[0]) {
                var embed = new Discord.MessageEmbed()
                .setTitle(`***・Volume***`)
                .setDescription(`***・O volume atual é:*** **__${serverQueue.volume}__**!`)
                .addField('***・Inserido Por:***', `***${message.author} \`${message.author.id}\`***`, true)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setColor(config.embedColor)
                .setTimestamp();
                return message.channel.send(embed).catch(()=>{})
            } else if(isNaN(args[0])) {
                var embed = new Discord.MessageEmbed()
                .setDescription(`${message.author} ***・Use apenas numeros para alterar o volume!***`)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setColor(config.embedColor)
                .setTimestamp();
                return message.channel.send(embed).catch(()=>{})
            } else if(!deleteCount || deleteCount < 1 || deleteCount > 100) {
                var embed = new Discord.MessageEmbed()
                .setTitle(`***・Volume***`)
                .setDescription(`***・Use apenas numeros de*** **\`1\` à \`100\`**!`)
                .addField('***・Inserido Por:***', `***${message.author} \`${message.author.id}\`***`, true)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setColor(config.embedColor)
                .setTimestamp();
                return message.channel.send(embed).catch(()=>{})
            } else {
                if (serverQueue.soms) {
                    if (serverQueue.soms[0].author !== message.author.id) {
                    }
                    var embed = new Discord.MessageEmbed()
                    .setTitle(`***・Volume***`)
                    .setDescription(`***・Volume alterado para:*** **__${args[0]}%__**!`)
                    .addField('***・Inserido Por:***', `***${message.author} \`${message.author.id}\`***`, true)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
                    .setColor(config.embedColor)
                    .setTimestamp();
                    return message.channel.send(embed).then(()=>{
                        serverQueue.volume = args[0];
                        serverQueue.connection.dispatcher.setVolume(args[0] / 100);
                    }).catch(()=>{})    
                }
            }
        }
    } catch (e) {
        console.log(e)    
    }
}
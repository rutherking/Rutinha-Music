const lista = require('../index.js')
const Discord = require("discord.js");
const moment = require('moment')
const config = require ('../config.json')
require('moment-duration-format')
moment.locale('pt-BR')

exports.run =  async (client, message, args) => {
    try {
        var serverQueue = lista.queue.get(message.guild.id)
        if(!serverQueue) {
            var embed = new Discord.MessageEmbed()
            .setDescription(`${message.author}***・Não estou tocando nenhuma musica!***`)
            .setColor(config.embedColor)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            message.channel.send(embed).catch(()=>{})
        } else {
            var inicio = lista.queue.get(message.guild.id).inicio
            var timeAtual = (new Date() - inicio)/1000
            var atual = moment.duration.format([moment.duration((timeAtual*1000))], 'hh:mm:ss').toString()
            atual = atual.length === 2 ? `00:${atual}` : atual
            var npE = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .addField(`***・Tocando Agora - Repetições [${parseInt(serverQueue.repeat)}]***`, `***・${serverQueue.soms[0].title}***`, false)
            .addField('***・Inserido Por:***', `***${message.author} \`${message.author.id}\`***`, true)
            .setThumbnail(serverQueue.soms[0].thumb)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter(message.guild)
            message.channel.send(npE).then(async music => {
                await music.react('🔄').catch(()=>{})
                await music.react('⏩').catch(()=>{})
                await music.react('⏹').catch(()=>{})
                var restart = music.createReactionCollector((r, u) => r.emoji.name === "🔄" && u.id === message.author.id, { time: 30000 });
                var stop = music.createReactionCollector((r, u) => r.emoji.name === "⏹" && u.id === message.author.id, { time: 30000 });
                var skip = music.createReactionCollector((r, u) => r.emoji.name === "⏩" && u.id === message.author.id, { time: 30000 });
                restart.on("collect", async r => {
                    if (serverQueue.soms) {
                        serverQueue.restart = true
                        serverQueue.connection.dispatcher.end('Restart');
                        setTimeout(() => {
                            serverQueue.restart = false
                        }, 5000);
                        music.delete()
                        message.delete()
                    }
                })
                skip.on("collect", async r => {
                    if (serverQueue.soms) {
                        if (serverQueue.soms[0].author !== message.author.id) {
                        }
                        serverQueue.repeat = 0
                        serverQueue.connection.dispatcher.end('Skip');
                        music.delete()
                        message.delete()
                    }
                })
                stop.on("collect", async r => {
                    if (serverQueue.soms) {
                        if (serverQueue.soms[0].author !== message.author.id) {
                        }
                        serverQueue.soms = [];
                        serverQueue.connection.dispatcher.end('Stop');
                        music.delete()
                        message.delete()
                    }
                })
            })
        } 
    } catch (e) {
        console.log(e)
    }
}
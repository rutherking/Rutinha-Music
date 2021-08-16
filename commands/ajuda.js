const discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, message, args) =>{
    let Ajuda = new discord.MessageEmbed()
    .setTitle("***・Menu de Ajuda:***")
    .setDescription("***・Criado com amor por Ruther!***")
    .addField(`***・Comandos de Música:***`,`\`${config.prefix}play ou p\`,\`${config.prefix}disconnect ou d\`,\`${config.prefix}join\`,\`${config.prefix}loop ou l\`,\`${config.prefix}now\`,\`${config.prefix}lista\`,\`${config.prefix}restart\`,\`${config.prefix}skip ou s\`,\`${config.prefix}stop\`,\`${config.prefix}volume ou v\``)
    .addField(`***・Comando para convidar o bot!***`,`\`${config.prefix}convite\``)
    .setColor(config.embedColor)
    .setTimestamp()
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .setFooter(message.author.tag, message.author.displayAvatarURL());
    message.delete().catch(O_o => {});
    message.channel.send(Ajuda).catch(()=>{})
}
console.log('[Bot-Ruther] => Bot Online...');
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');
//////////////////////Queue//////////////////////
const queue = new Map()
exports.queue = queue
//////////////////////Ready//////////////////////
client.on("ready", () => {
  console.log(`[Bot-Ruther] => Bot Online! [${client.guilds.cache.size} Servidores & ${client.users.cache.size} Membros]`)
  let presence = [{
    name:`${config.prefix}ajuda, By Ruther`,
  }]

  var randomStatus = presence[Math.floor(Math.random() * presence.length)];
  client.user.setPresence({activity: randomStatus});
  setInterval(function() {
    var randomStatus = presence[Math.floor(Math.random() * presence.length)];
    client.user.setPresence({activity: randomStatus});
  }, 1 * 10000)
});
//////////////////////Message//////////////////////
client.on("message", (message) => {
  if (message.channel.type == "dm") return;
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;
  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);
  let args = message.content.split(" ").slice(1);
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (e) {
    message.reply(` ***・Esse comando não existe ou foi ultilizado de maneira incorreta, Utilize \`${config.prefix}ajuda\` para saber os comandos!*** `);
  }    
})
//////////////////////Login//////////////////////
client.login(config.token).catch(()=>{console.log("Token Invalido...")})



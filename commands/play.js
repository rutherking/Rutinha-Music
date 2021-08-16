const ytdl = require('ytdl-core')
const YouTube = require('simple-youtube-api')
const Discord = require('discord.js')
const lista = require('../index.js')
const config = require ('../config.json')
const youtube = new YouTube(config.youtubeAPI)

exports.run =  async (client, message, args) => {
    const voiceChannel = message.member.voice.channel;
    var serverQueue = lista.queue.get(message.guild.id);
    if(serverQueue) {
        if(serverQueue.radio == true) lista.queue.delete(message.guild.id);
        if(voiceChannel !== message.guild.members.cache.get(client.user.id).voice.channel) {
            var embed = new Discord.MessageEmbed()
            .setDescription(`${message.author} ***・Você não esta conectado no mesmo canal que eu!***`)
            .setColor(config.embedColor)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            return message.channel.send(embed).catch(()=>{})
        }
    }
    let nada = new Discord.MessageEmbed()
    .setDescription(`${message.author} ***・Insira Um [Link,Nome,PlayList]***`)
    .setColor(config.embedColor)
    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
    if(!args[0]) return message.channel.send(nada).catch(()=>{})

    var searchString = args.slice(0).join(' ')
    var url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
    var embed = new Discord.MessageEmbed()
    .setDescription(`${message.author} ***・Entre em algum canal de voz!***`)
    .setColor(config.embedColor)
    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
	if(!voiceChannel) return message.channel.send(embed).catch(()=>{})

    var permissions = voiceChannel.permissionsFor(message.client.user);
    var embed = new Discord.MessageEmbed()
    .setDescription(`${message.author} ***・Eu não tenho permissão de entrar nesse canal de voz!***`)
    .setColor(config.embedColor)
    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
    if(!permissions.has('CONNECT')) return message.channel.send(embed).catch(()=>{})

    var embed = new Discord.MessageEmbed()
    .setDescription(`${message.author} ***・Eu não tenho permissão de falar nesse canal de voz!***`)
    .setColor(config.embedColor)
    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
	if(!permissions.has('SPEAK')) return message.channel.send(embed).catch(()=>{})

    if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        var tumb = message.guild.iconURL()
        if(!tumb) tumb = message.author.displayAvatarURL()
        var embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} ***・Conectando ao __Youtube__...***`)
        .setColor(config.embedColor)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
        message.channel.send(embed).then((Ma)=>{
            setTimeout(async()=>{
                var embed = new Discord.MessageEmbed()
                .setDescription(`${message.author} ***・Pesquisando a __PlayList__ inserida...***`)
                .setColor(config.embedColor)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                Ma.edit(embed).then((Mb)=>{
                    return OKp(Mb)
                }).catch(()=>{})
            }, 1000)
        }).catch(()=>{})
        async function OKp(Mb) {
            setTimeout(() => {
                youtube.getPlaylist(url).then(async playlist => {
                    playlist.getVideos().then(async videos => {
                        if(videos.length >= 150) {
                            var embed = new Discord.MessageEmbed()
                            .setDescription(`${message.author} ***・Não é possivel colocar PlayList's com mais de **__150__** Musicas!***`)
                            .setColor(config.embedColor)
                            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp();
                            Mb.edit(embed).catch(()=>{})
                        } else {
                            for (const video of Object.values(videos)) {
                                await handleVideo(video, message, voiceChannel, true);
                            }
                            message.channel.startTyping()
                            var embed = new Discord.MessageEmbed()
                            .addFields(

                                { name: `***・Playlist Adicionada***`, value: `***・Músicas:  ${videos.length}***\n`},
                                { name: `***・Inserida Por:***`, value: `***${message.author} \`${message.author.id}\`***`},

                            )
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
                            .setColor(config.embedColor)
                            .setTimestamp();           
                            Mb.edit(embed).catch(()=>{})
                            message.channel.stopTyping()
                        }
                    })
                }).catch(() => {
                    var embed = new Discord.MessageEmbed()
                    .setDescription(`${message.author} ***Essa __PlayList__ não existe!***`)
                    .setColor(config.embedColor)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
                    Mb.send(embed).catch(()=>{})
                })
            }, 1000)
        }
	} else if(args.length === 1 && args[0].startsWith('https://www.youtube.com/watch?v=')) {
        try {
            await youtube.getVideo(url).then(vid => {
                return handleVideo(vid, message, voiceChannel)
            })
        } catch (e) {
            var embed = new Discord.MessageEmbed()
            .setDescription(`${message.author} ***・Não encontrei essa musica no __Youtube__!***`)
            .setColor(config.embedColor)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            message.channel.send(embed).catch(()=>{})
        }
    } else {
        var embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} ***・Conectando ao __Youtube__...***`)
        .setColor(config.embedColor)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
        message.channel.send(embed).then((Ma)=>{
            setTimeout(async()=>{
                var embed = new Discord.MessageEmbed()
                .setDescription(`${message.author} ***・Pesquisando a __Musica__ inserida...***`)
                .setColor(config.embedColor)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                Ma.edit(embed).then((Mb)=>{
                    return OK(Mb)
                }).catch(()=>{})
            }, 1000)
        }).catch(()=>{})
        async function OK(Mb) {
            var serverQueue = lista.queue.get(message.guild.id);    
            var videos = await youtube.searchVideos(searchString, 5)
            if(!videos.length > 0 || videos.length < 5) {        
                setTimeout(async () => { 
                    var embed = new Discord.MessageEmbed()
                    .setDescription(`${message.author}***・Não encontrei nenhum resultado...***`)
                    .setColor(config.embedColor)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
                    Mb.edit(embed).catch(()=>{})
                }, 1200)
            } else {
                var tumb = message.guild.iconURL
                if(!tumb) tumb = message.author.displayAvatarURL()
                var index = 0
                var razao = args.slice(0).join(' ')
                setTimeout(async () => {
                    var embed = new Discord.MessageEmbed()
                    .setTitle(`***・Resultados da Pesquisa:*** ***__${razao}__***`)
                    .setDescription(`\n${videos.map(video2 => `***・${++index}*** ***・${video2.title}***`).join('\n\n')}\n\n***・Escreva o número que corresponde a musica que você desejas!***\n***・Caso queira cancelar digite '__cancelar__'***`)
                    .setColor(config.embedColor)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
                    .setTimestamp();
                    Mb.edit(embed).then((msg)=>{
                        message.channel.awaitMessages(message1 => message1.content && message1.author.id === message.author.id, {
                            max: 1,
                            time: 20000,
                            errors: ['time']
                        }).then(async coletado => {
                            var mes = coletado.first().content === '**cancelar**' || coletado.first().content > 0 && coletado.first().content < 6
                            if(coletado.first().content === '**cancelar**') {
                                cancelou();
                            } else if(coletado.first().content > 0 && coletado.first().content < 6) {
                                var num = parseInt(coletado.first().content);
                                var video = await youtube.getVideoByID(videos[num - 1].id); 
                                await handleVideo(video, message, voiceChannel);
                            } else if(!mes) {
                                var embed = new Discord.MessageEmbed()
                                .setDescription(`${message.author} ***・Resposta Invalida! Tente Novamente...***`)
                                .setColor(config.embedColor)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                                .setTimestamp();
                                Mb.edit(embed).catch(()=>{})
                            }
                            msg.delete().catch(()=>{})
                        }).catch(err => {
                            msg.delete().catch(()=>{})
                            var embed = new Discord.MessageEmbed()
                            .setDescription(`${message.author} ***・Tempo Expirado! Tente Novamente...***`)
                            .setColor(config.embedColor)
                            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp();
                            Mb.edit(embed).catch(()=>{})
                        })
                    }).catch(()=>{})
                }, 1000)
            }
        }
    };

    async function cancelou() {
        var embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} ***・Cancelando a pesquisa...***`)
        .setColor(config.embedColor)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
        message.channel.send(embed).then((Mb)=>{
            setTimeout(()=>{
                var embed = new Discord.MessageEmbed()
                .setDescription(`${message.author} ***・Pesquisa cancelada com Sucesso!***`)
                .setColor(config.embedColor)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                Mb.edit(embed).catch(()=>{})
            }, 2000)
        }).catch(()=>{})
    };

    async function handleVideo(video, message, voiceChannel, playlist = false) {
        var serverQueue = lista.queue.get(message.guild.id);
        var song = {
            id: video.id,
            title: video.title,
            url:  video.url,
            inserido: message.author.tag,
            author: message.author.id,
            duracao: null,
            thumb: video.thumbnailUrl,
            numero: 1
        };
        if(!serverQueue) {
            var queueConstruct = {
                canalTexto: message.channel,
                canalVoz: voiceChannel,
                volume: 100,
                radio: false,
                soms: [],
                music: true,
                atual: 0,
                inicio: new Date(),
                repeat: 0,
                restart: false,
                restarM: [],
                connection: null,
                duraTotal: null,
                reason: null,
                voiceError: message.member.voiceChannel
            };
            lista.queue.set(message.guild.id, queueConstruct);
            queueConstruct.soms.push(song);
            queueConstruct.duraTotal = song.duracaoT
            try {
                var connection = await message.member.voice.channel.join();
                queueConstruct.connection = connection;
                play(message.guild, queueConstruct.soms[0]);
            } catch (err) {
                var embed = new Discord.MessageEmbed()
                .setDescription(`${message.author} ***・Não consegui entrar no canal de voz!***`)
                .setColor(config.embedColor)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(embed).catch(()=>{})
                lista.queue.delete(message.guild.id); 
            }
        } else {
            let tempo = Math.floor(song.duracaoT)
            let horas;
            let minutos;
            let minutos2;
            let segundos;
            if (tempo >= 3600) {
                horas = Math.floor(tempo / 60 / 60)
                minutos = Math.floor(tempo / 60)
                minutos2 = Math.floor(tempo / 60 - horas * 60)
                segundos = Math.floor(tempo - (minutos * 60))
            } else {
                horas = 0
                minutos = Math.floor(tempo / 60)
                minutos2 = Math.floor(tempo / 60)
                segundos = Math.floor(tempo - (minutos * 60))
            }
            song.duracao = `${(horas < 10 ? '0' + horas : horas) + ':' + (minutos2 < 10 ? '0' + minutos2 : minutos2) + ':' + (segundos < 10 ? '0' + segundos : segundos)}`,
            song.numero = serverQueue.soms.length+1
            serverQueue.duraTotal = serverQueue.duraTotal+song.duracaoT
            serverQueue.soms.push(song)
            if(playlist) return undefined;
            var embed = new Discord.MessageEmbed()
            .addField('***・Adicionada á Fila***', `・${song.title}***`, false)
            .addField('***・Inserido Por:***', `***${message.author} \`${message.author.id}\`***`, true)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
            .setColor(config.embedColor)
            .setTimestamp();
            message.channel.send(embed).catch(()=>{})
        }
        return undefined;
    };
    async function play(g, s) {
        var serverQueue = lista.queue.get(g.id);
        if(!s) {
            if(serverQueue.reason == '***・Canal de Voz Vazio***') {
                serverQueue.connection.disconnect();
                lista.queue.delete(g.id);
                var embed = new Discord.MessageEmbed()
                .setDescription(`${message.author}***・Parece que fiquei sozinho no canal de voz... A lista de repodução foi resetada!***`)
                .setColor(config.embedColor)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(embed).catch(()=>{})
            } else if(serverQueue.reason == '***・Error Event***') {
                undefined;
                serverQueue.connection.disconnect();
                lista.queue.delete(g.id);
            } else {
                serverQueue.connection.disconnect();
                lista.queue.delete(g.id);
                var embed = new Discord.MessageEmbed()
                .setDescription(`${message.author}***・A lista de reprodução acabou, Utilize: \`${config.prefix}play\` para tocar*** **novamente!**`)
                .setColor(config.embedColor)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(embed).catch(()=>{})
            }
        } else {
            const dispatcher = serverQueue.connection.play(ytdl(s.url, {
                filter: 'audioonly'
            }), {
                volume: (serverQueue.volume / 100),
                passes: 3,
                quality: 'highest'
            });
            dispatcher.on('finish', reason => {
                setTimeout(() => {
                    serverQueue.reason = reason
                    if(reason == '***・O stream não está gerando rápido o suficiente.***') {
                        reason = '***・Música Finalizada***'
                        serverQueue.reason = reason
                    }
                    if(serverQueue.restart === true) {
                        play(g, serverQueue.soms[0])
                    } else if(serverQueue.repeat == 1 || serverQueue.repeat > 1) {
                        play(g, serverQueue.soms[0])
                        serverQueue.repeat = serverQueue.repeat-1
                    } else {
                        serverQueue.soms.shift();
                        serverQueue.duraTotal = serverQueue.duraTotal-serverQueue.restarM[0].duracaoT
                        play(g, serverQueue.soms[0])
                        serverQueue.soms.map(music => {
                            music.numero = music.numero-1
                        })
                    }
                    serverQueue.inicio = new Date();
                }, 2050)
            })
            dispatcher.on('error', error => {
                serverQueue.soms.shift();
                serverQueue.duraTotal = serverQueue.duraTotal-serverQueue.restarM[0].duracaoT
                play(g, serverQueue.soms[0])
            });
            client.on('error', err => {
                lista.queue.delete(g.id)
            })
            let tempo = Math.floor(s.duracaoT)
            let horas;
            let minutos;
            let minutos2;
            let segundos;
            if (tempo >= 3600) {
                horas = Math.floor(tempo / 60 / 60)
                minutos = Math.floor(tempo / 60)
                minutos2 = Math.floor(tempo / 60 - horas * 60)
                segundos = Math.floor(tempo - (minutos * 60))
            } else {
                horas = 0
                minutos = Math.floor(tempo / 60)
                minutos2 = Math.floor(tempo / 60)
                segundos = Math.floor(tempo - (minutos * 60))
            }
            s.duracao = `${(horas < 10 ? '0' + horas : horas) + ':' + (minutos2 < 10 ? '0' + minutos2 : minutos2) + ':' + (segundos < 10 ? '0' + segundos : segundos)}`
            serverQueue.restarM = []
            serverQueue.restarM.push(s)
            var embed = new Discord.MessageEmbed()
            .addField('***・Começando a Tocar***', `***・${s.title}***`, false)
            .addField('***・Inserido Por:***', `***${message.author} \`${message.author.id}\`***`, true)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
            .setColor(config.embedColor)
            .setTimestamp();
            serverQueue.canalTexto.send(embed).catch(()=>{})
        }
    }
}
import { Client, GatewayIntentBits } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, AudioResource } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import ffmpegPath from 'ffmpeg-static';

// Create a new client instance with appropriate intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PREFIX = '!'; // Command prefix

client.once('ready', () => {
  console.log('Music bot is online!');
});

client.on('messageCreate', async (message) => {
  
  if (message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Join command
  if (command === 'join') {
    if (message.member.voice.channel) {
      const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
      message.reply('Joined the voice channel!');
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }

  // Play command
  if (command === 'play') {
    if (!args.length) return message.reply('You need to provide a YouTube URL.');

    const url = args[0];
    if (!ytdl.validateURL(url)) {
      return message.reply('Invalid YouTube URL.');
    }

    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream, { inputType: AudioResource });

    const player = createAudioPlayer();

    player.play(resource);
    player.on(AudioPlayerStatus.Idle, () => {
      message.guild.me.voice.channel.leave();
    });

    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);
    message.reply('Now playing your song!');
  }

  // Stop command
  if (command === 'stop') {
    const connection = message.guild.me.voice.channel;
    if (connection) {
      connection.disconnect();
      message.reply('Disconnected from the voice channel!');
    } else {
      message.reply('I am not in a voice channel.');
    }
  }
});

// Log in to Discord with your app's token
client.login('MTI4MTUyNDc1OTg4ODM5NjM1MQ.GWTHMD.SbLpKpRDj2s6-rRysWCoJxkXtDc-ART4lWzcLY');

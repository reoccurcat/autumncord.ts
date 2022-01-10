import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'ping',
      aliases: ['pong'],
      description: 'ping pong'
    });
  }
  public async messageRun(message: Message) {
    const msg = await message.channel.send('Hold on, pinging now...');
		const pingEmbed = new MessageEmbed()
			.setColor('#5a1da1')
			.setTitle('Ping')
			.setDescription(`🌐 API Latency is ${Math.round(message.client.ws.ping)}ms\n🖥️ Bot Latency is ${msg.createdTimestamp - message.createdTimestamp}ms`)
    return msg.edit({content: '🏓 Pong!', embeds: [pingEmbed]});
  }
}
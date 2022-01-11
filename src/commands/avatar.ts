import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export class SayCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'avatar',
      description: 'get a user\'s avatar',
      quotes: []
    });
  }
  public async messageRun(message: Message, args: Args) {
    var selecteduser
    if (message.mentions.users.first()) {selecteduser = message.mentions.users.first()}
    else {selecteduser = await this.container.client.users.fetch(await args.pick('string').catch(() => message.author.id))}
    const avatarEmbed = new MessageEmbed()
      .setColor('#5a1da1')
      .setAuthor({name:`${selecteduser!.username}'s Avatar`})
      .setDescription(`[PNG](${selecteduser!.avatarURL({ format: 'png' })}) | [JPG](${selecteduser!.avatarURL({ format: 'jpg' })}) | [GIF](${selecteduser!.avatarURL({ format: 'gif' })})`)
      .setImage(selecteduser!.avatarURL({ dynamic: true, size: 1024 })!)
    await message.channel.send({ embeds: [avatarEmbed] })
  }
}
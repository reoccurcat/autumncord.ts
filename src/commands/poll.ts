import { Command, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

export class PollCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'poll',
      description: 'have people upvote or downvote something',
      quotes: []
    });
  }
  public async messageRun(message: Message, args: Args) {
    const text = await args.rest('string')
    const pollEmbed = new MessageEmbed()
        .setColor('#5a1da1')
        .setDescription(`<@!${message.author.id}> is asking:\n\n**${text}**`)
        .setFooter({text:'React to vote!'})
    const msg = await message.channel.send({ embeds: [pollEmbed] });
    msg.react("884500238755332187")
    msg.react("884500238704980069")
  }
}
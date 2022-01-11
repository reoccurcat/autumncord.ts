import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export class FCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'f',
      description: 'have people pay respects to something',
      quotes: []
    });
  }
  public async messageRun(message: Message, args: Args) {
    const string = await args.rest('string');
    let customId = Math.floor(Math.random() * 10000)
    const alreadyreacted: string[] = [] 
    let respects = 0
    const embed = new MessageEmbed()
        .setColor('#5a1da1')
        .setAuthor({name:'F in the Chat'})
        .setDescription(`<@${message.author.id}> would like you to pay respects to:\n> ${string}`)
        .setFooter({text:'Press the F button to pay respects.'})
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(String(customId))
            .setLabel('F')
            .setStyle('PRIMARY'),
    );
    const disabledRow = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('f')
            .setLabel('F')
            .setStyle('SECONDARY')
            .setDisabled(true),
    );
    const msg = await message.channel.send({ components: [row], embeds: [embed] });
    const filter = (i: { customId: string; }) => i.customId === String(customId);
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });
    collector.on('collect', async i => {
        if (i.customId === String(customId)) {
            if (!alreadyreacted.includes(String(i.user.id))) {
                await i.reply(`${i.user.username} has paid their respects.`);
                respects += 1
                alreadyreacted.push(String(i.user.id))
            } else {
                await i.reply({ content: 'You have already paid respects.', ephemeral: true });
            }
        }
    });
    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`),
        msg.edit({ embeds: [embed], components: [disabledRow] })
        if (respects == 1) {
            message.channel.send(`${respects} person has paid their respects.`)
        } else {
        message.channel.send(`${respects} people have paid their respects.`)
    }});
  }
}
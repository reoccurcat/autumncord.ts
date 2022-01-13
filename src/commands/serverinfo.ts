import { Command, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
export class ServerinfoCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'serverinfo',
      description: 'get info on the server',
      runIn: CommandOptionsRunTypeEnum.GuildAny
    });
  }
  public async messageRun(message: Message) {
    let customId = Math.floor(Math.random() * 10000)
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(String(customId))
            .setLabel('Get Invite Splash')
            .setStyle('PRIMARY'),
    );
    let creationTime = parseInt((new Date(`${message.guild!.createdAt}`).getTime()/1000).toFixed(0))
    let guildDescription = ""
    if (String(message.guild!.description) == "null") {guildDescription = "No description set"} else {guildDescription = String(message.guild!.description)}
    const serverEmbed = new MessageEmbed()
        .setColor('#5a1da1')
        .setAuthor({name: String(`${message.guild!.name} (${message.guild!.id})`), iconURL: String(message.guild!.iconURL({ dynamic: true }))})
        .setDescription(`Owner: <@!${message.guild!.ownerId}>\n${message.guild!.memberCount} Members; ${message.guild!.roles.cache.map(r => r).length} Roles\nCreation Date: <t:${creationTime}:F>\nDescription:\n\`\`\`\n${guildDescription}\n\`\`\``)
        .setThumbnail(String(message.guild!.iconURL({ dynamic: true })))
    if (message.guild!.splashURL()) {
        let msg = await message.channel.send({ embeds: [serverEmbed], components: [row] });
        const disabledRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("primary")
                    .setLabel('Get Invite Splash')
                    .setStyle('SECONDARY')
                    .setDisabled(true),
        );
        const imageEmbed = new MessageEmbed()
            .setColor('#5a1da1')
            .setAuthor({name: String(`${message.guild!.name}'s Invite Splash`), iconURL: String(message.guild!.iconURL({ dynamic: true }))})
            .setDescription(`[PNG](${message.guild!.splashURL({ format: 'png' })}) | [JPG](${message.guild!.splashURL({ format: 'jpg' })})`)
            .setImage(String(message.guild!.splashURL({ size: 1024 })))
        const filter = (i: { customId: string; }) => i.customId === String(customId);
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });
        collector.on('collect', async i => {
            if (i.customId === String(customId)) {
                await i.reply({ embeds: [imageEmbed] });
                await msg.edit({ embeds: [serverEmbed], components: [disabledRow] })
            }
        });
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    }
    else await message.channel.send({ embeds: [serverEmbed] });
  }
}

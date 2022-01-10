import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export class HelpCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'help',
      aliases: ['commands'],
      description: 'help command'
    });
  }
  public async messageRun(message: Message, args: Args) {
//    await message.channel.send(this.container.stores.get("commands").map(command => command.name).join('`, `'))
    const text = await args.pick('string').catch(() => "none")
    if (text === "none") {
        const helpEmbed = new MessageEmbed()
            .setColor('#5a1da1')
            .setTitle('Help')
            .setDescription(`Here's a list of all of my commands:\n\n\`${this.container.stores.get("commands").map(command => command.name).join('`, `')}\``)
            .setFooter({text: `You can send '${process.env.prefix}help [command name]' to get info on a specific command!`})
        return message.channel.send({embeds: [helpEmbed]})
    }
    const name = text.toLowerCase();
    const command = this.container.stores.get("commands").get(name) || this.container.stores.get("commands").find(c => c.aliases && c.aliases.includes(name));
    if (!command) {
        return message.reply('that\'s not a valid command!');
    }
    let commandstring = ""
    if (Object.keys(command.aliases).length !== 0) commandstring += `**Aliases:** \`${command.aliases.join('`, `')}\`\n`; else commandstring += `**Aliases:** \`no aliases found\`\n`
    if (Object.keys(command.description).length !== 0) commandstring += `**Description:** ${command.description}\n`; else commandstring += `**Description:** no description found\n`
//    if (command.usage) commandstring += `**Usage:** a!${command.name} ${command.usage}\`\n`
//    if (command.type === "slash") commandstring += `**Command Type:** Slash Command\n`
//    else commandstring += `**Command Type:** Text Command\n`
    const helpEmbed = new MessageEmbed()
        .setColor('#5a1da1')
        .setTitle(`Command Info: ${command.name}`)
        .setDescription(commandstring)
    return message.channel.send({embeds: [helpEmbed]});
  }
}
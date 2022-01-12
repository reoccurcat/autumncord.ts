import { Command, Args } from '@sapphire/framework';
import type { GuildMember, Message, User } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export class UserinfoCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'userinfo',
      description: 'get info on a user',
      quotes: []
    });
  }
  public async messageRun(message: Message, args: Args) {
    var founduser: User | undefined
    var list
    var membervar: GuildMember
    if (message.mentions.users.first()) {founduser = message.mentions.users.first()}
    else {founduser = await this.container.client.users.fetch(await args.pick('string').catch(() => message.author.id))}
    list = this.container.client.guilds.cache.get(String(message.guild!.id))
    // list!.members.cache.forEach(member => {if (founduser!.id === member.id) membervar = member; return});
    await list!.members.fetch().then(member => member.forEach(member => {if (founduser!.id === member.id) membervar = member; return}))
    let creationTime = parseInt((new Date(`${founduser!.createdAt}`).getTime()/1000).toFixed(0))
    let joinTime = parseInt((new Date(`${membervar!.joinedAt}`).getTime()/1000).toFixed(0))
    let userDisplayName = ""
    if (String(membervar!.nickname) == "undefined") {
        userDisplayName = "No Nickname"
    } else if (String(membervar!.nickname) == "null") {
        userDisplayName = "No Nickname"
    } else {
        userDisplayName = String(membervar!.nickname)
    }
    const userEmbed = new MessageEmbed()
        .setColor('#5a1da1')
        .setAuthor({name:`${String(founduser!.username)}#${String(founduser!.discriminator)}`, iconURL:String(founduser!.avatarURL({ dynamic: true }))})
        .setDescription(`User ID: \`${founduser!.id}\`\nDisplay Name: \`${userDisplayName}\`\nGuild Join Date: <t:${joinTime}:F>\nAccount Creation Date: <t:${creationTime}:F>`)
        .setThumbnail(String(founduser!.avatarURL({ dynamic: true })))
    await message.channel.send({ embeds: [userEmbed] });
    }
}
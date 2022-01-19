import { Args, Command } from '@sapphire/framework';
import axios from 'axios';
import { BufferResolvable, Message, MessageActionRow, MessageAttachment, MessageButton, MessageEmbed } from 'discord.js';
import type { Stream } from 'stream';

export class CatCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'cat',
      description: 'get a cat picture',
    });
  }
  public async messageRun(message: Message, args: Args) {
    let msg = await message.channel.send(({content: "Loading..."}))
    const text = await args.pick('string').catch(() => "none")
    let customIdImage = Math.floor(Math.random() * 10000)
    let customIdDisable = Math.floor(Math.random() * 10000)
    let url: string
    const inituser = message.author
    var fetchedurl: BufferResolvable | Stream 
    const filter = (i: { customId: string; user: { id: string; }; }) => i.customId === String(customIdImage) || i.customId === String(customIdDisable)
    const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 });
    if (text !== "none") {url = `https://cataas.com/cat/${text}`} else {url = 'https://cataas.com/cat'}
    fetchedurl = await (await axios.get(url, { responseType: 'arraybuffer' })).data
    let attachment = new MessageAttachment(fetchedurl, 'cat.png');
    let embed = new MessageEmbed()
        .setColor('#5a1da1')
        .setImage('attachment://cat.png')
    const catimage = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(String(customIdImage))
                .setLabel('Another cat (image)')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId(String(customIdDisable))
                .setLabel('End interaction')
                .setStyle('SECONDARY'),
    );
    const catdisabled = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(String(customIdImage))
                .setLabel('Another cat (image)')
                .setStyle('SECONDARY')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(String(customIdDisable))
                .setLabel('End interaction')
                .setStyle('SECONDARY')
                .setDisabled(true)
    );
    await msg.edit({content: "Meow!", embeds: [embed], files: [attachment], components: [catimage]})
    collector.on('collect', async i => {
      if (i.user.id !== inituser.id) await i.reply({ content: 'This is not for you.', ephemeral: true });
      else {
        i.deferUpdate();
        if (i.customId === String(customIdImage)) { 
          if (text !== "none") {url = `https://cataas.com/cat/${text}`} else {url = 'https://cataas.com/cat'}
          fetchedurl = await (await axios.get(url, { responseType: 'arraybuffer' })).data
          attachment = new MessageAttachment(fetchedurl, 'cat.png');
          await msg.edit({embeds: [embed], files: [attachment], components: [catimage]})
        } else if (i.customId === String(customIdDisable)) {
          await msg.edit({embeds: [embed], files: [attachment], components: [catdisabled]})
        }
      }
    });
    collector.on('end', () => {
      msg.edit({ embeds: [embed], components: [catdisabled] })
  });
  }
}
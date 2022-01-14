import { Args, Command } from '@sapphire/framework';
import axios from 'axios';
import { Message, MessageActionRow, MessageAttachment, MessageButton, MessageEmbed } from 'discord.js';

export class DogCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'dog',
      description: 'get a dog picture',
    });
  }
  public async messageRun(message: Message, args: Args) {
    let msg = await message.channel.send(({content: "Loading..."}))
    const text = await args.pick('string').catch(() => "none")
    let customIdImage = Math.floor(Math.random() * 10000)
    let customIdDisable = Math.floor(Math.random() * 10000)
    let url: string 
    const filter = (i: { customId: string; user: { id: any; }; }) => i.customId === String(customIdImage) || i.customId === String(customIdDisable)
    const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 });
    if (text !== "none") {url = `https://dog.ceo/api/breed/${text}/images/random`} else {url = 'https://dog.ceo/api/breeds/image/random'}
    let fetchedurl = JSON.parse(await (await axios.get(url, { responseType: 'arraybuffer' })).data)
    let attachment = new MessageAttachment(fetchedurl.message, 'dog.png');
    let embed = new MessageEmbed()
        .setColor('#5a1da1')
        .setImage('attachment://dog.png')
    const dogimage = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(String(customIdImage))
                .setLabel('Another dog')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId(String(customIdDisable))
                .setLabel('End interaction')
                .setStyle('SECONDARY'),
    );
    const dogdisabled = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(String(customIdImage))
                .setLabel('Another dog')
                .setStyle('SECONDARY')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(String(customIdDisable))
                .setLabel('End interaction')
                .setStyle('SECONDARY')
                .setDisabled(true)
    );
    await msg.edit({content: "Woof!", embeds: [embed], files: [attachment], components: [dogimage]})
    collector.on('collect', async i => {
      i.deferUpdate();
      if (i.customId === String(customIdImage)) { 
        if (text !== "none") {url = `https://dog.ceo/api/breed/${text}/images/random`} else {url = 'https://dog.ceo/api/breeds/image/random'}
        fetchedurl = JSON.parse(await (await axios.get(url, { responseType: 'arraybuffer' })).data)
        attachment = new MessageAttachment(fetchedurl.message, 'dog.png');
        await msg.edit({embeds: [embed], files: [attachment], components: [dogimage]})
      } else if (i.customId === String(customIdDisable)) {
        await msg.edit({embeds: [embed], files: [attachment], components: [dogdisabled]})
      }
    });
    collector.on('end', () => {
      msg.edit({ embeds: [embed], components: [dogdisabled] })
  });
  }
}
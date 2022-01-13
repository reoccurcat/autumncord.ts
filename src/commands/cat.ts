import { Args, Command } from '@sapphire/framework';
import { BufferResolvable, Message, MessageActionRow, MessageAttachment, MessageButton, MessageEmbed } from 'discord.js';
import type { Stream } from 'stream';

export class SayCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'cat',
      description: 'get a cat picture',
    });
  }
  public async messageRun(message: Message, args: Args) {
    const text = await args.pick('string').catch(() => "none")
    let customIdImage = Math.floor(Math.random() * 10000)
    let customIdGif = Math.floor(Math.random() * 10000)
    var url: BufferResolvable | Stream
    const filter = (i: { customId: string; user: { id: any; }; }) => i.customId === String(customIdImage) || i.customId === String(customIdGif)
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });
    const msg = await message.channel.send("Loading...")
    async (i: { reply: (arg0: string) => any; }) => await i.reply("test")
    collector.on('collect', async i => {
        if (text !== "none") {url = `https://cataas.com/cat/${text}`} else {url = 'https://cataas.com/cat'}
        const attachment = new MessageAttachment(url, 'cat.png');
        let embed = new MessageEmbed()
            .setColor('#5a1da1')
            .setAuthor({name:'Meow!'})
            .setImage('attachment://cat.png')
        const catimage = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(String(customIdImage))
                    .setLabel('Another cat (image)')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(String(customIdGif))
                    .setLabel('Another cat (gif)')
                    .setStyle('PRIMARY'),
        );
        if (replied !== 1) {
            await msg.delete()
            await i.reply(({embeds: [embed], files: [attachment], components: [catimage]}))
            replied = 1
        } else {await i.editReply({ embeds: [embed], components: [catimage], files: [attachment]})}
        });
  }
}
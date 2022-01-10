import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class SayCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'say',
      description: 'get the bot to say something',
      preconditions: ['OwnerOnly'],
      quotes: []
    });
  }
  public async messageRun(message: Message, args: Args) {
    const text = await args.rest('string');
    return await message.channel.send(text)
  }
}
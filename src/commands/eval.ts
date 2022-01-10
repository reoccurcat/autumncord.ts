import { Command, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

// This function cleans up and prepares the
// result of our eval command input for sending
// to the channel
const clean = async (text: string) => {
    // If our input is a promise, await it before continuing
    if (text && text.constructor.name == "Promise")
      text = text;
    
    // If the response isn't a string, `util.inspect()`
    // is used to 'stringify' the code in a safe way that
    // won't error out on objects with circular references
    // (like Collections, for example)
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });
    
    // Replace symbols with character code alternatives
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
    
    // Send off the cleaned up result
    return text;
}

export class EvalCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'eval',
      description: 'evaluate something',
      preconditions: ['OwnerOnly'],
      quotes: []
    });
  }
  public async messageRun(message: Message, args: Args) {
    const text = await args.rest('string');
    try {
        // Evaluate (execute) our input
        const evaled = eval(text);
  
        // Put our eval result through the function
        // we defined above
        let cleaned = await clean(evaled);
  
        // Reply in the channel with our result
        cleaned = cleaned.split(process.env.token!).join('[REDACTED]');
        message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
      } catch (err) {
        err = String(err).split(process.env.token!).join('[REDACTED]');
        // Reply in the channel with our error
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
      }
  }
}
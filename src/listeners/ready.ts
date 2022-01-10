import { Listener } from '@sapphire/framework';
import type { Client } from 'discord.js';

export class ReadyListener extends Listener {
  public async run(client: Client) {
    const { username, id } = client.user!;
    this.container.logger.info(`Successfully logged in as ${username} (${id})`);
    if (process.env.test === "true") {
      await new Promise(f => setTimeout(f, 10000));
      console.log("Successfully ran for 10 seconds. Exiting...")
      return client.destroy()
    }
  }
}
import { SapphireClient } from '@sapphire/framework';
import * as dotenv from "dotenv";
dotenv.config();

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES', "GUILD_MEMBERS"], defaultPrefix: process.env.prefix });

client.login(process.env.token);
import { Client, Collection } from "discord.js";
import events from "./utils/events.js";
import commands from "./utils/commands.js";
import { config } from "dotenv";

config({path: ".env"});


export const client = new Client({intents: 32509});
client.commands = new Collection();
await events.loadEvents();
await commands.loadCommands();
await client.login(process.env.CLIENT_TOKEN);
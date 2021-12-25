import { Message } from 'discord.js'
import xp from '../utils/xp.js';

export default {
    name: 'messageCreate',

    /** @param {Message} message */
    execute: async function(message) {
        await xp.handle(message)
    }
}
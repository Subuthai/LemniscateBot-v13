import { Message } from 'discord.js'
import xp from '../utils/xp.js';

export default {
    name: 'messageCreate',

    /** @param {Message} message */
    async execute(message) {
        await xp.handle(message)
    }
}
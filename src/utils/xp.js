import Levels from 'discord-xp'
import { Message } from 'discord.js';

export default {
    /** @param {Message} message */

    handle: async function (message) {

        if (!message.guild) return;
        if (message.author.bot) return;
        Levels.setURL(`${process.env.MONGODB_URL}`);
        const randomAmountOfXp = Math.floor(Math.random() * 5) + 1;
        const hasLeveledUp = await Levels.appendXp(
            message.author.id,
            message.guild.id,
            randomAmountOfXp
        );
        if (hasLeveledUp) {
            const user = await Levels.fetch(message.author.id, message.guild.id, false);
            console.log(user.level)
        }

    }
}
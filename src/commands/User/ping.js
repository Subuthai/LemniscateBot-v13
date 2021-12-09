import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

export default {
    data: new SlashCommandBuilder().setName("ping")
        .setDescription("Use it for get the \"Pong\" response."),

    /** @param {CommandInteraction} interaction
     */
    execute: async function (interaction) {
        await interaction.reply({
            content: `Pong! (but ephemeral pong.)`,
            ephemeral: true
        })
    }
}
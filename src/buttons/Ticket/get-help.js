import { ButtonInteraction } from 'discord.js'

export default {
    data: {
        name: 'get-help'
    },

    /**
     * @param {ButtonInteraction} interaction */
    execute: async function(interaction) {
        await interaction.reply({content: '*WIP*', ephemeral: true})
    }
}
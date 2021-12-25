import { ButtonInteraction } from 'discord.js'

export default {
    data: {
      name: 'create-ticket'
    },

    /**
     * @param {ButtonInteraction} interaction */
    execute: async function(interaction) {
        await interaction.reply({content: '*WIP*', ephemeral: true})
    }
}
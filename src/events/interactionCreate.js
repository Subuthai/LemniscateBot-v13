import { CommandInteraction } from 'discord.js'

export default {
    name: 'interactionCreate',

    /** @param {CommandInteraction} interaction */
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client['commands'].get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction)
        } catch (e) {
            console.error(e)
            await interaction.reply({
                content: 'An error occurred.',
                ephemeral: true
            })
        }
    }
}
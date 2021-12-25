export default {
    name: 'interactionCreate',

    execute: async function(interaction) {

        if (interaction.isCommand()) {
            const command = interaction.client['commands'].get(interaction.commandName)
            if (!command) return

            try {
                await command.execute(interaction)
            } catch (e) {
                console.error(e)
                await interaction.reply({
                    content: 'An error occurred.',
                    ephemeral: true
                })
            }
        } else if (interaction.isButton()) {
            const button = interaction.client['buttons'].get(interaction.customId)
            if (!button) return

            try {
                await button.execute(interaction)
            } catch (e) {
                console.error(e)
                await interaction.reply({
                    content: 'An error occurred.',
                    ephemeral: true
                })
            }
        }


    }
}
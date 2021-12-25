import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { getDir } from 'file-ez'
import { client } from '../bot.js'
import { config } from 'dotenv'
import zaq from 'zaq'

config({ path: '.env' });
const rest = new REST().setToken(process.env.CLIENT_TOKEN)

export default {
    loadCommands: async function () {
        const commands = []
        const commandFiles = await getDir('../commands')
            .recursive()

        for (const file of commandFiles) {
            const command = await file.import()
            client.commands.set(command.data.name, command)
            commands.push(command.data.toJSON())
        }

        try {
            zaq.info('Reloading slash commands.')

            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands },
            )
            zaq.ok('Slash commands are reloaded successfully.')
        } catch (error) {
            zaq.error(error)
        }
    }
}
import { getDir } from 'file-ez'
import { client } from '../bot.js'
import { config } from 'dotenv'
import zaq from 'zaq'

config({ path: '.env' });

export default {
    loadButtons: async function () {
        const buttonFiles = await getDir('../buttons')
            .recursive()

        for (const file of buttonFiles) {
            const button = await file.import()
            client.buttons.set(button.data.name, button)
        }

        try {
            zaq.info('Reloading buttons.')

            zaq.ok('Buttons are reloaded successfully.')
        } catch (error) {
            zaq.error(error)
        }
    }
}
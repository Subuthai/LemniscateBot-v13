import mutes from '../utils/mutes.js'
import zaq from 'zaq';


export default {
    name: 'ready',
    once: true,

    execute: async function(client) {
        zaq.ok(`Logged in as ${client.user.tag} (ID: ${client.user.id}).`)
        await mutes.checkMutes(client)
    }
}
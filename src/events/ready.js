import mutes from '../utils/mutes.js'


export default {
    name: 'ready',
    once: true,

    async execute(client) {
        console.log(`Logged in as ${client.user.tag} (ID: ${client.user.id}).`)
        await mutes.checkMutes(client)
    }
}
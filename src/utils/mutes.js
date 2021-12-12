import mutes from '../databases/mutes.js'
import { MessageEmbed } from 'discord.js'

export default {
    checkMutes: async function (client) {
        const guild = await client.guilds.fetch({ guild: process.env.GUILD_ID })
        setInterval(async () => {
            mutes.find(async (err, data) => {
                if (err) throw err
                if (!data) return

                for (const muted of data) {
                    if (muted['unmute_at'] === Infinity) continue

                    const member = await guild.members
                        .fetch({ user: muted['member_id'] })
                        .catch(() => {
                        })

                    if (muted['unmute_at'] <= Date.now()) {
                        await member.roles.remove(process.env.MUTE_ROLE)
                        muted.delete()
                        member.send({
                            embeds: [new MessageEmbed({
                                color: 'DARK_ORANGE',
                                title: `You have been unmuted in ${guild.name}`,
                                description: `This is an automatic unmute.`,
                            }),],
                        })
                            .catch(() => {
                            })
                    }
                }
            })
        }, 5000)
    }
}
import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import ms from 'ms'
import prettyMilliseconds from 'pretty-ms'
import mutes from '../../databases/mutes.js'

export default {

    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a member in the server.')
        .addSubcommand((member) => member
            .setName('member')
            .setDescription('Member to mute')
            .addUserOption((member) => member
                .setName('member')
                .setDescription('Member to mute')
                .setRequired(true))
            .addStringOption((duration) => duration
                .setName('duration')
                .setDescription('Duration for the mute (indefinite by default)')
                .setRequired(false))
            .addStringOption((reason) => reason
                .setName('reason')
                .setDescription('Reason for the mute')
                .setRequired(false))),

    /** @param {CommandInteraction} interaction */
    execute: async function (interaction) {

        const user = interaction.options.getUser('member').id
        const member = await interaction.guild.members.fetch({user})
            .catch(() => {
            })
        const duration = interaction.options.getString('duration')
        let reason = interaction.options.getString('reason') ?? `No reason provided by ${interaction.member.user.tag}`

        const muteRole = await interaction.guild.roles.fetch(process.env.MUTE_ROLE, {cache: false})
            .catch(() => {
            })

        const permission = "MUTE_MEMBERS"

        if (!interaction.member.permissions.has(permission))
            return interaction.reply(`You're missing \`${interaction.memberPermissions.missing(permission)
                .join(' & ')}\` permission.`)
        if (user === interaction.member.user.id)
            return interaction.reply(
                `Why yes, I'd ${this.data.name} you myself if I had the chance to but yeah, this is not happening.`)
        else if (!member.manageable)
            return interaction.reply(`I can't ${this.data.name} ${member.user.tag ?? member} due to role hierarchy.`)
        else if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply(`You can't ${this.data.name} ${member.user.tag ?? member} due to role hierarchy.`)

        if (!duration) {
            member.roles.add(muteRole, reason)
                .then(member => {
                    interaction.reply(`Muted ${member.user.tag ?? member} indefinitely.`)
                })
                .catch(error => {
                    interaction.reply(`There was an error muting the member.\n\n${error.message}`)
                })
        } else {
            member.roles.add(muteRole, reason)
                .then(member => {
                    interaction.reply(
                        `Muted ${member.user.tag ?? member} for ${prettyMilliseconds(ms(duration), {verbose: true})}.`)
                })
                .catch(error => {
                    interaction.reply(`There was an error muting the member.\n${error.message}`)
                })
        }

        await member.send({
            embeds: [new MessageEmbed({
                color: 'DARK_ORANGE',
                title: `You have been muted in ${interaction.guild.name}!`,
                description: `Responsible Moderator: ${interaction.member.user.tag ?? interaction.member}-(${interaction.member.user.id})\nReason: ${reason}\nDuration: ${duration ? prettyMilliseconds(
                    ms(duration), {verbose: true}) : 'Permanently'}`,
                timestamp: new Date()
            })]
        })
            .catch(() => {
            })

        mutes.findOne({member_id: member.id}, {}, {}, async (err, data) => {
            if (err) throw err
            if (!data) {
                await mutes.create({
                    member_id: member.id,
                    unmute_at: duration ? Date.now() + ms(duration) : Infinity
                })
            } else {
                data.unmute_at = duration ? Date.now() + ms(duration) : Infinity
                data.save()
            }
        })
    }
}
import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import mutes from '../../databases/mutes.js'

export default {

    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a member in the server.')
        .addSubcommand((member) => member
            .setName('member')
            .setDescription('Unmutes a member in the server.')
            .addUserOption((member) => member
                .setName('member')
                .setDescription('Member to unmute')
                .setRequired(true))
            .addStringOption((reason) => reason
                .setName('reason')
                .setDescription('Reason for the unmute')
                .setRequired(false))),

    /** @param {CommandInteraction} interaction */
    execute: async function (interaction) {

        const user = interaction.options.getUser('member').id
        const member = await interaction.guild.members.fetch({ user })
            .catch(() => {})
        let reason = interaction.options.getString('reason') ?? `No reason provided by ${interaction.member.user.tag}`

        const muteRole = await interaction.guild.roles.fetch(process.env.MUTE_ROLE, { cache: false })
            .catch(() => {})

        const permission = "MUTE_MEMBERS"

        if (!interaction.member.permissions.has(permission))
            return interaction.reply(`You're missing \`${interaction.memberPermissions.missing(permission)}\` permission.`)

        if (user === interaction.member.user.id)
            return interaction.reply(`Why yes, I'd ${this.data.name} you myself if I had the chance to but yeah, this is not happening.`)
        else if (!member.manageable)
            return interaction.reply(`I can't ${this.data.name} ${member.user.tag ?? member} due to role hierarchy.`)
        else if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply(`You can't ${this.data.name} ${member.user.tag ?? member} due to role hierarchy.`)

        member.roles.remove(muteRole, reason)
            .then(member => {
                interaction.reply(`Unmuted ${member.user.tag ?? member}.`)
            })
            .catch(error => {
                interaction.reply(`There was an error unmuting the member.\n\n${error.message}`)
            })

        await member.send({
            embeds: [new MessageEmbed({
                color: 'RED',
                title: `You have been unmuted in ${interaction.guild.name}!`,
                description: `Responsible Moderator: ${interaction.member.user.tag ?? interaction.member}-(${interaction.member.user.id})\nReason: ${reason}`,
                timestamp: new Date()
            })]
        })
            .catch(() => {})

        mutes.findOne({ member_id: member.id }, {}, {}, async (err, data) => {
            if (err) throw err
            if (!data) return
            data.delete()
        })
    }
}
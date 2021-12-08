import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the guild.')
        .addSubcommand((mention_ban) => mention_ban
            .setName('by-mention')
            .setDescription('Bans a user from the guild by mention.')
            .addUserOption((mention) => mention
                .setName('mention')
                .setDescription('The user to ban.')
                .setRequired(true))
            .addStringOption((reason) => reason
                .setName('reason')
                .setDescription('The reason for the ban.')
                .setRequired(false))
            .addNumberOption((days) => days
                .setName('days')
                .setDescription('Number of days of messages to delete, must be between 0 and 7, inclusive.')
                .setRequired(false)))
        .addSubcommand((id_ban) => id_ban
            .setName('by-id')
            .setDescription('Bans a user from the guild by their id.')
            .addStringOption((id) => id
                .setName('id')
                .setDescription('The user to ban')
                .setRequired(true))
            .addStringOption((reason) => reason
                .setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false)
            )
            .addNumberOption((days) => days
                .setName('days')
                .setDescription('Number of days of messages to delete, must be between 0 and 7, inclusive.')
                .setRequired(false))
        ),

    /** @param {CommandInteraction} interaction */
    async execute(interaction) {

        let days = interaction.options.getNumber('days', false)
        days > 7 ? days = 7 : days
        const reason = interaction.options.getString(
            'reason', false) ?? `No reason provided by ${interaction.member.user.tag}`
        const permissions = "BAN_MEMBERS"
        if (!interaction.member.permissions.has(permissions))
            return interaction.reply(
                `You're missing \`Ban Members\` permission.`)
        const choice = interaction.options.getSubcommand()


        switch (choice) {
            case 'by-mention':
                //Mention User
                const userMention = interaction.options.getUser('mention', true)
                const isUserMention = await interaction.guild.members.fetch({user: userMention})
                    .catch(() => {
                    })
                if (userMention.id === interaction.member.user.id)
                    return interaction.reply(
                        `Why yes, I'd ${this.data.name} you myself if I had the chance to but yeah, this is not happening.`)
                else if (!isUserMention.manageable)
                    return interaction.reply(`I can't ${this.data.name} ${isUserMention.user.tag ?? isUserMention} due to role hierarchy.`)
                else if (isUserMention.roles.highest.position >= interaction.member.roles.highest.position)
                    return interaction.reply(
                        `You can't ${this.data.name} ${isUserMention.user.tag ?? isUserMention} due to role hierarchy.`)

                await isUserMention.send({
                    embeds: [new MessageEmbed({
                        color: 'RED',
                        title: `You have been banned from ${interaction.guild.name}!`,
                        description: `Responsible Moderator: ${interaction.member.user.tag ?? interaction.member}-(${interaction.member.user.id})\nReason: ${reason}`,
                        timestamp: new Date()
                    })]
                })
                    .catch(() => {
                    })

                if (isUserMention) return interaction.guild.members.ban(userMention, {
                    days,
                    reason
                })
                    .then(async banInfo => {
                        await interaction.reply(`Banned ${banInfo.tag ?? banInfo}`)
                    })
                    .catch(async (error) => {
                        await interaction.reply('I couldn\'t ban the user, sorry.\n' + error.message)
                    })
                break
            case 'by-id':
                //ID User
                const userID = interaction.options.getString('id', true)
                const isUserID = await interaction.guild.members.fetch({user: userID})
                    .catch(() => {
                    })
                if (!isUserID)
                    return interaction.guild.members.ban(userID, {
                        days,
                        reason
                    })
                        .then(banInfo => {
                            interaction.reply(`Banned ${banInfo.tag ?? banInfo}`)
                        })
                        .catch((error) => {
                            interaction.reply('I couldn\'t ban the user, sorry.\n' + error.message)
                        })

                if (userID === interaction.member.user.id)
                    return interaction.reply(
                        `Why yes, I'd ${this.data.name} you myself if I had the chance to but yeah, this is not happening.`)
                else if (!isUserID.manageable)
                    return interaction.reply(`I can't ${this.data.name} ${isUserID.user.tag ?? isUserID} due to role hierarchy.`)
                else if (isUserID.roles.highest.position >= interaction.member.roles.highest.position)
                    return interaction.reply(
                        `You can't ${this.data.name} ${isUserID.user.tag ?? isUserID} due to role hierarchy.`)

                await isUserID.send({
                    embeds: [new MessageEmbed({
                        color: 'RED',
                        title: `You have been banned from ${interaction.guild.name}!`,
                        description: `Responsible Moderator: ${interaction.member.user.tag ?? interaction.member}-(${interaction.member.user.id})\nReason: ${reason}`,
                        timestamp: new Date()
                    })]
                })
                    .catch(() => {
                    })

                interaction.guild.members.ban(isUserID.id, {
                    days,
                    reason
                })
                    .then(banInfo => {
                        interaction.reply(`Banned ${banInfo.tag ?? banInfo}`)
                    })
                    .catch((error) => {
                        interaction.reply(`I couldn't ${this.data.name} the user, sorry.\n${error.message}`)
                    })
                break
        }
    }
}
import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the guild.')
        .addSubcommand((mention_kick) => mention_kick
            .setName('by-mention')
            .setDescription('Kicks a user from the server by mention.')
            .addUserOption((mention) => mention
                .setName('mention')
                .setDescription('The user to kick.')
                .setRequired(true))
            .addStringOption((reason) => reason
                .setName('reason')
                .setDescription('The reason for the kick.')
                .setRequired(false)))
        .addSubcommand((id_kick) => id_kick
            .setName('by-id')
            .setDescription('Kicks a user from the server by their id.')
            .addStringOption((id) => id
                .setName('id')
                .setDescription('The user to kick.')
                .setRequired(true))
            .addStringOption((reason) => reason
                .setName('reason')
                .setDescription('The reason for the kick.')
                .setRequired(false))),

    /** @param {CommandInteraction} interaction */
    async execute(interaction) {

        const reason = interaction.options.getString(
            'reason', false) ?? `No reason provided by ${interaction.member.user.tag}`
        const permissions = "KICK_MEMBERS"
        if (!interaction.member.permissions.has(permissions))
            return interaction.reply(
                `You're missing \`Kick Members\` permission.`)
        const choice = interaction.options.getSubcommand()


        switch (choice) {
            case 'by-mention':
                //Mention User
                const userMention = interaction.options.getUser('mention', true)
                const isUserMention = await interaction.guild.members.fetch({ user: userMention })
                    .catch(() => {
                    })
                if (!isUserMention) return interaction.reply({
                    content: 'I couldn\'t find the user.',
                    ephemeral: true
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
                        color: 'ORANGE',
                        title: `You have been kicked from ${interaction.guild.name}!`,
                        description: `Responsible Moderator: ${interaction.member.user.tag ?? interaction.member}-(${interaction.member.user.id})\nReason: ${reason}`,
                        timestamp: new Date()
                    })]
                })
                    .catch(() => {
                    })

                if (isUserMention) return interaction.guild.members.kick(userMention, reason)
                    .then(async banInfo => {
                        await interaction.reply(`Kicked ${banInfo.tag ?? banInfo}`)
                    })
                    .catch(async (error) => {
                        await interaction.reply('I couldn\'t kick the user, sorry.\n' + error.message)
                    })
                break
            case 'by-id':
                //ID User
                const userID = interaction.options.getString('id', true)
                const isUserID = await interaction.guild.members.fetch({ user: userID })
                    .catch(() => {
                    })
                if (!isUserID) return interaction.reply({
                    content: 'I couldn\'t find the user.',
                    ephemeral: true
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
                        color: 'ORANGE',
                        title: `You have been kicked from ${interaction.guild.name}!`,
                        description: `Responsible Moderator: ${interaction.member.user.tag ?? interaction.member}-(${interaction.member.user.id})\nReason: ${reason}`,
                        timestamp: new Date()
                    })]
                })
                    .catch(() => {
                    })

                await interaction.guild.members.kick(isUserID.id, reason)
                    .then(banInfo => {
                        interaction.reply(`Kicked ${banInfo.tag ?? banInfo}`)
                    })
                    .catch((error) => {
                        interaction.reply(`I couldn't ${this.data.name} the user, sorry.\n${error.message}`)
                    })
                break
        }
    }
}
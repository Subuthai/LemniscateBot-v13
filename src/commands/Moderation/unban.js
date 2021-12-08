import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'


export default {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the guild.')
        .addStringOption((user) => user
            .setName('id')
            .setDescription('The user to unban')
            .setRequired(true)
        )
        .addStringOption((reason) => reason
            .setName('reason')
            .setDescription('Reason for unbanning user.')
            .setRequired(false)
        ),

    /** @param {CommandInteraction} interaction */
    async execute(interaction) {

        const permissions = 1n << 2n
        if (!interaction.member.permissions.has(permissions))
            return interaction.reply(`You're missing \`Ban Members\` permission.`)

        const user = interaction.options.getString('id', true)
        const reason = interaction.options.getString('reason', false) ?? `No reason provided by ${interaction.member.user.tag}`
        const bans = await interaction.guild.bans.fetch()

        const isBanned = bans.has(user)
        if (!isBanned)
            return interaction.reply(`Invalid ID/is not banned.`)

        interaction.guild.bans.remove(user, reason)
            .then(unbanInfo => {
                interaction.reply(`Unbanned ${unbanInfo.tag ?? unbanInfo}`)
            })
            .catch((error) => {
                interaction.reply(`I couldn't ${this.data.name} the user, sorry.\n${error.message}`)
            })
    },
}
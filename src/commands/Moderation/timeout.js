import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import ms from 'ms'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const colors = require('../../utils/Colors/colors.json')

export default {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout the member in guild.')
        .addSubcommand((put) => put
            .setName('put')
            .setDescription('Puts user in timeout.')
            .addUserOption((member) => member
                .setName('member')
                .setDescription('Specify a member to perform the timeout on.')
                .setRequired(true))
            .addStringOption((duration) => duration
                .setName('duration')
                .setDescription('Specify the duration of timeout.')
                .setRequired(true))
            .addStringOption((reason) => reason
                .setName('reason')
                .setDescription('Specify the reason of putting user in timeout.')
                .setRequired(false)))
        .addSubcommand((remove) => remove
            .setName('remove')
            .setDescription('Removes user from timeout.')
            .addUserOption((member) => member
                .setName('member')
                .setDescription('Specify a member to remove from timeout.')
                .setRequired(true))
            .addStringOption((reason) => reason
                .setName('reason')
                .setDescription('Specify the reason of removing user from timeout.')
                .setRequired(false))),

    /**
     * @param {CommandInteraction} interaction */
    execute: async function (interaction) {
        const permission = 'MODERATE_MEMBERS'
        if (!interaction.member.permissions.has(permission))
            return interaction.reply(`You're missing \`Timeout Members\` permission.`)

        const choice = interaction.options.getSubcommand()
        const user = interaction.options.getUser('member')
        const duration = interaction.options.getString('duration')
        const reason = interaction.options.getString('reason') ?? `No reason provided.`
        const member = interaction.guild.members.cache.get(user.id)

        if (user === interaction.member.user) return interaction.reply({
            embeds: [new MessageEmbed({
                color: colors.red,
                description: 'You can\'t use this command on yourself.'
            })], ephemeral: false
        })

        if (user === interaction.client.user) return interaction.reply({
            embeds: [new MessageEmbed({
                color: colors.red,
                description: 'You can\'t use this command on me.'
            })], ephemeral: false
        })

        if (user.bot === true) return interaction.reply({
            embeds: [new MessageEmbed({
                color: colors.red,
                description: 'You can\'t use this command on bots.'
            })], ephemeral: false
        })

        switch (choice) {
            case 'put':
                try {
                    const durationMs = ms(duration)
                    if (!durationMs) return interaction.reply({
                        embeds: [new MessageEmbed({
                            color: colors.red,
                            description: 'Please specify a valid duration for timeout.'
                        })], ephemeral: false
                    })
                    await interaction.reply({
                        embeds: [new MessageEmbed({
                            color: colors.blue,
                            description: 'Putting user in timeout...'
                        })], ephemeral: false
                    })
                    await member.timeout(durationMs, reason)
                    await interaction.editReply({
                        embeds: [new MessageEmbed({
                            color: colors.green,
                            description: `${user} is successfully put in timeout.\n\n**Duration:** ${duration}\n**Reason:** ${reason}`
                        })]
                    })
                } catch (e) {
                    await interaction.reply({
                        embeds: [new MessageEmbed({
                            color: colors.red,
                            description: `An error occurred:\n\n${e}`
                        })], ephemeral: false
                    })
                }
                break
            case 'remove':
                try {
                    await interaction.reply({
                        embeds: [new MessageEmbed({
                            color: colors.blue,
                            description: 'Removing user from timeout...'
                        })], ephemeral: false
                    })
                    await member.timeout(null, reason)
                    await interaction.editReply({
                        embeds: [new MessageEmbed({
                            color: colors.green,
                            description: `${user} is successfully removed from timeout.\n\n**Reason:** ${reason}`
                        })]
                    })
                } catch (e) {
                    await interaction.reply({
                        embeds: [new MessageEmbed({
                            color: colors.red,
                            description: `An error occurred:\n\n${e}`
                        })], ephemeral: false
                    })
                }
                break
        }
    }
}
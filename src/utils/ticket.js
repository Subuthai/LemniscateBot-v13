// noinspection JSCheckFunctionSignatures

import { CommandInteraction, MessageButton, MessageActionRow, MessageEmbed } from 'discord.js'
import tickets from '../databases/tickets.js'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const colors = require('../utils/Colors/colors.json')

export default {
    /** @param {CommandInteraction} interaction */
    createTicket: async function (interaction) {
        const { guild } = interaction
        const permissions = 'MANAGE_MESSAGES'
        if (!interaction.member.permissions.has(permissions))
            return interaction.reply(
                `You're missing \`Manage Messages\` permission.`)
        const channelID = interaction.options.getString('channel-id') ?? await interaction.channel.id
        const desc = interaction.options.getString('description')
        const title = interaction.options.getString('title')

        const firstReplyEmbed = new MessageEmbed({
            color: colors.blue,
            description: `Ticket system creating...`
        })
        const secondReplyEmbed = new MessageEmbed({
            color: colors.green,
            description: `Ticket system created in <#${channelID}>.\n\n**Important Note:** If you want to delete the ticket system please use \`/ticket delete\` command.
            \nOtherwise when you delete the system manually, you need to use \`/ticket update\` to update the database and delete the ticket system's data.`
        })
        const errorReplyEmbed = new MessageEmbed({
            color: colors.red,
            description: `You can only create one ticket system in a guild.\n\nIf you want a multiple ticket system, buy a premium today! (coming soon)`
        })
        const mainEmbed = new MessageEmbed({
            color: colors.default,
            author: {
                name: title ?? 'Lemniscate Ticket System'
            },
            description: desc ?? 'Open a ticket for get contact with staffs.',
        })
        const buttons = new MessageActionRow({
            components: [
                new MessageButton()
                    .setCustomId('create-ticket')
                    .setLabel('Open a Ticket')
                    .setStyle('SUCCESS')
                    .setEmoji('🎫'),
                new MessageButton()
                    .setCustomId('get-help')
                    .setLabel('About Tickets')
                    .setStyle('PRIMARY')
                    .setEmoji('❓')
            ]
        })

        try {
            await interaction.reply({ embeds: [firstReplyEmbed], ephemeral: false })

            tickets.findOne({ guild_id: interaction.guild.id }, {}, {}, async (err, data) => {
                if (err) throw err
                if (!data) {
                    await tickets.create({
                        guild_id: interaction.guild.id,
                        channel_id: channelID
                    })
                    await guild.channels.cache.get(channelID)
                        .send({ embeds: [mainEmbed], components: [buttons] })
                    await interaction.editReply({ embeds: [secondReplyEmbed], ephemeral: false })
                } else {
                    await interaction.editReply({ embeds: [errorReplyEmbed], ephemeral: false })
                }
            })
        } catch (error) {
            const errorEmbed = new MessageEmbed({
                color: colors.red,
                description: `An error occurred:\n\n${error}`
            })
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }
    },

    /** @param {CommandInteraction} interaction */
    deleteTicket: async function (interaction) {
        const permissions = 'MANAGE_MESSAGES'
        if (!interaction.member.permissions.has(permissions))
            return interaction.reply(
                `You're missing \`Manage Messages\` permission.`)
        const deletingEmbed = new MessageEmbed({
            color: colors.blue,
            description: `Deleting ticket system...`
        })
        const negativeEmbed = new MessageEmbed({
            color: colors.blue,
            description: 'This guild hasn\'t a ticket system.'
        })
        const successEmbed = new MessageEmbed({
            color: colors.green,
            description: `Ticket system deleted successfully.`
        })
        const unsuccessEmbed = new MessageEmbed({
            color: colors.green,
            description: `I can't find the ticket system.`
        })

        try {
            await interaction.reply({ embeds: [deletingEmbed] })

            tickets.findOne({ guild_id: interaction.guild.id }, {}, {}, async (err, data) => {
                if (err) throw err
                if (!data || !data.channel_id) {
                    await interaction.editReply({ embeds: [negativeEmbed], ephemeral: false })
                } else if (data.channel_id) {
                    const channel = await interaction.guild.channels.cache.get(data.channel_id)
                    if (channel) {
                        await channel.delete('Destroying ticket system.')
                        await data.delete()
                        await interaction.editReply({ embeds: [successEmbed], ephemeral: false })
                    } else if (!channel) {
                        data.delete()
                        await interaction.editReply({ embeds: [unsuccessEmbed], ephemeral: false })
                    }
                }
            })
        } catch (error) {
            // Error Embed
            const errorEmbed = new MessageEmbed({
                color: colors.red,
                description: `An error occurred:\n\n${error}`
            })
            await interaction.followUp({ embeds: [errorEmbed], ephemeral: true })
        }
    },

    /** @param {CommandInteraction} interaction */
    updateTickets: async function (interaction) {
        const permissions = 'MANAGE_MESSAGES'
        if (!interaction.member.permissions.has(permissions))
            return interaction.reply(
                `You're missing \`Manage Messages\` permission.`)
        const updatingEmbed = new MessageEmbed({
            color: colors.blue,
            description: `Updating ticket system data...`
        })
        const successEmbed = new MessageEmbed({
            color: colors.green,
            description: `I can't find the channel saved in database. So I deleted the old channel ID saved in the database.`
        })
        const negativeEmbed = new MessageEmbed({
            color: colors.blue,
            description: 'This guild hasn\'t a ticket system.'
        })
        const positiveEmbed = new MessageEmbed({
            color: colors.blue,
            description: 'This guild has a ticket system.'
        })

        try {
            await interaction.reply({ embeds: [updatingEmbed], ephemeral: false })

            tickets.findOne({ guild_id: interaction.guild.id }, {}, {}, async (err, data) => {
                if (err) throw err
                if (!data || !data.channel_id) {
                    await interaction.editReply({ embeds: [negativeEmbed], ephemeral: false })
                } else if (data.channel_id) {
                    const channel = await interaction.guild.channels.cache.get(data.channel_id)
                    if (channel) {
                        await interaction.editReply({ embeds: [positiveEmbed], ephemeral: false })
                    } else if (!channel) {
                        data.delete()
                        await interaction.editReply({ embeds: [successEmbed], ephemeral: false })
                    }
                }
            })
        } catch (error) {
            const errorEmbed = new MessageEmbed({
                color: colors.red,
                description: `An error occurred:\n\n${error}`
            })
            await interaction.followUp({ embeds: [errorEmbed], ephemeral: true })
        }
    },
}
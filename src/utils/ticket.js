import { CommandInteraction, MessageButton, MessageActionRow, MessageEmbed } from 'discord.js'
import ticketChannel from '../databases/tickets.js'
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

        // Embed and buttons

        // Reply Embeds
        const firstReplyEmbed = new MessageEmbed({
            color: colors.blue,
            description: `Ticket message creating...`
        })

        const secondReplyEmbed = new MessageEmbed({
            color: colors.green,
            description: `Ticket message created in <#${channelID}>.`
        })

        const errorReplyEmbed = new MessageEmbed({
            color: colors.red,
            description: `One channel, two ticket messages, no.`
        })

        // Ticket Embed
        const mainEmbed = new MessageEmbed({
            color: colors.default,
            author: {
                name: title ?? 'Lemniscate Ticket System'
            },
            description: desc ?? 'Open a ticket for get contact with staffs.',
        })

        // Buttons
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
            await interaction.reply({ embeds: [firstReplyEmbed], ephemeral: true })
            ticketChannel.findOne({
                guild_id: interaction.guild.id,
                channel_id: channelID
            }, {}, {}, async (err, data) => {
                if (err) throw err
                if (!data) {
                    await ticketChannel.create({
                        guild_id: interaction.guild.id,
                        channel_id: channelID
                    })
                    await guild.channels.cache.get(channelID)
                        .send({ embeds: [mainEmbed], components: [buttons] })
                    // noinspection JSCheckFunctionSignatures
                    await interaction.editReply({ embeds: [secondReplyEmbed], ephemeral: true })
                } else {
                    // noinspection JSCheckFunctionSignatures
                    await interaction.editReply({ embeds: [errorReplyEmbed], ephemeral: true })
                }
            })
        } catch (error) {
            // Error Embed
            const errorEmbed = new MessageEmbed({
                color: colors.red,
                description: `An error occurred:\n\n${error}`
            })
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }
    },
    /** @param {CommandInteraction} interaction */
    deleteTicket: async function (interaction) {
        await interaction.reply({ content: `*WIP*`, ephemeral: true })
    },
}
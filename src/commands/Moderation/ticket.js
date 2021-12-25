import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import ticket from '../../utils/ticket.js'

export default {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Manage tickets in the guild.')
        .addSubcommand((createTicket) => createTicket
            .setName('create')
            .setDescription('Create a ticket message in specified channel.')
            .addStringOption((setTitle) => setTitle
                .setName('title')
                .setDescription('Specify a title for ticket message.')
                .setRequired(false))
            .addStringOption((setDesc) => setDesc
                .setName('description')
                .setDescription('Specify a description for ticket message.')
                .setRequired(false))
            .addStringOption((setChannelID) => setChannelID
                .setName('channel-id')
                .setDescription('test')
                .setRequired(false)))
        .addSubcommand((checkTicket) => checkTicket
            .setName('update')
            .setDescription('If you deleted ticket system by right click + delete, update the database with this command.'))
        .addSubcommand((deleteTicket) => deleteTicket
            .setName('delete')
            .setDescription('Deletes the ticket system on the guild.')),
    /**
     * @param {CommandInteraction} interaction*/
    execute: async function (interaction) {
        const choice = interaction.options.getSubcommand()
        switch (choice) {
            case 'create':
                await ticket.createTicket(interaction)
                break
            case 'delete':
                await ticket.deleteTicket(interaction)
                break
            case 'update':
                await ticket.updateTickets(interaction)
                break
        }
    }
}
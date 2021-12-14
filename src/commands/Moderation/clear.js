import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const colors = require('../../utils/Colors/colors.json')
export default {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Deletes bulk messages according to amount you specify.')
        .addNumberOption((amount) => amount
            .setName('amount')
            .setDescription('Set the amount for delete messages.')
            .setRequired(true)),

    /** @param {CommandInteraction} interaction
     */
    execute: async function (interaction) {
        const permission = 'MANAGE_MESSAGES'
        if (!interaction.member.permissions.has(permission))
            return interaction.reply({
                embeds: [new MessageEmbed({
                    color: colors.red,
                    description: `You're missing \`Manage Messages\` permission.`
                })],
                ephemeral: true
            })
        const amount = interaction.options.getNumber('amount')
        const channel = interaction.channel
        await channel.messages.fetch({ limit: 100 })
        if (amount <= 100 && amount >= 1) {
            try {
                channel.bulkDelete(amount, true)
                await interaction.reply({
                    embeds: [new MessageEmbed({
                        color: colors.green,
                        description: `Deleted **${amount}** messages in ${channel}.`
                    })],
                    ephemeral: true
                })
            } catch (e) {
                await interaction.reply({
                    embeds: [new MessageEmbed({
                        color: colors.red,
                        description: `An error occured.\n\n${e}`
                    })]
                })
            }

        } else {
            await interaction.reply({
                embeds: [new MessageEmbed({
                    color: colors.blue,
                    description: `Please specify a number between 1 and 100.`
                })],
                ephemeral: true
            })
        }

    }
}
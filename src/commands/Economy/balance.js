import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import balance from '../../databases/economy.js'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const colors = require('../../utils/Colors/colors.json')

export default {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Do you have money?'),

    /** @param {CommandInteraction} interaction */
    execute: async function (interaction) {
        const memberID = interaction.member.user.id
        balance.findOne({ member_id: memberID }, {}, {}, async (err, data) => {
            if (err) throw err
            if (!data) {
                await balance.create({
                    member_id: memberID,
                    balance: 500,
                })
            } else {
                const embed = new MessageEmbed({
                    color: colors.blue,
                    description: `**${interaction.member.user.username}**, your balance is **${data.balance}** Lemniscoin.`
                })
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: false
                })
            }
        })
    }
}


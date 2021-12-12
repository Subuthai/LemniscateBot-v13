import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import balance from '../../databases/economy.js'

export default {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Collect your Lemniscoins every 24 hours.'),

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
                await interaction.reply('Work in progress...')
            }
        })
    }
}


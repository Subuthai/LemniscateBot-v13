import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import request from 'request'

export default {
    data: new SlashCommandBuilder()
        .setName('fox')
        .setDescription('Sends a random fox image.'),
    /** @param {CommandInteraction} interaction */
    execute: async function(interaction) {
        request('https://some-random-api.ml/img/fox', async function (error, body) {
            let result = JSON.parse(body.body);
            const embed = new MessageEmbed({
                title: '🦊',
                color: 'RANDOM',
                image: {
                    url: result.link
                }
            })
            await interaction.reply({ embeds: [embed] })
        })
    }
}

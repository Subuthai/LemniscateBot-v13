import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import request from 'request'

export default {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Pat someone!')
        .addUserOption((member) => member
            .setName('member')
            .setDescription('Specify a member to pat.')
            .setRequired(true)),
    /** @param {CommandInteraction} interaction */
    execute: async function (interaction) {
        const member = interaction.options.getUser('member')
        if (member === interaction.member.user) return interaction.reply({
            embeds: [new MessageEmbed({
                color: 'RED',
                description: `You can't pat yourself. Beg someone to pat you. <:pepePoint:924540107388764160>`
            })], ephemeral: false
        })

        if (member === interaction.client.user) return interaction.reply({
            embeds: [new MessageEmbed({
                color: 'RED',
                description: `You can't pat me...`
            })], ephemeral: false
        })

        if (member.bot === true) return interaction.reply({
            embeds: [new MessageEmbed({
                color: 'RED',
                description: `You can't pat bots, please.`
            })], ephemeral: false
        })

        request('https://some-random-api.ml/animu/pat', async function (error, body) {
            let result = JSON.parse(body.body);
            const embed = new MessageEmbed({
                color: 'RANDOM',
                description: `${interaction.member.user} is patting ${member}!`,
                image: {
                    url: result.link
                }
            })
            await interaction.reply({ embeds: [embed] })
        })
    }
}

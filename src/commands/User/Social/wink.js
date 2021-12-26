import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import request from 'request'

export default {
    data: new SlashCommandBuilder()
        .setName('wink')
        .setDescription('Wink someone!')
        .addUserOption((member) => member
            .setName('member')
            .setDescription('Specify a member to wink.')
            .setRequired(true)),
    /** @param {CommandInteraction} interaction */
    execute: async function (interaction) {
        const member = interaction.options.getUser('member')
        if (member === interaction.member.user) return interaction.reply({
            embeds: [new MessageEmbed({
                color: 'RED',
                description: `You can't wink yourself. How can you wink yourself anyway? <:hmmm:910280074761211904>`
            })], ephemeral: false
        })

        if (member === interaction.client.user) return interaction.reply({
            embeds: [new MessageEmbed({
                color: 'RED',
                description: `You can't wink at me, thank you.`
            })], ephemeral: false
        })

        if (member.bot === true) return interaction.reply({
            embeds: [new MessageEmbed({
                color: 'RED',
                description: `You can't wink at bots!`
            })], ephemeral: false
        })

        request('https://some-random-api.ml/animu/wink', async function (error, body) {
            let result = JSON.parse(body.body);
            const embed = new MessageEmbed({
                color: 'RANDOM',
                description: `${member}, ${interaction.member.user} is winked at you!`,
                image: {
                    url: result.link
                }
            })
            await interaction.reply({ embeds: [embed] })
        })
    }
}

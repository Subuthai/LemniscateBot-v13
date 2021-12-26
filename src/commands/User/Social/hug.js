import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import request from 'request'

export default {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug someone!')
        .addUserOption((member) => member
            .setName('member')
            .setDescription('Specify a member to hug.')
            .setRequired(true)),
    /** @param {CommandInteraction} interaction */
    execute: async function (interaction) {
        const member = interaction.options.getUser('member')
        if (member === interaction.member.user) return interaction.reply({
            embeds: [new MessageEmbed({
                color: 'RED',
                description: `You can't hug yourself, I'm sorry.`
            })], ephemeral: false
        })
        if (member === interaction.client.user) return interaction.reply({
            embeds: [new MessageEmbed({
                color: 'RED',
                description: `You can't hug me, I'm not real anyway.`
            })], ephemeral: false
        })

        if (member.bot === true) return interaction.reply({
            embeds: [new MessageEmbed({
                color: 'RED',
                description: `You can't hug bots! They're just bots.`
            })], ephemeral: false
        })

        request('https://some-random-api.ml/animu/hug', async function (error, body) {
            let result = JSON.parse(body.body);
            const embed = new MessageEmbed({
                color: 'RANDOM',
                description: `${member}, you got a loving hug by ${interaction.member.user}!`,
                image: {
                    url: result.link
                }
            })
            await interaction.reply({ embeds: [embed] })
        })
    }
}

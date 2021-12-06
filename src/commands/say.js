import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Bot sends the message you want.")
        .addStringOption((option) => option.setName("message").setDescription("Specify the message"))
        .addBooleanOption((option) => option.setName("embed").setDescription("Embed the message?")),

    /**
     * @param {CommandInteraction} interaction
     */

    execute: async function (interaction) {
        const msgContent = interaction.options.getString('message');
        const embedMsg = new MessageEmbed({
            description: msgContent,
        })
        if (!msgContent) {
            await interaction.reply({
                content: "You can't send an empty message.",
                ephemeral: true,
            })
        } else if (msgContent) {
            if (interaction.options.getBoolean('embed') === true) {
                await interaction.reply({
                    embeds: [embedMsg],
                    ephemeral: false,
                })
            } else {
                await interaction.reply({
                    content: msgContent,
                    ephemeral: false,
                })
            }
        }

    }
}
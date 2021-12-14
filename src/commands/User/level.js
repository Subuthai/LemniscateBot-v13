import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageAttachment } from 'discord.js'
import Levels from 'discord-xp';
import canvacord from 'canvacord'

export default {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Shows your level in guild you are using the command.')
        .addSubcommand((user) => user
            .setName('user')
            .setDescription('Shows your level in guild you are using the command.'))
        .addSubcommand((leaderboard) => leaderboard
            .setName('leaderboard')
            .setDescription('Shows leaderboard in guild you are using the command.')),

    /** @param {CommandInteraction} interaction
     */
    execute: async function (interaction) {
        //TODO Add user option.

        const user = await Levels.fetch(interaction.member.user.id, interaction.guild.id, false);
        const choice = interaction.options.getSubcommand()
        switch (choice) {
            case 'user':
                if (user.level === null || isNaN(user.level) || user.level === 0) {
                    await interaction.reply('Send a few messages for getting xp.')
                } else {
                    user.cleanXp = user.xp - Levels.xpFor(user.level)
                    user.cleanNextLevelXp = Levels.xpFor(user.level + 1) - Levels.xpFor(user.level)
                    const rank = new canvacord.Rank()
                        .setBackground(
                            'IMAGE',
                            'https://cdn.discordapp.com/attachments/640262883401400351/788214481456988210/lemniscateyardim.png')
                        .setAvatar(interaction.member.user.displayAvatarURL({ format: 'png', size: 512 }))
                        .setCurrentXP(user.cleanXp)
                        .setRequiredXP(user.cleanNextLevelXp)
                        .setRank(parseInt(user.position), 'RANK', true)
                        .setLevel(parseInt(user.level), 'LEVEL   ')
                        .setProgressBar(['#00FF3A', '#00EAFC'], 'GRADIENT')
                        .setUsername(interaction.member.user.username)
                        .setDiscriminator(interaction.member.user.discriminator, '#b5b5b5')

                    rank.build({})
                        .then((data) => {
                            const attachment = new MessageAttachment(
                                data,
                                'LemniscateLevel.png'
                            );
                            interaction.reply({
                                    files: [attachment]
                                }
                            );
                        });
                }
                break
            case 'leaderboard':
                await interaction.reply('Work in progress...')
                break
        }
    }
}
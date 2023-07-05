// bot.js
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const db = require('./database');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Bot is ready
client.once('ready', () => {
    console.log('Bot is ready.');
});

// Monitor channel for messages and perform actions
client.on('messageCreate', async (message) => {
    // Check if the message is from the monitored channel and sender doesn't have the specified role
    const monitoredChannelId = 'your_monitored_channel_here';
    const restrictedRoleId = 'your_restricted_role_here';

    if (message.channel.id === monitoredChannelId && !message.member.roles.cache.has(restrictedRoleId)) {
        // Extract relevant information from the message
        const senderId = message.author.id;
        const senderName = message.author.username;
        const content = message.content;
        const sentTime = message.createdAt;

        // Check if the user already exists in the database
        db.get('SELECT * FROM users WHERE userId = ?', [senderId], (err, row) => {
            if (err) {
                console.error('Error checking user in database:', err);
            } else {
                if (!row || row.messageSent === 0) {
                    // User doesn't exist or messageSent is 0, proceed with sending the message

                    // Post the information in the target channel
                    const targetChannelId = 'target_channel_id_here';
                    const targetChannel = client.channels.cache.get(targetChannelId);
                    const userMention = 'user_to_mention'; // Replace with the actual user ID
                    const mention = `<@${userMention}>`;
                    const messageContent = `${mention} Here's a new message:`;

                    if (targetChannel instanceof Discord.TextChannel) {
                        const embed = new EmbedBuilder()
                            .setColor('#00b0f4')
                            .setAuthor({
                                name: 'Taxi Service',
                            })
                            .setTitle('New Message')
                            .setDescription('This is an example description.')
                            .addFields(
                                {
                                    name: 'Sender',
                                    value: senderName,
                                    inline: false,
                                },
                                {
                                    name: 'Content',
                                    value: content,
                                    inline: false,
                                },
                                {
                                    name: `Sent at`,
                                    value: sentTime.toUTCString(),
                                    inline: false,
                                }
                            )
                            .setFooter({
                                text: 'Time Sent',
                            })
                            .setTimestamp();


                        targetChannel.send({ content: messageContent, embeds: [embed] });

                        // If the user doesn't exist, insert a new entry with messageSent = 1
                        // If the user exists but messageSent = 0, update messageSent to 1
                        if (!row) {
                            db.run('INSERT INTO users (userId, messageSent) VALUES (?, ?)', [senderId, 1], (err) => {
                                if (err) {
                                    console.error('Error inserting user into database:', err);
                                } else {
                                    console.log('User inserted into database:', senderId);
                                }
                            });
                        } else if (row.messageSent === 0) {
                            db.run('UPDATE users SET messageSent = ? WHERE userId = ?', [1, senderId], (err) => {
                                if (err) {
                                    console.error('Error updating user messageSent status:', err);
                                } else {
                                    console.log('User messageSent status updated:', senderId);
                                }
                            });
                        }
                    }
                }
            }
        });
    }
});

// Custom command to reset messageSent for a user
client.on('messageCreate', (message) => {
    const prefix = '.';
    const command = 'reset';
    const authorizedUserId = 'your_user_id_here'; // User Id allowed to use the command

    if (message.content.startsWith(`${prefix}${command}`) && message.author.id === authorizedUserId) {
        const args = message.content.split(' ');
        if (args.length === 2) {
            const targetUserId = args[1];

            // Update the messageSent value to 0 for the target user
            db.run('UPDATE users SET messageSent = ? WHERE userId = ?', [0, targetUserId], (err) => {
                if (err) {
                    console.error('Error resetting user messageSent status:', err);
                } else {
                    console.log('User messageSent status reset:', targetUserId);
                    message.channel.send(`Reset messageSent status for user <@${targetUserId}>.`);
                }
            });
        } else {
            message.channel.send(`Invalid usage. Correct syntax: \`${prefix}${command} <userId>\`.`);
        }
    }
});

// Check if a user leaves the server and delete their entry from the database
client.on('guildMemberRemove', (member) => {
    const userId = member.id;
    db.run('DELETE FROM users WHERE userId = ?', [userId], (err) => {
        if (err) {
            console.error('Error deleting user from database:', err);
        } else {
            console.log('User deleted from database:', userId);
        }
    });
});

// Error handling for the Discord client
client.on('error', (err) => {
    console.error('Discord client error:', err);
});

module.exports = client;

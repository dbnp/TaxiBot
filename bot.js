const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database.');

        // Create the 'users' table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                userId TEXT UNIQUE,
                messageSent INTEGER DEFAULT 0
            )
        `, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
            } else {
                console.log('Users table is already created.'); //Lazy, need to fix this

                // Bot is ready
                client.once('ready', () => {
                    console.log('Bot is ready.');
                });

                // Monitor channel for messages and perform actions
                client.on('messageCreate', async (message) => {
                    // Check if the message is from the monitored channel and sender doesn't have the specified role
                    const monitoredChannelId = '1118985975545221182';
                    const restrictedRoleId = '1099746577955954758';

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
                                    const targetChannelId = '1118992187464613918';
                                    const targetChannel = client.channels.cache.get(targetChannelId);
                                    const userMention = '153616201652764673'; // Replace with the actual user ID
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
                                                    name: 'Sent At',
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
                    const authorizedUserId = '153616201652764673';

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

                // Start the bot
                client.login('MTExODk5NzkyMjIwNjQ2NjA5OA.G3aLYA.RUaXurJ-O5dz4WWIsa0_m5EwMZHTkEgTzWXqk4');
            }
        });
    }
});

// Error handling for the database connection
db.on('error', (err) => {
    console.error('Database error:', err);
});

// Terminate the signal
process.on('SIGINT', () => {
    console.log('Bot is stopping...');

    // Disconnect the bot
    client.destroy();

    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err);
        } else {
            console.log('Database connection closed.');

            // Exit the process
            process.exit(0);
        }
    });
});
const Discord = require('discord.js');

// Create a new Discord client
const client = new Discord.Client();

// Bot token - replace 'YOUR_BOT_TOKEN' with your actual bot token
const token = 'YOUR_BOT_TOKEN';

// Event listener for when the bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Event listener for when a message is received
client.on('message', message => {
    // Check if the message starts with the command prefix (/ or !) and the command is 'test'
    if (message.content.startsWith('/test') || message.content.startsWith('!test')) {
        // Get the current date and time
        const currentDate = new Date();

        // Send a message with the username and current date and time
        message.channel.send(`Hello ${message.author.username}, the current date and time is: ${currentDate}`);
    }
});

// Log in to Discord with your app's token
client.login(token);

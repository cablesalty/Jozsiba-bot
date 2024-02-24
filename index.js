const Discord = require('discord.js');

const client = new Discord.Client();
const token = 'YOUR_BOT_TOKEN'; //! Replace with your own!

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});


client.on('message', message => {
    if (message.content.startsWith('/test') || message.content.startsWith('!test')) {
        const currentDate = new Date();
        message.channel.send(`Hello ${message.author.username}! The current date and time is: ${currentDate}`);
    }
});


client.login(token); // Log in

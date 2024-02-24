const Discord = require('discord.js');
const fs = require("fs");
const path = require('path');

const client = new Discord.Client();
const token = fs.readFileSync(path.join(__dirname, "discord.token"), 'utf8'); // Read token from file

let modlist = ["cablesalty", "bugzumdev"] // Add your discord username here to tell the bot you are an admin


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});


client.on('message', message => {
    // Commands
    if (message.content.startsWith('!test')) { // Test command

        message.channel.send(`🟢 **Bot is online and working!**\nTest request by ${message.author.username}`);
    } else if (message.content.startsWith("!torture")) { // Use on somebody who is not behaving well
        if (modlist.includes(message.author.username)) {
            let target = message.content.slice(9); // Remove first 9 chars to get who to torture
            message.channel.send("🔫😀 **" + target + " will regret joining this server...**")
        } else {
            message.channel.send("✋🛑 **You are not permitted to torture people!**")
        }
    }
});


client.login(token); // Log in

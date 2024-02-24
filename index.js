const { Client, Intents } = require('discord.js');
const fs = require("fs");
const path = require('path');

const client = new Client({ 
    intents: 8
});

const token = fs.readFileSync(path.join(__dirname, "discord.token"), 'utf8'); // Read token from file

let modlist = ["cablesalty", "bugzumdev"] // Add your discord username here to tell the bot you are an admin


// Event listener for when the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    // Register slash commands
    const guildId = '1210887545714380820'; // Replace with your guild ID
    const commands = [
        {
            name: 'kínzás',
            description: 'Kínozz meg valakit (ingame)',
            options: [
                {
                    name: 'célpont',
                    type: 6,
                    description: 'Ki legyen megkínozva?',
                    required: true
                }
            ]
        }
    ];

    client.guilds.cache.get(guildId)?.commands.set(commands).then(() => {
        console.log('Slash commands registered');
    }).catch(console.error);
});

// Event listener for when a slash command is executed
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options, user } = interaction;

    if (commandName === 'kínzás') {
        const username = options.getUser('célpont').username; // Get the username provided as an argument
        await interaction.reply(`${username} meg fogja bánni hogy belépett erre a szerverre...`);
    }
});

client.on('messageCreate', message => {
    console.log(message);
});


client.login(token); // Log in

const { Client, Intents } = require('discord.js');
const fs = require("fs");
const path = require('path');

const client = new Client({ 
    intents: 8
});

const token = process.env.DISCORDBOTTOKEN; // Bot token olvasása environ-ból

// Add hozzá a listához a Discord felhasználónevedet hogy megmond
// a botnak hogy moderátor vagy
let modlist = ["cablesalty", "bugzumdev"]


// Event listener: Készen áll e a kliens (bot)
client.once('ready', () => {
    console.log(`Bejelentkezve mint ${client.user.tag}`);
    
    // [/] parancsok regisztrálása
    const guildId = '1210887545714380820'; // Változtasd meg a saját szerver ID-d re
    const commands = [ // Parancslista
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

    // Parancsok regisztrálása globálisan
    client.application?.commands.set(commands).then(() => {
        console.log('[/] parancsok regisztrálva');
    }).catch(console.error);
});

// Event listener: parancs végrehajtva
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return; // Ha nem parancs, lépjen vissza

    const { commandName, options, user } = interaction; // Pár változó kivétele az interakcióból

    if (commandName === 'kínzás') {
        const username = options.getUser('célpont').username;
        await interaction.reply(`${username} meg fogja bánni hogy belépett erre a szerverre...`);
    }
});

client.on('messageCreate', message => {
    console.log(message);
});


client.login(token); // Bejelentkezés

const { Client, Intents, EmbedBuilder } = require('discord.js');
const fs = require("fs");
const path = require('path');
const os = require("os");

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
    client.guilds.cache.clear();
    
    // [/] parancsok regisztrálása
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
        },

        {
            name: 'hardwareinfo',
            description: 'Hardver információ'
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
    } else if (commandName == "hardwareinfo") {
        const embed = new EmbedBuilder()
        .setColor("#0099FF")
        .setTitle('Hardwareinfo')
        .setURL('https://github.com/cablesalty/Jozsiba-bot')
        .setAuthor({ name: 'cablesalty', iconURL: 'https://avatars.githubusercontent.com/u/160484791', url: 'https://github.com/cablesalty/' })
        // .setDescription('desc')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            { name: 'RAM', value: ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2).toString() + " felhasználva (" + (os.totalmem() / 1024 / 1024 / 1024).toFixed(2).toString() + ")", inline: true },
            { name: 'Processzor', value: os.cpus()[1]["model"].toString(), inline: true }
        )
        // .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({ text: 'Józsibá Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        await interaction.reply({ embeds: [embed] });
    }
});

client.on('messageCreate', message => {
    console.log(message);
});


client.login(token); // Bejelentkezés

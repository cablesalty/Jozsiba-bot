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
let modlist = ["cablesalty", "bugzumdev"];

// Parancs ban lista
let ignorelist = [];


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
        },

        {
            name: 'oltás',
            description: 'Olts le valaki',
            options: [
                {
                    name: 'kit',
                    type: 6,
                    description: 'Kit szeretnél leoltani?',
                    required: true
                }
            ]
        },

        {
            name: 'addoltás',
            description: 'Oltás hozzáadása az oltás adatbázishoz.',
            options: [
                {
                    name: 'oltas',
                    type: 3,
                    description: 'Ide írd az oltásodat.',
                    required: true
                }
            ]
        },

        {
            name: 'cmdban',
            description: 'Nem fog engedelmeskedni a bot valakinek',
            options: [
                {
                    name: 'célpont',
                    type: 6,
                    description: 'Kit szarjon le a bot nagyívből?',
                    required: true
                }
            ]
        },
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
        if (!ignorelist.includes(user.username)) {
            const username = options.getUser('célpont').username;
            await interaction.reply(`${username} meg fogja bánni hogy belépett erre a szerverre...`);
        } else {
            await interaction.reply(`Téged bezzeg nem kínoznak.`);
        }
    } else if (commandName == "hardwareinfo") {
        if (!ignorelist.includes(user.username)) {
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
        } else {
            await interaction.reply(`Neked annyit kell tudnod hogy leszarlak.`);
        }
    } else if (commandName == "oltás") {        
        const targetUser = options.getUser('kit');
        const username = targetUser.username;

        if (!ignorelist.includes(user.username)) {
            fs.readFile(path.join(__dirname, "oltasdb.txt"), 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    interaction.reply(`Hiba történt!`);
                    return;
                }

                if (data.trim() !== "") {
                    let oltasdb = data.split(/\r?\n/);
                    let replyMessage = `<@${targetUser.id}>\n`;
                    const randomIndex = Math.floor(Math.random() * oltasdb.length);
                    const randomValue = oltasdb[randomIndex];
                    replyMessage += `${randomValue}\n`;
                    interaction.reply(replyMessage);
                } else {
                    interaction.reply(`Jelenleg nincs oltás az oltás adatbázisban (oltasdb).\nAdj hozzá egy saját oltást a "/addoltás" parancssal.`);
                }
            });
        } else {
            await interaction.reply(`Inkább téged kéne oltani.`);
        }
    } else if (commandName == "addoltás") {
        const content = options.getString("oltas") + "\n";

        if (!ignorelist.includes(user.username)) {
            fs.writeFile(path.join(__dirname, "oltasdb.txt"), content, err => {
                if (err) {
                    console.error(err);
                    interaction.reply(`Nem tudtuk hozzáadni az oltást az oltás adatbázishoz.`);
                } else {
                    interaction.reply(`Oltás sikeresen hozzáadva az oltás adatbázishoz.`);
                }
            });
        } else {
            await interaction.reply(`A többieket sem érdekli hogy mit akarsz mondani. Akkor miért érdekelne engem?`);
        }
    } else if (commandName == "cmdban") {
        const targetUser = options.getUser('célpont').username;
        if (modlist.includes(user.username)) {
            if (targetUser == "Jozsibá" || targetUser == "Józsibá") {
                await interaction.reply(`Mégis magamat hogy ignoráljam?`);    
            } else {
                ignorelist.push(targetUser);
                await interaction.reply(`Mostantól ${targetUser}-t le fogom szarni.`);
            }
        } else {
            console.log(user.username)
            await interaction.reply(`Te nem vagy moderátor, te alsóbbrendű vagy.`);
        }
    }
});

// Event listener: Üzenetek olvasása
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    console.log(`Új üzenet: "${message.content}" (${message.author.tag})`);
});


client.login(token); // Bejelentkezés

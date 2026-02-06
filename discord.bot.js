const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.login(DISCORD_TOKEN);

client.once('ready', () => {
    console.log(`Discord bot logged in as ${client.user.tag}`);
});

async function sendImportantEmail(email) {
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!channel) return;

    await channel.send(
        `New Important Email
        From: ${email.from}
        Subject: ${email.subject}`
    );
}

module.exports = { sendImportantEmail };

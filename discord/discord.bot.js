const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
// const CHANNEL_ID = process.env.CHANNEL_ID;

client.login(DISCORD_TOKEN);

client.once("ready", () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
});

async function isDuplicate(from, subject, channelId) {
  const channel = await client.channels.fetch(channelId);
  const messages = await channel.messages.fetch({ limit: 100 });
  return messages.some(
    (message) =>
      message.content.includes(from) && message.content.includes(subject),
  );
}

async function sendImportantEmail(email, channelId) {
  const channel = await client.channels.fetch(channelId);
  if (!channel) return;

  if (await isDuplicate(email.from, email.subject, channelId)) {
    console.log("Email already exists in channel, skipping:", email.subject);
    return;
  }

  await channel.send(
    `📧 **New Important Email**
      From: ${email.from}
      Subject: ${email.subject}`,
  );
}

module.exports = { sendImportantEmail };

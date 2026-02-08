const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const commandPath = path.join(__dirname, "../command/rules.js");
const command = require(path.join(commandPath));
client.commands.set(command.data.name, command);

client.once("ready", () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Error while executing command",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);

async function isDuplicate(from, subject, channelId) {
  const channel = await client.channels.fetch(channelId);
  const messages = await channel.messages.fetch({ limit: 100 });

  return messages.some(
    (msg) => msg.content.includes(from) && msg.content.includes(subject),
  );
}

async function sendImportantEmail(email, channelId) {
  const channel = await client.channels.fetch(channelId);
  if (!channel) return;

  if (await isDuplicate(email.from, email.subject, channelId)) {
    console.log("Duplicate email skipped:", email.subject);
    return;
  }

  await channel.send(
    `**New Important Email**
      From: ${email.from}
      Subject: ${email.subject}`,
  );
}

async function addRule(rule) {
  const channel = await client.channels.fetch(rule.channelId);
  if (!channel) return;

  await channel.send(
    `**New Rule Added**
From: ${rule.sender}
Keywords: ${rule.keywords.join(", ")}
Negative Keywords: ${rule.negativeKeywords.join(", ")}
Channel: <#${rule.channelId}>`,
  );
}

module.exports = { sendImportantEmail, addRule };

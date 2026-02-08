const { SlashCommandBuilder } = require("discord.js");
const { getRules } = require("../sheets/sheets-rules.service");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Manage email rules")
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("List all active rules"),
    ),

  async execute(interaction) {
    const rules = await getRules();

    if (!rules.length) {
      return interaction.reply("❌ No rules found");
    }

    const message = rules
      .map(
        (rule, index) => `
          ${index + 1}️⃣
          📨 Sender: ${rule.sender}
          📌 Keywords: ${rule.keywords.join(", ") || "—"}
          🚫 Negative: ${rule.negativeKeywords.join(", ") || "—"}
          📢 Channel: <#${rule.channelId}>
          🟢 Enabled: ${rule.enabled}
        `,
      )
      .join("\n");

    await interaction.reply(message);
  },
};

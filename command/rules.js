const { SlashCommandBuilder } = require("discord.js");
const { getRules, addRule } = require("../sheets/sheets-rules.service");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Manage email rules")
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("List all active rules"),
    )
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a new rule")
        .addStringOption((option) =>
          option
            .setName("sender")
            .setDescription("Sender email address")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("keywords")
            .setDescription("Keywords to match (comma separated)")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("negative-keywords")
            .setDescription("Negative keywords to exclude (comma separated)")
            .setRequired(true),
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Discord channel to send notifications to")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "list") {
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
    }

    if (subcommand === "add") {
      const sender = interaction.options.getString("sender");
      const keywords = interaction.options.getString("keywords");
      const negative = interaction.options.getString("negative-keywords");
      const channel = interaction.options.getChannel("channel");

      const rule = {
        sender,
        keywords: keywords.split(",").map(k => k.trim()),
        negativeKeywords: negative
          ? negative.split(",").map(k => k.trim())
          : [],
        channelId: channel.id,
        enabled: true
      };

      await addRule(rule);

      await interaction.reply({
        content: "✅ Rule added successfully",
        ephemeral: true
      });
    }
  }
};

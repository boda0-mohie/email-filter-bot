const { getRules } = require("../sheets/sheets-rules.service");

async function handleRulesCommand(interaction) {
  const rules = await getRules();

  if (!rules.length) {
    return interaction.reply("❌ No rules found.");
  }

  const message = rules
    .map((rule, index) => {
      return `
    ${index + 1}️⃣ Sender: ${rule.sender}
    📌 Keywords: ${rule.keywords.join(", ") || "—"}
    🚫 Negative: ${rule.negativeKeywords.join(", ") || "—"}
    📢 Channel: ${rule.channelId}
    🟢 Enabled: ${rule.enabled}
    `;
    })
    .join("\n");

  await interaction.reply(message);
}

module.exports = { handleRulesCommand };

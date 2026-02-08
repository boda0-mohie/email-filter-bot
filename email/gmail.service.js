const { google } = require("googleapis");
const { appendEmailToSheet } = require("../sheets/sheets.service");
const { authorize } = require("../config/google.auth");
const { sendImportantEmail } = require("../discord/discord.bot");
const { getRules } = require("../sheets/sheets-rules.service");
const { matchEmailWithRule } = require("./matchEmailWithRule");

async function readEmails() {
  const auth = await authorize();
  const rules = await getRules();
  const gmail = google.gmail({
    version: "v1",
    auth,
  });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 30,
    q: "is:unread",
  });

  const messages = res.data.messages || [];

  for (const msg of messages) {
    const message = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
    });

    const headers = message.data.payload.headers;
    const from = headers.find((h) => h.name === "From")?.value || "";
    const subject = headers.find((h) => h.name === "Subject")?.value || "";
    const content = message.data.snippet;

    const matchedRule = matchEmailWithRule({ from, subject, content }, rules);
    if (matchedRule) {
      await appendEmailToSheet({
        from,
        subject,
        channelId: matchedRule.channelId,
        important: true,
      });
      await sendImportantEmail(
        {
          from,
          subject,
        },
        matchedRule.channelId,
      );
    }
    console.log("Saved to sheet: ", subject);
  }
}

module.exports = { readEmails };

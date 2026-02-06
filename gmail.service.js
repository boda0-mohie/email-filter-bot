const { google } = require('googleapis');
const { filterEmail } = require('./emailFilter');
const { appendEmailToSheet } = require('./sheets.service');
const { authorize } = require('./google.auth');
const { sendImportantEmail } = require('./discord.bot');

async function readEmails() {
  const auth = await authorize();

  const gmail = google.gmail({
    version: 'v1',
    auth,
  });

  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 30,
    q: 'is:unread',
  });

  const messages = res.data.messages || [];

  for (const msg of messages) {
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
    });

    const headers = message.data.payload.headers;
    const from = headers.find(h => h.name === 'From')?.value || '';
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const content = message.data.snippet;

    const filterResult = filterEmail({ from, subject, content });

    if (filterResult.important) {
      await appendEmailToSheet({
        from,
        subject,
        category: filterResult.category,
        important: true,
      });

      await sendImportantEmail({
        from,
        subject,
      });
      console.log('Saved to sheet: ', subject);
    }
  }
}

module.exports = { readEmails };

const { google } = require('googleapis');
const { authorize } = require('./google.auth');
require('dotenv').config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function emailExists(auth, from, subject) {
  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!C:D',
  });

  const rows = res.data.values || [];

  return rows.some(
    row =>
      row[7] === from &&
      row[8] === subject
  );
}

async function appendEmailToSheet(email) {
  const auth = await authorize();

  const exists = await emailExists(auth, email.from, email.subject);
  if (exists) {
    console.log('Email already exists in sheet, skipping:', email.subject);
    return;
  }

  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A:E',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toLocaleString(),
        email.from,
        email.subject,
        email.category,
        email.important ? 'YES' : 'NO'
      ]],
    },
  });
}

module.exports = { appendEmailToSheet };

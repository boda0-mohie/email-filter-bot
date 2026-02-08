const { google } = require("googleapis");
const { authorize } = require("../config/google.auth");
require("dotenv").config();

const EMAIL_LOG_SPREADSHEET_ID = process.env.EMAILS_LOG_SPREADSHEET_ID;
const SPREADSHEET_RANGE = "Emails_Log";

async function emailExists(auth, from, subject) {
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: EMAIL_LOG_SPREADSHEET_ID,
    range: SPREADSHEET_RANGE,
  });

  const rows = res.data.values || [];

  return rows.some((row) => row[0] === from && row[1] === subject);
}

async function appendEmailToSheet(email) {
  const auth = await authorize();

  const exists = await emailExists(auth, email.from, email.subject);
  if (exists) {
    console.log("Email already exists in sheet, skipping:", email.subject);
    return;
  }

  const sheets = google.sheets({
    version: "v4",
    auth,
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: EMAIL_LOG_SPREADSHEET_ID,
    range: SPREADSHEET_RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          new Date().toLocaleString(),
          email.from,
          email.subject,
          email.channelId,
          email.important ? "YES" : "NO",
        ],
      ],
    },
  });
}

module.exports = { appendEmailToSheet };

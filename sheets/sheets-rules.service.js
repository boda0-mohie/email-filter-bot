const { google } = require("googleapis");
const { authorize } = require("../config/google.auth");
require("dotenv").config();

const RULES_SPREADSHEET_ID = process.env.RULES_SPREADSHEET_ID;
const RULES_RANGE = "Rules!A2:E";

async function getRules() {
  const auth = await authorize();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: RULES_SPREADSHEET_ID,
    range: RULES_RANGE,
  });

  const rows = res.data.values || [];

  return rows
    .map((row) => ({
      sender: row[0]?.toLowerCase() || "",
      keywords: row[1]
        ? row[1]
            .toLowerCase()
            .split(",")
            .map((k) => k.trim())
        : [],
      negativeKeywords: row[2]
        ? row[2]
            .toLowerCase()
            .split(",")
            .map((k) => k.trim())
        : [],
      channelId: row[3],
      enabled: row[4] === "TRUE",
    }))
    .filter((rule) => rule.enabled);
}

module.exports = { getRules };

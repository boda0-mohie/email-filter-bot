# Discord Gmail Job Tracker

This project is an automated tool designed to monitor your Gmail inbox for job-related emails, log them into a Google Sheet, and send real-time notifications to a specified Discord channel.

## Features

- **Gmail Integration**: Scans your Gmail inbox for unread messages.
- **Smart Filtering**: Automatically categorizes emails based on keywords (e.g., "job", "career", "hiring") using a custom filter logic.
- **Google Sheets Logging**: Appends details of important emails (Date, Sender, Subject, Category) to a Google Sheet.
- **Discord Notifications**: Sends an alert to a Discord channel when an important job-related email is found.

## Prerequisites

- Node.js installed on your machine.
- A Google Cloud Project with Gmail and Sheets APIs enabled.
- A Discord Bot with appropriate permissions.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd discord-project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    DISCORD_TOKEN=your_discord_bot_token
    CHANNEL_ID=your_discord_channel_id
    SPREADSHEET_ID=your_google_sheet_id
    ```

4.  **Google Credentials:**
    - Place your `credentials.json` file (downloaded from Google Cloud Console) in the root directory.
    - On the first run, the application will prompt you to authorize access and generate a `token.json` file.

## Usage

Run the application:

```bash
node index.js
```

The script will:
1.  Authenticate with Google services.
2.  Fetch unread emails from your inbox.
3.  Filter them based on `emailFilter.js` logic.
4.  If an email is flagged as **Important (JOB)**:
    - It gets added to your Google Sheet.
    - A notification is sent to your Discord channel.

## Project Structure

- `index.js`: Main entry point.
- `gmail.service.js`: Handles Gmail API interaction and main logic flow.
- `sheets.service.js`: Handles Google Sheets API interaction.
- `discord.bot.js`: Manages Discord bot connection and messaging.
- `emailFilter.js`: Contains the logic to categorize emails.
- `google.auth.js`: Handles Google OAuth2 authentication.

## Technologies Used

- [discord.js](https://discord.js.org/)
- [googleapis](https://github.com/googleapis/google-api-nodejs-client)
- [dotenv](https://www.npmjs.com/package/dotenv)

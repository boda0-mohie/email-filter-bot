# Discord Gmail Job Tracker

This project is an automated tool designed to monitor your Gmail inbox for job-related emails, log them into a Google Sheet, and send real-time notifications to a specified Discord channel. It includes a dynamic rule management system controllable directly from Discord.

## Features

- **Gmail Integration**: Scans your Gmail inbox for unread messages.
- **Dynamic Rule Engine**: Filters emails based on sender, keywords, and negative keywords.
- **Discord Slash Commands**: Manage your email filtering rules directly from Discord using `/rules`.
- **Google Sheets Integration**:
  - Logs important emails to a specific sheet.
  - Reads filtering rules from a dedicated "Rules" sheet.
- **Real-time Notifications**: Sends alerts to specific Discord channels based on matched rules.

## Prerequisites

- Node.js installed on your machine.
- A Google Cloud Project with Gmail and Sheets APIs enabled.
- A Discord Bot with appropriate permissions (including slash commands).

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
    client_id=your_discord_client_id
    guild_id=your_discord_server_id
    SPREADSHEET_ID=your_main_logging_sheet_id
    RULES_SPREADSHEET_ID=your_rules_sheet_id
    ```

4.  **Google Credentials:**
    - Place your `credentials.json` file (downloaded from Google Cloud Console) in the root directory.
    - On the first run, the application will prompt you to authorize access and generate a `token.json` file.

## Usage

1.  **Start the application:**

    ```bash
    node index.js
    ```

2.  **Manage Rules via Discord:**
    - `/rules list`: View all active filtering rules.
    - `/rules add`: Add a new rule with the following parameters:
      - `sender`: Email address to match (e.g., `no-reply@greenhouse.io`).
      - `keywords`: Comma-separated list of words to look for (e.g., `interview, schedule`).
      - `negative-keywords`: Comma-separated list of words to exclude (e.g., `rejection`).
      - `channel`: The Discord channel where notifications for this rule should be sent.

3.  **Bot Operation:**
    - The bot periodically checks for unread emails.
    - It matches emails against the rules defined in your Google Sheet (managed via the slash command).
    - If a match is found, it logs the email and sends a notification to the configured channel.

## Project Structure

- `command/`: Contains Discord slash command definitions (e.g., `rules.js`).
- `config/`: Configuration files (e.g., `google.auth.js`).
- `discord/`: Discord bot logic and event handlers.
- `email/`: Gmail service and email matching logic.
- `sheets/`: Google Sheets interaction services (logging and rules).
- `index.js`: Main entry point.

## Technologies Used

- [discord.js](https://discord.js.org/)
- [googleapis](https://github.com/googleapis/google-api-nodejs-client)
- [dotenv](https://www.npmjs.com/package/dotenv)

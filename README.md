# Multi-Session WhatsApp Bot

A Node.js WhatsApp bot that supports multiple simultaneous sessions, allowing you to manage multiple WhatsApp accounts from a single application.

## Features

- **Multiple Sessions**: Run multiple WhatsApp bot instances simultaneously
- **Session Management**: Start, stop, and monitor individual sessions
- **Auto-notifications**: Automatic ready notifications when sessions come online
- **Error Handling**: Comprehensive error handling and logging
- **Graceful Shutdown**: Clean shutdown of all sessions
- **Configurable**: Easy configuration through `sessions.config.js`

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Edit `sessions.config.js` to configure your sessions:

```javascript
{
  id: "session1",
  name: "Primary Bot",
  notifyNumber: "919370928324@c.us", // Phone number to notify when ready
  dataPath: "./sessions/session1",   // Session data storage path
  enabled: true,                     // Enable/disable this session
  description: "Main WhatsApp bot"
}
```

## Usage

1. **Start the bot**:
   ```bash
   node index.js
   ```

2. **Scan QR codes**: Each session will display a QR code. Scan each with the corresponding WhatsApp account.

3. **Bot Commands**: Send these commands to any connected session:
   - `!ping` - Test bot responsiveness
   - `!status` - Check session status
   - `!sessions` - View active session count

## Session Management

- **Add new sessions**: Add entries to `sessions.config.js`
- **Disable sessions**: Set `enabled: false` in the configuration
- **Session data**: Each session stores authentication data in its own directory

## File Structure

```
├── index.js              # Main bot application
├── sessions.config.js    # Session configuration
├── sessions/             # Session data directories (auto-created)
│   ├── session1/
│   ├── session2/
│   └── session3/
├── package.json
└── README.md
```

## Important Notes

- Each session requires a separate WhatsApp account
- Session data contains authentication information - keep it secure
- The `sessions/` directory is automatically ignored by git
- Use Ctrl+C for graceful shutdown

## Troubleshooting

- **QR Code not scanning**: Try refreshing or restarting the specific session
- **Authentication failed**: Delete the session data directory and re-authenticate
- **Session disconnected**: The bot will attempt to reconnect automatically

## Security

- Never share session data directories
- Keep your notification phone numbers private
- Use environment variables for sensitive configuration in production

// index.js
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const config = require("./sessions.config.js");

// Get enabled sessions from configuration
const sessions = config.sessions.filter((session) => session.enabled);

class WhatsAppSessionManager {
  constructor() {
    this.clients = new Map();
    this.activeSessions = new Set();
  }

  createClient(sessionConfig) {
    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: sessionConfig.id,
        dataPath: sessionConfig.dataPath,
      }),
    });

    // QR Code event
    client.on("qr", (qr) => {
      console.log(`🔐 [${sessionConfig.name}] Scan this QR code:`);
      qrcode.generate(qr, { small: true });
    });

    // Authentication event
    client.on("authenticated", () => {
      console.log(`✅ [${sessionConfig.name}] Authenticated successfully!`);
    });

    // Ready event
    client.on("ready", async () => {
      console.log(`✅ [${sessionConfig.name}] WhatsApp bot is ready!`);
      this.activeSessions.add(sessionConfig.id);

      // Send ready notification
      await this.sendReadyNotification(client, sessionConfig);
    });

    // Message event
    client.on("message", async (message) => {
      console.log(`📩 [${sessionConfig.name}] Received: ${message.body}`);
      await this.handleMessage(message, sessionConfig);
    });

    // Disconnection event
    client.on("disconnected", (reason) => {
      console.log(`❌ [${sessionConfig.name}] Disconnected:`, reason);
      this.activeSessions.delete(sessionConfig.id);
    });

    // Error event
    client.on("auth_failure", (msg) => {
      console.error(`❌ [${sessionConfig.name}] Authentication failed:`, msg);
    });

    return client;
  }

  async sendReadyNotification(client, sessionConfig) {
    const message = `🤖 ${sessionConfig.name} is now ready and operational!`;

    try {
      await client.sendMessage(sessionConfig.notifyNumber, message);
      console.log(
        `📤 [${sessionConfig.name}] Ready notification sent to ${sessionConfig.notifyNumber}`
      );
    } catch (error) {
      console.error(
        `❌ [${sessionConfig.name}] Failed to send ready notification:`,
        error.message
      );
    }
  }

  async handleMessage(message, sessionConfig) {
    // Handle common commands
    if (message.body === "!ping") {
      await message.reply(`pong 🏓 from ${sessionConfig.name}`);
    } else if (message.body === "!status") {
      await message.reply(`✅ ${sessionConfig.name} is active and running!`);
    } else if (message.body === "!sessions") {
      const activeCount = this.activeSessions.size;
      await message.reply(
        `📊 Active sessions: ${activeCount}/${sessions.length}`
      );
    }
  }

  async startSession(sessionConfig) {
    try {
      console.log(`🚀 Starting ${sessionConfig.name}...`);

      const client = this.createClient(sessionConfig);
      this.clients.set(sessionConfig.id, client);

      await client.initialize();
      console.log(`✅ ${sessionConfig.name} initialized successfully`);
    } catch (error) {
      console.error(`❌ Failed to start ${sessionConfig.name}:`, error.message);
    }
  }

  async startAllSessions() {
    console.log(`🚀 Starting ${sessions.length} WhatsApp sessions...`);

    for (const sessionConfig of sessions) {
      await this.startSession(sessionConfig);
      // Add delay between session starts to avoid rate limiting
      await new Promise((resolve) =>
        setTimeout(resolve, config.settings.sessionStartDelay)
      );
    }
  }

  async stopSession(sessionId) {
    const client = this.clients.get(sessionId);
    if (client) {
      await client.destroy();
      this.clients.delete(sessionId);
      this.activeSessions.delete(sessionId);
      console.log(`🛑 Session ${sessionId} stopped`);
    }
  }

  async stopAllSessions() {
    console.log("🛑 Stopping all sessions...");
    for (const [sessionId] of this.clients) {
      await this.stopSession(sessionId);
    }
  }

  getSessionStatus() {
    return {
      total: sessions.length,
      active: this.activeSessions.size,
      sessions: sessions.map((s) => ({
        id: s.id,
        name: s.name,
        active: this.activeSessions.has(s.id),
      })),
    };
  }
}

// Initialize and start the session manager
const sessionManager = new WhatsAppSessionManager();

// Start all sessions
sessionManager.startAllSessions();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await sessionManager.stopAllSessions();
  process.exit(0);
});

// Export for potential use in other modules
module.exports = { sessionManager, sessions };

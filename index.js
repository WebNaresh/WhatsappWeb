// index.js
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Create a new client
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./session",
  }),
});

console.log(`🚀 ~ client:`, client);

// Show QR in terminal
client.on("qr", (qr) => {
  console.log("🔐 Scan this QR code with your WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// Bot is ready
client.on("ready", async (data) => {
  console.log(`🚀 ~ data:`, data);
  console.log("✅ WhatsApp bot is ready!");

  // Automatically send a message to the specified phone number
  const phoneNumber = "919370928324@c.us"; // Format: countrycode + number + @c.us
  const message = "🤖 WhatsApp bot is now ready and operational!";

  try {
    await client.sendMessage(phoneNumber, message);
    console.log(
      `📤 Automatic ready message sent successfully to ${phoneNumber}`
    );
  } catch (error) {
    console.error(
      `❌ Failed to send automatic ready message to ${phoneNumber}:`,
      error.message
    );
  }
});

// Respond to messages
client.on("message", (message) => {
  console.log(`📩 Received: ${message.body}`);
  if (message.body === "!ping") {
    message.reply("pong 🏓");
  }
});

// Start the bot
client.initialize();

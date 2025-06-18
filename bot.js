const BOT_TOKEN = "7221542309:AAHWNb2NCqL72vc-0EV5XEdpRm-iz5NrlFw";
const TELEGRAM_API = "https://api.telegram.org/bot7221542309:AAHWNb2NCqL72vc-0EV5XEdpRm-iz5NrlFw";

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Only POST requests allowed", { status: 405 });
  }

  const update = await req.json();
  const message = update.message;
  if (!message || !message.text) {
    return new Response("No valid message", { status: 200 });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();
  const name = message.from.first_name || "User";
  const userId = message.from.id;
  const chatType = message.chat.type;

  // Typing animation
  await sendTyping(chatId);

  // Command Handling
  if (text === "/start") {
    await sendMessage(chatId, `👋 হ্যালো ${name}!\nআমি তোমার Telegram Bot 🤖\n/help কমান্ড লিখে সাহায্য দেখো।`);
  } else if (text === "/help") {
    await sendMessage(chatId, `🛠️ Available Commands:\n/start\n/help\n/info\n/buttons`);
  } else if (text === "/info") {
    await sendMessage(chatId, `🧾 ইউজার ইনফো:\n👤 নাম: ${name}\n🆔 ID: ${userId}\n💬 টাইপ: ${chatType}`);
  } else if (text === "/buttons") {
    await sendInlineKeyboard(chatId, "👇 নিচ থেকে একটি বেছে নাও:", [
      [{ text: "🌐 Visit Website", url: "https://example.com" }],
      [{ text: "🧠 AI Info", callback_data: "ai" }],
      [{ text: "📞 Contact", callback_data: "contact" }]
    ]);
  } else {
    await sendMessage(chatId, "❓ আমি বুঝতে পারিনি। `/help` দিয়ে কমান্ড লিস্ট দেখো।");
  }

  return new Response("OK", { status: 200 });
}

// ========= Helper Functions =========
async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot7221542309:AAHWNb2NCqL72vc-0EV5XEdpRm-iz5NrlFw/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function sendTyping(chatId) {
  await fetch(`https://api.telegram.org/bot7221542309:AAHWNb2NCqL72vc-0EV5XEdpRm-iz5NrlFw/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action: "typing" }),
  });
}

async function sendInlineKeyboard(chatId, text, buttons) {
  await fetch(`https://api.telegram.org/bot7221542309:AAHWNb2NCqL72vc-0EV5XEdpRm-iz5NrlFw/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: { inline_keyboard: buttons }
    }),
  });
}

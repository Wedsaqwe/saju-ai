export async function POST(req) {
  try {
    const { chatId, message } = await req.json();

    if (!chatId || !message) {
      return Response.json({ error: "chatId and message required" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return Response.json({ error: "Telegram bot token not configured" }, { status: 500 });
    }

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      return Response.json({ error: data.description || "Telegram send failed" }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Telegram API error:", error);
    return Response.json({ error: error.message || "Telegram error" }, { status: 500 });
  }
}

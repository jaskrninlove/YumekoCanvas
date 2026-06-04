export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { image, chat_id, strokes, colors } = req.body;

    if (!image || !chat_id) {
      return res.status(400).json({ ok: false, error: "Missing image or chat_id" });
    }

    const base64 = image.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    const form = new FormData();
    form.append("chat_id", String(chat_id));
    form.append(
      "caption",
      `<blockquote>🎨 <b>Canvas Submitted</b></blockquote>\n\nThe artist has submitted the drawing.\nStart guessing now, darling~\n\n🖌 Strokes: <b>${strokes}</b>\n🎨 Colors Used: <b>${colors}</b>`
    );
    form.append("parse_mode", "HTML");
    form.append("photo", new Blob([buffer], { type: "image/jpeg" }), "yumeko-drawing.jpg");

    const tgRes = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await tgRes.json();

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}

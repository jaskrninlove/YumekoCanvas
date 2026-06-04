export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  try {
    const {
      image,
      chat_id,
      msg_id,
      strokes,
      colors,
      mode,
      kind,
    } = req.body || {};

    if (!image || !chat_id) {
      return res.status(400).json({
        ok: false,
        error: "Missing image or chat_id",
      });
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!BOT_TOKEN) {
      return res.status(500).json({
        ok: false,
        error: "BOT_TOKEN missing",
      });
    }

    const isLive = kind === "live";
    const isFakeArtist = mode === "fake_artist";

    let caption = "";

    if (isLive) {
      caption = isFakeArtist
        ? `<blockquote>🖌 <b>Artist Turn</b></blockquote>

The artist is drawing right now...

🖌 Strokes: <b>${strokes || 0}</b>
🎨 Colors Used: <b>${colors || 0}</b>`
        : `<blockquote>🎨 <b>Drawing Live</b></blockquote>

Watch closely. The canvas is slowly coming to life...

🖌 Strokes: <b>${strokes || 0}</b>
🎨 Colors Used: <b>${colors || 0}</b>`;
    } else {
      caption = isFakeArtist
        ? `<blockquote>🖌 <b>Stroke Submitted</b></blockquote>

The artist has submitted their stroke.

🖌 Strokes: <b>${strokes || 0}</b>
🎨 Colors Used: <b>${colors || 0}</b>`
        : `<blockquote>🎨 <b>Canvas Submitted</b></blockquote>

The artist has submitted the drawing.
Start guessing now, darling~

🖌 Strokes: <b>${strokes || 0}</b>
🎨 Colors Used: <b>${colors || 0}</b>`;
    }

    const base64 = image.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    const photoBlob = new Blob(
      [buffer],
      { type: "image/jpeg" }
    );

    // ==================================================
    // LIVE UPDATE SAME MESSAGE
    // ==================================================

    if (msg_id && Number(msg_id) > 0) {
      const form = new FormData();

      form.append("chat_id", String(chat_id));
      form.append("message_id", String(msg_id));

      form.append(
        "media",
        JSON.stringify({
          type: "photo",
          media: "attach://photo",
          caption,
          parse_mode: "HTML",
        })
      );

      form.append(
        "photo",
        photoBlob,
        "yumeko-live.jpg"
      );

      const editResponse = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/editMessageMedia`,
        {
          method: "POST",
          body: form,
        }
      );

      const editData = await editResponse.json();

      if (editData.ok) {
        return res.status(200).json(editData);
      }

      console.log(
        "Edit failed:",
        editData
      );

      // Live update fail ho jaye toh spam mat bhejna
      if (isLive) {
        return res.status(200).json(editData);
      }
    }

    // ==================================================
    // FALLBACK SEND PHOTO
    // ==================================================

    const form = new FormData();

    form.append(
      "chat_id",
      String(chat_id)
    );

    form.append(
      "caption",
      caption
    );

    form.append(
      "parse_mode",
      "HTML"
    );

    form.append(
      "photo",
      photoBlob,
      "yumeko-drawing.jpg"
    );

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}

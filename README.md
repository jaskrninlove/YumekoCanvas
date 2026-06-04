# Yumeko Sketch Canvas

A clean Microsoft Paint-style Telegram Mini App canvas for Yumeko Sketch Royale.

## Features

- Pen, marker, fill, shape, and eraser tools
- Color palette with custom color picker
- Brush size and opacity controls
- Undo, redo, and clear
- Mobile-friendly layout
- Telegram WebApp support using `Telegram.WebApp.sendData`
- Auto-submit payload support for bot integration

## Deploy

### Netlify
1. Upload this folder to Netlify.
2. Set publish directory to `/`.
3. Deploy.
4. Copy your HTTPS URL.

### Vercel
1. Import this folder/repo in Vercel.
2. Deploy as a static project.
3. Copy your HTTPS URL.

### GitHub Pages
1. Push these files to a GitHub repo.
2. Enable Pages from the main branch.
3. Use the generated HTTPS URL.

## BotFather Setup

For Telegram Mini App buttons, set your domain in BotFather:

```text
/setdomain
```

Then use your deployed domain, for example:

```text
https://your-domain.vercel.app
```

## Bot Config Example

```python
SKETCH_WEBAPP_URL = "https://your-domain.vercel.app"
SKETCH_DRAW_TIME = 120
```

## WebApp URL with parameters

The canvas supports:

```text
?word=dragon&chat=-1001234567890&time=120
```

Example:

```text
https://your-domain.vercel.app/?word=dragon&chat=-1001234567890&time=120
```

## Telegram submit payload

When the user submits, the WebApp sends JSON:

```json
{
  "image": "data:image/jpeg;base64,...",
  "word": "dragon",
  "chat_id": "-1001234567890",
  "strokes": 12,
  "colors": 4
}
```

Your bot should handle `web_app_data` and post the image to the group.

## License

MIT License.

Copyright (c) 2026 Jass

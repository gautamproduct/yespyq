# YESPYQ — UPSC CSE Previous Year Questions

A free, fast, distraction-free platform to practise **UPSC CSE Prelims (GS Paper-I) Previous Year Questions** — organised subject-wise and year-wise, each with an answer key and explanation.

🔗 **Live:** https://yespyq.com

## Features
- Practice **subject-wise** (Polity, History, Geography, Economy, Environment, Science & Tech, Current Affairs)
- Practice **year-wise** (2021–2025)
- Instant answer keys + detailed explanations
- Local progress tracking (no login required)
- SEO-optimised (Open Graph, Twitter cards, JSON-LD structured data, sitemap, PWA manifest)

## Tech
Plain HTML / CSS / vanilla JS — no build step. Hosted on GitHub Pages.

| File | Purpose |
|------|---------|
| `index.html` | Page structure, meta tags, structured data |
| `styles.css` | Blue brand theme |
| `app.js` | Navigation + quiz engine |
| `data.js` | Question bank |
| `assets/` | Favicon + OG image |

## Adding questions
Append objects to the `QUESTIONS` array in `data.js`:

```js
{
  id: "Q2025-POL-02", subject: "polity", year: 2025, paper: "Prelims GS-I",
  q: "Question text...",
  options: ["A", "B", "C", "D"],
  answer: 0,            // index of correct option
  explanation: "Why..."
}
```

## Disclaimer
YESPYQ is an independent study tool and is **not affiliated with or endorsed by UPSC** (Union Public Service Commission).

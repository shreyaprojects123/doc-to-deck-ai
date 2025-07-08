# Doc-to-Deck AI

Turn any text or article into a professional slide deck with AI—complete with visuals, tables, and export to PDF or PPTX.

## Features

- Paste text or import from a URL (Google Docs, articles, etc.)
- Generate a slide deck using OpenAI GPT-4o
- 3 beautiful themes
- 50% of slides include AI-generated visuals, charts, or tables (with sources)
- Export slides as PDF or PPTX
- All processing is local—your OpenAI API key is never sent to a third party

## Demo

![Demo Screenshot](demo-screenshot.png)

## Getting Started

### 1. **Clone the Repo**

```sh
git clone https://github.com/<your-username>/doc-to-deck-ai.git
cd doc-to-deck-ai
```

### 2. **Install Dependencies**

```sh
npm install
```

### 3. **Set Up Your OpenAI API Key**

Create a `.env` file in the project root:

```
OPENAI_API_KEY=sk-...your-key-here...
```

> **Note:** You need an OpenAI API key with access to GPT-4o.

### 4. **Start the Backend**

```sh
node server.js
```

### 5. **Start the Frontend**

In a new terminal window/tab:

```sh
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Exporting Slides

- **PDF:** Click "Download PDF"
- **PPTX:** Click "Export as PPTX"

---

## Technologies Used

- React + Vite + TypeScript
- Tailwind CSS
- OpenAI GPT-4o API
- pptxgenjs (for PPTX export)
- react-markdown (for rendering tables/visuals)

---

## Customization

- Edit `server.js` to change the prompt or model.
- Edit `src/pages/Index.tsx` and `src/components/SlideCarousel.tsx` for UI changes.

---

## License

MIT

---

## Credits

Built with OpenAI

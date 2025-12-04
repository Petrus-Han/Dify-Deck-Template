# Dify Training Deck Template

This is a **template branch** for creating slide decks using the Dify Training Deck system. Fork this branch to build your own presentation content.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** at `http://localhost:3000`

## 🤖 Vibe Coding (Recommended Workflow)

This project is designed to be **AI-Native**. **You should NOT write the slide code manually.**
Instead, use AI IDEs like **Cursor**, **Windsurf**, or **Copilot** to generate the deck for you.

### How to "Vibe" Your Deck

1. **Draft your ideas** in `TEMPLATE.md` (or just have a rough outline in your head).
2. **Open Cursor Composer** (Cmd+I / Ctrl+I).
3. **Prompt the AI**:

   > "Create a new slide deck in `src/contents/product-launch`. Use the content from `TEMPLATE.md`. Reference `src/engine/types.ts` for available slide types and `src/contents/all-styles-en/index.tsx` for examples. Ensure the design follows `prompt/dify_deck_style_en.md`."

4. **Watch the magic happen**. The AI will:
   - Create the directory.
   - Generate `index.tsx` with all your slides.
   - Import necessary icons and components.
   - Auto-format the layout.

5. **Register it**: Ask the AI to "Register this new deck in `registry.ts`".

**That's it. Zero manual coding required.**

## How to Create Your Own Deck (Manual Way)

### Step 1: Create Your Content Folder

Copy the template folder to create your new deck:

```bash
cp -r src/contents/template-guide src/contents/my-new-deck
```

### Step 2: Edit Your Slides

Open `src/contents/my-new-deck/index.tsx` and modify the `SLIDES` array. Each slide is an object with:

- `id`: Unique slide number
- `type`: Slide layout type (see available types below)
- `title`: Main heading
- `subtitle`: Secondary heading (optional)
- `content`: Array of text lines (supports `**bold**` markdown)
- `items`: Array of card items (for CARDS, FAQ, etc.)
- `visualContent`: React component for visual area

### Step 3: Update Author Info

Edit `src/contents/common.ts` with your information:

```typescript
export const AUTHOR_INFO = {
  name: "Your Name",
  title: "Your Job Title",
  email: "your.email@example.com",
  // ...
};
```

### Step 4: Register Your Deck

Add your deck to `src/contents/registry.ts`:

```typescript
import { SLIDES as myDeck } from './my-new-deck';

export const decks: Record<string, DeckConfig> = {
  'my-deck': {
    id: 'my-deck',
    title: 'My Presentation Title',
    slides: myDeck
  }
};
```

### Step 5: Access Your Deck

Visit `http://localhost:3000?deck=my-deck`

## Available Slide Types

| Type | Description |
|------|-------------|
| `TITLE` | Cover slide with large title |
| `CONTENT` | Simple text content slide |
| `SPLIT` | Left text, right visual |
| `CARDS` | Grid of feature cards |
| `CHAPTER_TITLE` | Blue section divider |
| `MACRO_FOCUS` | Dark summary slide |
| `PRESENTER` | Speaker introduction |
| `FAQ` | FAQ list layout |
| `PRICING` | Pricing cards |
| `PILLARS` | Vertical columns |
| `DIAGRAM` | For architecture diagrams |
| `END` | Thank you / closing slide |

See `src/engine/types.ts` for the complete list.

## Project Structure

```
├── src/
│   ├── contents/           # Your slide decks go here
│   │   ├── common.ts       # Shared author/company info
│   │   ├── registry.ts     # Deck registration
│   │   └── template-guide/ # Example deck
│   ├── engine/             # Slide rendering engine
│   │   ├── components/     # Slide components
│   │   └── types.ts        # Type definitions
│   ├── components/         # Custom React components
│   ├── lib/                # Utility libraries
│   └── app/                # App-level code
├── public/
│   ├── assets/             # Fonts, icons, images
│   ├── dsl/                # DSL files (optional)
│   └── screenshot/         # Screenshots (optional)
├── prompt/                 # Style guide prompts
├── scripts/                # Build scripts
├── config/                 # Configuration files
└── TEMPLATE.md             # Content outline template
```

## Content Drafting

Use `TEMPLATE.md` to draft your slide content in markdown before implementing in TypeScript.

## Style Guide

See `prompt/dify_deck_style_en.md` (English) or `prompt/dify_deck_style_zh.md` (中文) for visual design guidelines.

## License

Internal use only. Copyright © Dify Tech Inc.

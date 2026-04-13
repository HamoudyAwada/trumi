# Trumi — Claude Code Project Brief

> This file is the single source of truth for Claude Code working on the Trumi project.
> Read this fully at the start of every session before writing any code.

---

## What is Trumi?

Trumi is a **self-discovery and personal growth companion** for young adults. It helps users understand their values and motivations, then guides them toward goals that genuinely reflect who they are — not who they feel pressured to become.

The emotional core: **reflection before action. Growth without guilt. Progress without pressure.**

This is not a productivity app. Trumi is compassionate, calm, and non-toxic by design.

**Tagline:** *Growth that feels like you.*

---

## The Core User Flow

1. User onboards via a guided survey/questionnaire about their values, motivations, and identity
2. AI analyzes their responses and suggests aligned goals and sub-goals
3. User tracks progress through daily, weekly, and monthly check-ins
4. User receives reflective feedback on their journey — what's going well, what could shift
5. User's customizable character evolves visually to reflect their progress
6. User can chat with their character (AI-powered) for reflection and guidance

---

## Key Features (MVP)

| ID | Feature | Description |
|----|---------|-------------|
| TRUMI-1 | Goal Tracking | Create, organize, and track goals in one place |
| TRUMI-2 | Customizable Character | A personal avatar that reflects the user's progress and style |
| TRUMI-3 | Achievements | Visual milestones to reflect on the journey |
| TRUMI-4 | Flexible Goal Management | Pause, archive, or redefine goals without guilt or penalty |
| TRUMI-5 | Rewards System | Intrinsic + extrinsic rewards for progress and consistency |
| TRUMI-6 | Effortless Progress Input | Quick-add, reminders, and minimal-friction logging |
| TRUMI-7 | Calm UX | Low-stimulation, compassionate design throughout |
| TRUMI-8 | Character Customization | Earn and unlock cosmetic options for the avatar |
| TRUMI-12 | Daily Check-ins | Guided morning, midday, and evening reflections |
| TRUMI-14/15 | Notifications | Personalized, motivational, non-intrusive reminders |
| TRUMI-16 | Character Chatbot | AI-powered conversation with the user's own character |
| TRUMI-17 | Insights | Pattern recognition across moods, habits, and goals |
| TRUMI-18 | Goal Flexibility | Psychologically safe goal pivoting and archiving |
| TRUMI-19 | Timeline View | Look back on reflections and milestones |

---

## AI Integration (Google Gemini — Free Tier)

The AI is central to the app — not a bolt-on feature.

**Primary use cases:**
- **Onboarding:** Analyze user survey responses to suggest aligned goals and sub-goals
- **Daily/Weekly/Monthly Reflections:** Generate personalized insights on progress
- **Goal Suggestions:** Recommend goals and sub-goals that align with stated values
- **Character Chatbot:** The user's character converses with them for reflection and guidance (likely the heaviest AI use)

**API:** Google Gemini free tier
**Setup:** The developer (Moe) will set up a Gemini API key when ready. Claude Code should prompt for the key and store it in a `.env` file as `VITE_GEMINI_API_KEY`. Never hardcode API keys.

**Tone for all AI-generated copy:** Warm, second-person ("you"), empathetic, non-pressuring. Never use "must", "should", or language that implies obligation or failure. Always celebrate small progress.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React (via Vite) |
| Language | JavaScript (not TypeScript) |
| Styling | CSS with design tokens (see below) — no Tailwind |
| AI | Google Gemini API (free tier) |
| Hosting | Vercel |
| Version Control | GitHub |
| Design Tool | Figma (accessed via Figma MCP) |
| PWA | Not required for MVP |

**Dev environment:** Mac M3 Pro, 18GB RAM, Node.js v24+, VS Code

**Figma file key:** `AAIkcs7Qk445QuSRh90T00`
Use the Figma MCP tool to extract design context, tokens, and component specs directly from this file. Always prefer Figma MCP over assumptions when implementing UI.

---

## Design System & Tokens

### Colour Palette

```css
:root {
  /* Primary */
  --color-horizon-violet: #6666cc;
  --color-cloud: #fffcfa;

  /* Secondary */
  --color-tranquil-night: #0f1c3f;
  --color-fogstone: #66747f;

  /* Accent */
  --color-lucent-green: #cdff6d;
  --color-liminal-blue: #aff4e1;
}
```

### Approved Colour Combinations (Accessibility Compliant)

| Text | Background |
|------|-----------|
| White | Horizon Violet |
| White | Fogstone |
| White | Tranquil Night |
| Horizon Violet | Cloud |
| Fogstone | Cloud |
| Tranquil Night | Cloud |
| Tranquil Night | Lucent Green |
| Tranquil Night | Liminal Blue |

Do NOT use: Green on White, Blue on White, Green on Violet, Blue on Grey, or any combination not listed above.

### Typography

**Primary font:** RuckSack (custom — must be loaded from assets or @font-face)
**Substitute/web fallback:** Lexend (available on Google Fonts — use this for web implementation unless RuckSack is available as a web font)
**Logo font:** Bouba Round VR Medium (logo only, do not use in UI)

| Role | Font | Weight | Size (pt → px approx) | Line Height |
|------|------|--------|-----------------------|-------------|
| Title | RuckSack | Black | 90pt → ~120px | 108pt → ~144px |
| Subtitle | RuckSack | Bold | 60pt → ~80px | 72pt → ~96px |
| Headings | RuckSack | Demi | 55pt → ~73px | 66pt → ~88px |
| Paragraph | RuckSack | Book | 25pt → ~33px | 30pt → ~40px |
| Fine Copy | RuckSack | Medium | 20pt → ~27px | 25pt → ~33px |

### Design Language

- Rounded shapes only — no sharp edges
- Soft, airy, minimal and uncluttered layouts
- Strong use of negative space
- Calm, muted colour usage — avoid vibrant or harsh contrast
- Micro-interactions should feel gentle and smooth, not snappy or aggressive

---

## Character System

The customizable character is a core MVP feature. SVG assets are fully designed and ready.

**Available customization parts (all SVGs):**
- Hair: masculine styles, feminine styles
- Eyes
- Eyebrows
- Faces (base shapes)
- Mouths
- Noses
- Neck
- Shirt (1 style currently)

**Four named mascot characters exist as references:** Mike, George, Luna, Zoey — rounded, soft illustrated figures in the brand's line-art style (Tranquil Night outlines on Cloud backgrounds).

**Character logic:**
- Character appearance is customized by the user during or after onboarding
- Character visually evolves or unlocks new options as the user makes progress
- Character is the avatar for the AI chatbot feature

**Implementation approach:** Render character as layered SVG components in React. Each body part is a separate SVG layer that can be swapped independently.

---

## Brand Voice (for UX Copy & AI Prompts)

- Always speak in second person ("you", "your")
- Warm, encouraging, empathetic, approachable
- Never use: "must", "should", "you need to", "you failed", "you missed"
- Always use: "whenever you're ready", "at your own pace", "you've made progress", "that's okay"
- Celebrate every small step — no minimum threshold for praise
- Respond to setbacks with reassurance, not redirection to productivity

**Brand pillars (use these to guide copy decisions):**
1. Reflection before action
2. Growth that fits you
3. Progress without pressure

---

## Project Context

- **School:** Southern Alberta Institute of Technology (SAIT)
- **Course:** PROJ 309 — Capstone
- **Presentation date:** April 22, 2026
- **Figma hi-fi designs due:** ~April 21, 2026
- **Team:** Moe (UX — project lead on development), Wing (UX), Sarah (UX), Abby (Graphic Design), Ava (Graphic Design)
- **Instructor:** Jean Patterson

**Moe's role:** UX/Product Designer. Does not write code. Claude Code handles all implementation. Moe provides design direction, Figma node links, and feedback.

**Workflow:**
1. Moe shares a Figma node link or screen description
2. Claude Code reads the design via Figma MCP (`AAIkcs7Qk445QuSRh90T00`)
3. Claude Code implements the component or screen in React
4. Moe reviews and gives feedback
5. Iterate

---

## Project Structure (to be set up)

```
trumi/
├── public/
│   └── assets/
│       ├── character/        # SVG character parts
│       └── fonts/            # RuckSack font files (if available)
├── src/
│   ├── components/
│   │   ├── character/        # Layered SVG character renderer
│   │   ├── goals/            # Goal cards, progress states
│   │   ├── onboarding/       # Survey and value-discovery flow
│   │   ├── checkins/         # Daily/weekly/monthly check-in screens
│   │   ├── reflections/      # Timeline and insights views
│   │   ├── chatbot/          # Character chat interface
│   │   ├── notifications/    # Notification UI and settings
│   │   └── ui/               # Shared primitives (buttons, inputs, cards)
│   ├── styles/
│   │   └── tokens.css        # All design tokens (colours, typography, spacing)
│   ├── services/
│   │   └── gemini.js         # Gemini API integration
│   ├── App.jsx
│   └── main.jsx
├── .env                      # VITE_GEMINI_API_KEY (never commit this)
├── .gitignore                # Must include .env
├── CLAUDE.md                 # This file
└── README.md
```

---

## Important Rules for Claude Code

1. **Never commit `.env` or API keys.** Always use `import.meta.env.VITE_*` for environment variables in Vite.
2. **Always use design tokens** from `tokens.css` — never hardcode hex colours or font sizes.
3. **Check Figma MCP first** before making any UI assumption. The design is the source of truth.
4. **Mobile-first.** All layouts should work on a 390px wide screen before scaling up.
5. **Keep components small and focused.** One component = one responsibility.
6. **Prioritize calm interactions.** Animations should be subtle (200–300ms ease), never jarring.
7. **No Tailwind.** Use CSS custom properties and module-level styles.
8. **RuckSack font:** If not available as a web font, use Lexend from Google Fonts as the substitute. Load it via `@import` in `tokens.css`.
9. **Never use language of pressure or failure** in any UX copy, placeholder text, or AI prompt templates.
10. **The character SVG system** should be built as independently swappable layers — never a single merged image.

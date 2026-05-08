# The Critic - Design Portfolio Roaster

The Critic is an AI-powered application that evaluates design portfolios from three distinct, uncompromising professional perspectives. Built with React, Tailwind CSS, and the Google Gemini API, it provides unapologetic feedback to help designers level up their work.

## Features

- **Automated Content Verification:** Scrapes the provided URL to ensure real content is being evaluated (powered by Jina Reader API).
- **Three-Tiered Analysis:**
  - **The Brutal Roast:** A "Gordon Ramsay" style critique focusing on first impressions and visual clichés.
  - **Senior Lead Audit:** Actionable, no-nonsense feedback focusing on UX friction and technical setup.
  - **The Wise Coach:** Philosophical, empathetic guidance aimed at long-term career positioning and storytelling.
- **Editorial Aesthetic:** A strict, high-contrast visual design inspired by editorial print layouts, utilizing elegant typography (`Playfair Display`, `Inter`, `JetBrains Mono`).
- **Bring Your Own API Key:** Seamless integration with Google AI Studio's API Key selection workflow.

## Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS V4
- **Animations:** Motion (Framer Motion)
- **AI Integration:** `@google/genai` (using `gemini-3.1-pro-preview` with structured JSON output and Google Search grounding)
- **Typography:** Google Fonts (Playfair Display, Inter, JetBrains Mono)
- **Icons:** Lucide React

## Getting Started

1. Set your `GEMINI_API_KEY` in your `.env` file or use the built-in "Set API Key" interface in the app.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Workflow

1. Paste a portfolio URL into the target input.
2. Click **Analyze**.
3. *The Critic* extracts the content and triggers a heuristic evaluation using Gemini.
4. Review the three distinct personas and use their feedback to improve the portfolio!

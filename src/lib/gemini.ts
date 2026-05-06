import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface RoastResponse {
  gordonRamsay: string;
  seniorLead: string;
  wiseCoach: string;
}

export async function generateRoast(url: string): Promise<RoastResponse> {
  let siteContent = '';
  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: { 'Accept': 'text/plain' }
    });
    
    if (res.ok) {
      siteContent = await res.text();
    } else {
      siteContent = "[WARNING: Could not fetch site content. Server returned an error.]";
    }
  } catch (err) {
    siteContent = `[WARNING: Could not fetch content. Error: ${err instanceof Error ? err.message : String(err)}]`;
  }

  const prompt = `You are a world-class Design Critic and Portfolio Strategist. Your goal is to review the portfolio website provided by the user: ${url}.

We have programmatically extracted the markdown content of the site to verify it. Here is the VERIFIED extracted content:
---
${siteContent}
---

CRITICAL INSTRUCTION: Analyze the extracted content above. If the content is empty, indicates an unrendered SPA (like just showing "Lovable Generated Project", "<div id='root'>"), or lacks actual portfolio work, DO NOT hallucinate a critique about typography or projects. Instead, roast them ruthlessly for sending a broken/blank site, having terrible SEO (client-side only rendering), and wasting your time.

If there is real content, provide three distinct "Roast" personas based on the actual text and structure provided. Do not pull punches.

1. THE BRUTALLY HONEST (The "Gordon Ramsay" Roast)
Tone: Harsh, sarcastic, and unforgiving.
Focus: First impressions, visual clichés, and "cringe" factors.
Goal: To point out the flaws that recruiters whisper about but never say to the designer's face.

2. ACTIONABLE & DIRECT (The "Senior Lead" Roast)
Tone: Professional, no-nonsense, and high-efficiency.
Focus: Conversion, UX friction, and technical errors.
Goal: To provide a "to-do list" of immediate fixes that will increase the chance of getting an interview.

3. THE WISE COACH (The "Industry Veteran" Roast)
Tone: Philosophical, empathetic but firm, and long-term focused.
Focus: Storytelling, personal branding, and the "soul" of the work.
Goal: To help the designer understand how to position themselves for a 10-year career, not just a junior role.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          gordonRamsay: { 
            type: Type.STRING, 
            description: "The brutally honest critique formatted in markdown" 
          },
          seniorLead: { 
            type: Type.STRING, 
            description: "The actionable and direct critique formatted in markdown" 
          },
          wiseCoach: { 
            type: Type.STRING, 
            description: "The wise design coach critique formatted in markdown" 
          },
        },
        required: ["gordonRamsay", "seniorLead", "wiseCoach"],
      },
      tools: [{ googleSearch: {} }],
    },
  });

  if (!response.text) {
    throw new Error("Received empty response from the AI model.");
  }

  return JSON.parse(response.text) as RoastResponse;
}

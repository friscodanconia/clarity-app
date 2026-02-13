import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALTITUDE_GUIDANCE: Record<string, string> = {
  'big-picture': 'This was a 30,000-foot strategic question. The answer should stay at the strategic level with frameworks, not dive into tactics.',
  'drill-down': 'This was a tactical drill-down question. The answer should be specific and actionable with concrete steps.',
  'curveball': 'This was a curveball/scenario question. The answer should show quick thinking with a structured response despite the surprise.',
  'defend': 'This was a "defend your position" question. The answer should present a clear thesis with supporting arguments.',
  'simplify': 'This was a "simplify/explain" question. The answer should be accessible to a non-expert without jargon.',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, questionType, transcript } = req.body;
  if (!question || !questionType || !transcript) {
    return res.status(400).json({ error: 'Missing required fields: question, questionType, transcript' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing API key' });
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `You are a communication coach analyzing a spoken response to an unexpected question.

QUESTION: "${question}"
QUESTION TYPE: ${questionType}
${ALTITUDE_GUIDANCE[questionType] || ''}

SPOKEN RESPONSE (transcribed):
"${transcript}"

Analyze this spoken response and return a JSON object with exactly this structure:
{
  "overall": <number 1-10>,
  "dimensions": {
    "structure": { "score": <1-10>, "note": "<one sentence>" },
    "clarity": { "score": <1-10>, "note": "<one sentence>" },
    "conciseness": { "score": <1-10>, "note": "<one sentence>" },
    "altitude": { "score": <1-10>, "note": "<one sentence>" },
    "confidence": { "score": <1-10>, "note": "<one sentence>" }
  },
  "summary": "<2-3 sentence overall assessment>",
  "keyImprovement": "<single most impactful thing to improve, one sentence>",
  "polishedVersion": "<rewrite of their response in 60-90 seconds of speaking time, keeping their ideas but with better structure, clarity, and confidence. Use their voice/style but eliminate filler and add structure.>",
  "fillerWords": [<array of filler phrases detected, e.g. "um", "like", "you know", "so basically", "I think maybe">]
}

Scoring guide:
- Structure: Did they frame/preview before diving in? Is there a clear beginning/middle/end?
- Clarity: Would a listener understand on first hearing? No ambiguity?
- Conciseness: Did they make their point efficiently? No rambling or repetition?
- Altitude: Did they answer at the right level for the question type?
- Confidence: No hedging ("I think maybe"), filler words, or unnecessary qualifiers?

Return ONLY the JSON object, no other text.`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse analysis response' });
    }
    return res.status(200).json(JSON.parse(jsonMatch[0]));
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Analysis failed' });
  }
}

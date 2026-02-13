import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category, domains, difficulty } = req.body;
  if (!category || !domains) {
    return res.status(400).json({ error: 'Missing required fields: category, domains' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing API key' });
  }

  const client = new Anthropic({ apiKey });

  const difficultyGuide = difficulty
    ? `\nDifficulty level: ${difficulty}. ${
        difficulty === 'easy' ? 'Keep the question straightforward and common.' :
        difficulty === 'hard' ? 'Make the question challenging, nuanced, and require deep expertise.' :
        'Make it moderately challenging.'
      }`
    : '';

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Generate a single interview/communication drill question.

Category: ${category}
Relevant domains: ${domains.join(', ')}${difficultyGuide}

Category descriptions:
- big-picture: 30,000-foot strategic thinking questions
- drill-down: Tactical, step-by-step execution questions
- curveball: Unexpected scenario/crisis questions
- defend: "Defend a position" argumentative questions
- simplify: "Explain complex ideas simply" questions

Return ONLY the question text, nothing else. No quotes, no prefix, no explanation.`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return res.status(200).json({ question: text.trim() });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Question generation failed' });
  }
}

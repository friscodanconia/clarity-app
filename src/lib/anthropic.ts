import type { AnalysisResult, QuestionType, Domain, Difficulty } from '../types';

export async function analyzeResponse(
  question: string,
  questionType: QuestionType,
  transcript: string
): Promise<AnalysisResult> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, questionType, transcript }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(err.error || 'Analysis failed');
  }

  return res.json();
}

export async function generateQuestion(
  category: string,
  domains: Domain[],
  difficulty?: Difficulty
): Promise<string> {
  const res = await fetch('/api/generate-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, domains, difficulty }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Generation failed' }));
    throw new Error(err.error || 'Generation failed');
  }

  const data = await res.json();
  return data.question;
}

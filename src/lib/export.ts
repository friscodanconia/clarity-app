import type { Session } from '../types';

export function exportSessionAsText(session: Session): string {
  const lines: string[] = [];
  lines.push(`Clarity — Session Summary`);
  lines.push(`Question: ${session.prompt.text}`);
  lines.push(`Type: ${session.prompt.type}`);
  lines.push(`Date: ${new Date(session.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`);
  lines.push('');

  for (let i = 0; i < session.attempts.length; i++) {
    const a = session.attempts[i];
    lines.push(`--- Attempt ${i + 1} ---`);
    lines.push(`Score: ${a.analysis.overall}/10`);
    lines.push(`Structure: ${a.analysis.dimensions.structure.score} | Clarity: ${a.analysis.dimensions.clarity.score} | Conciseness: ${a.analysis.dimensions.conciseness.score} | Altitude: ${a.analysis.dimensions.altitude.score} | Confidence: ${a.analysis.dimensions.confidence.score}`);
    lines.push(`Summary: ${a.analysis.summary}`);
    lines.push(`Key Improvement: ${a.analysis.keyImprovement}`);
    lines.push(`Transcript: ${a.transcript}`);
    lines.push('');
  }

  return lines.join('\n');
}

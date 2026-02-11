import type { Prompt, Domain } from '../types';

export const ALL_DOMAINS: { id: Domain; label: string }[] = [
  { id: 'marketing', label: 'Marketing' },
  { id: 'ai', label: 'AI & ML' },
  { id: 'product', label: 'Product' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'finance', label: 'Finance' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'design', label: 'Design' },
  { id: 'sales', label: 'Sales' },
  { id: 'operations', label: 'Operations' },
  { id: 'leadership', label: 'Leadership' },
];

export const PROMPTS: Prompt[] = [
  // ── Big Picture ──
  { id: 'bp-1', text: 'Where do you see the marketing industry heading in the next 3 years?', type: 'big-picture', domains: ['marketing', 'strategy'] },
  { id: 'bp-2', text: 'What\'s your take on the future of AI in everyday business operations?', type: 'big-picture', domains: ['ai', 'strategy', 'operations'] },
  { id: 'bp-3', text: 'How should companies think about building vs. buying technology?', type: 'big-picture', domains: ['engineering', 'strategy', 'product'] },
  { id: 'bp-4', text: 'What does the ideal product organization look like in 2026?', type: 'big-picture', domains: ['product', 'leadership'] },
  { id: 'bp-5', text: 'How is the role of the CMO evolving?', type: 'big-picture', domains: ['marketing', 'leadership', 'strategy'] },
  { id: 'bp-6', text: 'What\'s the biggest risk companies face with AI adoption?', type: 'big-picture', domains: ['ai', 'strategy', 'leadership'] },
  { id: 'bp-7', text: 'How should organizations think about data strategy in 2026?', type: 'big-picture', domains: ['ai', 'strategy', 'engineering'] },
  { id: 'bp-8', text: 'What defines a great go-to-market strategy today?', type: 'big-picture', domains: ['marketing', 'sales', 'product'] },
  { id: 'bp-9', text: 'How do you see the relationship between design and business strategy evolving?', type: 'big-picture', domains: ['design', 'strategy'] },
  { id: 'bp-10', text: 'What\'s your view on the future of remote work and its impact on culture?', type: 'big-picture', domains: ['leadership', 'operations'] },
  { id: 'bp-11', text: 'How should companies balance growth and profitability?', type: 'big-picture', domains: ['finance', 'strategy', 'leadership'] },
  { id: 'bp-12', text: 'What\'s the most underrated trend in your industry right now?', type: 'big-picture', domains: ['strategy', 'marketing'] },
  { id: 'bp-13', text: 'How do you think about competitive moats in the age of AI?', type: 'big-picture', domains: ['strategy', 'ai', 'product'] },
  { id: 'bp-14', text: 'What role should finance play in strategic decision-making?', type: 'big-picture', domains: ['finance', 'strategy', 'leadership'] },
  { id: 'bp-15', text: 'How is the sales function being transformed by technology?', type: 'big-picture', domains: ['sales', 'ai', 'strategy'] },

  // ── Drill Down ──
  { id: 'dd-1', text: 'Walk me through how you\'d launch a product in a new market segment.', type: 'drill-down', domains: ['marketing', 'product', 'strategy'] },
  { id: 'dd-2', text: 'How would you evaluate an AI tool before adopting it for your team?', type: 'drill-down', domains: ['ai', 'operations', 'engineering'] },
  { id: 'dd-3', text: 'Describe your process for prioritizing a product roadmap.', type: 'drill-down', domains: ['product', 'strategy', 'engineering'] },
  { id: 'dd-4', text: 'How would you set up a marketing attribution model from scratch?', type: 'drill-down', domains: ['marketing', 'finance'] },
  { id: 'dd-5', text: 'Walk me through how you\'d build a financial model for a new initiative.', type: 'drill-down', domains: ['finance', 'strategy'] },
  { id: 'dd-6', text: 'How would you restructure a sales team that\'s consistently missing targets?', type: 'drill-down', domains: ['sales', 'leadership', 'operations'] },
  { id: 'dd-7', text: 'Describe how you\'d run a design sprint for a critical feature.', type: 'drill-down', domains: ['design', 'product', 'engineering'] },
  { id: 'dd-8', text: 'How would you implement OKRs for a team that\'s never used them?', type: 'drill-down', domains: ['leadership', 'operations'] },
  { id: 'dd-9', text: 'Walk me through your approach to a content marketing strategy.', type: 'drill-down', domains: ['marketing', 'strategy'] },
  { id: 'dd-10', text: 'How would you set up an A/B testing program for a website?', type: 'drill-down', domains: ['marketing', 'product', 'engineering'] },
  { id: 'dd-11', text: 'Describe how you\'d migrate a monolith to microservices.', type: 'drill-down', domains: ['engineering', 'operations'] },
  { id: 'dd-12', text: 'How would you build a customer feedback loop from scratch?', type: 'drill-down', domains: ['product', 'design', 'operations'] },
  { id: 'dd-13', text: 'Walk me through how you\'d negotiate a key partnership deal.', type: 'drill-down', domains: ['sales', 'strategy'] },
  { id: 'dd-14', text: 'How would you reduce customer acquisition cost by 30%?', type: 'drill-down', domains: ['marketing', 'finance', 'sales'] },
  { id: 'dd-15', text: 'Describe your approach to building a design system.', type: 'drill-down', domains: ['design', 'engineering', 'product'] },

  // ── Curveball ──
  { id: 'cb-1', text: 'Your biggest competitor just launched an AI feature that\'s getting rave reviews. What do you do?', type: 'curveball', domains: ['strategy', 'product', 'ai'] },
  { id: 'cb-2', text: 'Your top performer just quit and took two team members. How do you respond?', type: 'curveball', domains: ['leadership', 'operations'] },
  { id: 'cb-3', text: 'The CEO just told you to cut your budget by 40%. What stays and what goes?', type: 'curveball', domains: ['finance', 'strategy', 'leadership'] },
  { id: 'cb-4', text: 'A viral tweet is criticizing your company\'s product. What\'s your playbook?', type: 'curveball', domains: ['marketing', 'leadership'] },
  { id: 'cb-5', text: 'Your product launch date is in 2 weeks and your lead engineer says the core feature isn\'t ready. What do you do?', type: 'curveball', domains: ['product', 'engineering', 'leadership'] },
  { id: 'cb-6', text: 'A major client threatens to leave unless you match a competitor\'s price. How do you handle it?', type: 'curveball', domains: ['sales', 'strategy', 'finance'] },
  { id: 'cb-7', text: 'Your data pipeline breaks during a product demo to investors. What do you say?', type: 'curveball', domains: ['engineering', 'sales', 'leadership'] },
  { id: 'cb-8', text: 'Your team disagrees with the strategy you\'ve set. How do you handle the pushback?', type: 'curveball', domains: ['leadership', 'strategy'] },
  { id: 'cb-9', text: 'Google just released a free version of the product you charge for. What\'s your play?', type: 'curveball', domains: ['strategy', 'product', 'marketing'] },
  { id: 'cb-10', text: 'Your company\'s AI model produced a biased output that\'s in the news. How do you respond?', type: 'curveball', domains: ['ai', 'leadership', 'marketing'] },
  { id: 'cb-11', text: 'The board wants to pivot to a completely different market. How do you evaluate this?', type: 'curveball', domains: ['strategy', 'finance', 'leadership'] },
  { id: 'cb-12', text: 'Your design team and engineering team are in constant conflict. How do you resolve it?', type: 'curveball', domains: ['design', 'engineering', 'leadership'] },
  { id: 'cb-13', text: 'A new regulation just made your primary marketing channel illegal. What now?', type: 'curveball', domains: ['marketing', 'strategy', 'operations'] },
  { id: 'cb-14', text: 'Your sales pipeline is full but close rate has dropped to 5%. What\'s wrong and how do you fix it?', type: 'curveball', domains: ['sales', 'operations'] },
  { id: 'cb-15', text: 'You just discovered your company\'s data has been exposed in a breach. What are your first three moves?', type: 'curveball', domains: ['engineering', 'leadership', 'operations'] },

  // ── Defend a Position ──
  { id: 'dp-1', text: 'Why should we invest in brand marketing over performance marketing?', type: 'defend', domains: ['marketing', 'strategy', 'finance'] },
  { id: 'dp-2', text: 'Make the case for building AI internally rather than using third-party tools.', type: 'defend', domains: ['ai', 'engineering', 'strategy'] },
  { id: 'dp-3', text: 'Why should product managers own pricing decisions?', type: 'defend', domains: ['product', 'finance', 'strategy'] },
  { id: 'dp-4', text: 'Argue for investing in employee development over hiring experienced talent.', type: 'defend', domains: ['leadership', 'operations', 'finance'] },
  { id: 'dp-5', text: 'Why should design have a seat at the executive table?', type: 'defend', domains: ['design', 'leadership', 'strategy'] },
  { id: 'dp-6', text: 'Make the case for a subscription model over one-time purchases.', type: 'defend', domains: ['finance', 'product', 'strategy'] },
  { id: 'dp-7', text: 'Why should sales reps specialize by vertical rather than geography?', type: 'defend', domains: ['sales', 'strategy', 'operations'] },
  { id: 'dp-8', text: 'Argue for prioritizing existing customer expansion over new customer acquisition.', type: 'defend', domains: ['sales', 'marketing', 'finance'] },
  { id: 'dp-9', text: 'Why is technical debt worth addressing now rather than later?', type: 'defend', domains: ['engineering', 'strategy', 'finance'] },
  { id: 'dp-10', text: 'Make the case for a fully remote workforce.', type: 'defend', domains: ['leadership', 'operations'] },
  { id: 'dp-11', text: 'Why should marketing own the customer experience post-sale?', type: 'defend', domains: ['marketing', 'operations', 'product'] },
  { id: 'dp-12', text: 'Argue for hiring generalists over specialists in early-stage companies.', type: 'defend', domains: ['leadership', 'strategy'] },
  { id: 'dp-13', text: 'Why is user research worth the time investment even on tight deadlines?', type: 'defend', domains: ['design', 'product'] },
  { id: 'dp-14', text: 'Make the case for transparency in company financials with all employees.', type: 'defend', domains: ['finance', 'leadership'] },
  { id: 'dp-15', text: 'Why should AI decisions be explainable even if it reduces accuracy?', type: 'defend', domains: ['ai', 'strategy', 'leadership'] },

  // ── Simplify ──
  { id: 'sm-1', text: 'Explain machine learning to a non-technical executive in under 60 seconds.', type: 'simplify', domains: ['ai', 'leadership'] },
  { id: 'sm-2', text: 'How would you explain your company\'s business model to a 12-year-old?', type: 'simplify', domains: ['strategy', 'product'] },
  { id: 'sm-3', text: 'Explain why brand matters to someone who only cares about performance metrics.', type: 'simplify', domains: ['marketing', 'finance'] },
  { id: 'sm-4', text: 'How would you explain product-market fit to someone outside tech?', type: 'simplify', domains: ['product', 'strategy'] },
  { id: 'sm-5', text: 'Explain cloud computing to someone who\'s never used a computer.', type: 'simplify', domains: ['engineering', 'ai'] },
  { id: 'sm-6', text: 'How would you describe the value of design thinking to a finance person?', type: 'simplify', domains: ['design', 'finance'] },
  { id: 'sm-7', text: 'Explain what a sales pipeline is to a creative director.', type: 'simplify', domains: ['sales', 'design'] },
  { id: 'sm-8', text: 'How would you explain unit economics to a designer?', type: 'simplify', domains: ['finance', 'design', 'product'] },
  { id: 'sm-9', text: 'Explain the concept of product strategy to a new engineering hire.', type: 'simplify', domains: ['product', 'engineering'] },
  { id: 'sm-10', text: 'How would you describe your team\'s impact to someone in a completely different department?', type: 'simplify', domains: ['leadership', 'operations'] },
  { id: 'sm-11', text: 'Explain why customer segmentation matters to someone who thinks "everyone is our customer."', type: 'simplify', domains: ['marketing', 'strategy', 'sales'] },
  { id: 'sm-12', text: 'How would you explain API integrations to a marketing team?', type: 'simplify', domains: ['engineering', 'marketing'] },
  { id: 'sm-13', text: 'Explain the difference between strategy and tactics to a junior team member.', type: 'simplify', domains: ['strategy', 'leadership'] },
  { id: 'sm-14', text: 'How would you describe agile methodology to a traditional project manager?', type: 'simplify', domains: ['engineering', 'operations', 'product'] },
  { id: 'sm-15', text: 'Explain generative AI to your parents.', type: 'simplify', domains: ['ai'] },
];

export const QUESTION_TYPE_LABELS: Record<string, { label: string; description: string }> = {
  'big-picture': { label: 'Big Picture', description: '30,000-foot strategic thinking' },
  'drill-down': { label: 'Drill Down', description: 'Tactical, step-by-step execution' },
  'curveball': { label: 'Curveball', description: 'React to unexpected scenarios' },
  'defend': { label: 'Defend a Position', description: 'Build a compelling argument' },
  'simplify': { label: 'Simplify', description: 'Explain complex ideas simply' },
};

export function pickPrompt(domains: Domain[], usedIds: string[], preferredType?: string): Prompt {
  let pool = PROMPTS.filter(p => p.domains.some(d => domains.includes(d)));
  if (preferredType) pool = pool.filter(p => p.type === preferredType);

  const unused = pool.filter(p => !usedIds.includes(p.id));
  const candidates = unused.length > 0 ? unused : pool;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

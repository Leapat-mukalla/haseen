import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Types
type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'; // cheaper/faster for chat
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ---------- Scope policy ----------
const SYSTEM_MESSAGE = `
You are "Hassen", a virtual cybersecurity expert focused EXCLUSIVELY on:
1) Blackmail / sextortion / extortion (online).
2) Data breaches, leaks, privacy, account compromise, doxxing.

SCOPE & REFUSAL POLICY:
- If the user's request is outside these areas, you MUST refuse briefly and offer relevant in-scope help.
- Keep a friendly, supportive tone. Match the user's language (Arabic dialects included) and level.
- Be practical and step-by-step when giving help (e.g., what to do right now if hacked / blackmailed).
- Avoid unnecessary jargon; define terms simply when used.
`.trim();

// ---------- Allowed topic seed (for keywords + embeddings) ----------
const ALLOWED_TOPIC_SEED = [
  // Blackmail / sextortion
  'blackmail online',
  'sextortion',
  'extortion threats online',
  'intimate images threats',
  'ransom request on social media',
  // Data breaches / privacy / account compromise
  'data breach',
  'data leak',
  'privacy protection',
  'account hacked',
  'password leak',
  'phishing',
  'credential stuffing',
  'ransomware',
  'doxxing',
  'two-factor authentication',
  'incident response for breach',
];

// Precompute and cache embeddings in-memory (warm on first request)
let cachedAllowedEmbeddings: number[][] | null = null;

function cosineSim(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function detectArabic(text: string) {
  // crude detection: Arabic Unicode block presence
  return /[\u0600-\u06FF]/.test(text);
}

// Fast keyword screen to avoid extra API calls
function keywordPass(text: string) {
  const t = text.toLowerCase();
  const keywords = [
    'blackmail', 'sextortion', 'extortion', 'threat',
    'data breach', 'breach', 'leak', 'leaked',
    'privacy', 'dox', 'doxx', 'doxxing',
    'hacked', 'hack', 'account compromised',
    'phishing', 'ransomware', 'password', '2fa', 'mfa'
  ];
  return keywords.some(k => t.includes(k));
}

async function ensureAllowedEmbeddings() {
  if (cachedAllowedEmbeddings) return cachedAllowedEmbeddings;
  const resp = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: ALLOWED_TOPIC_SEED,
  });
  cachedAllowedEmbeddings = resp.data.map(d => d.embedding);
  return cachedAllowedEmbeddings!;
}

async function isAllowedTopic(userText: string) {
  // quick allow on obvious keywords
  if (keywordPass(userText)) return true;

  // semantic gate via embeddings
  const [allowed] = await Promise.all([
    ensureAllowedEmbeddings(),
  ]);

  const userEmb = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: userText,
  });
  const u = userEmb.data[0].embedding;

  let best = -1;
  for (const e of allowed) {
    const sim = cosineSim(u, e);
    if (sim > best) best = sim;
  }

  // Tune this threshold; ~0.78–0.82 is a sensible starting range.
  const SIM_THRESHOLD = 0.80;
  return best >= SIM_THRESHOLD;
}

function refusalMessage(userText: string) {
  const ar = detectArabic(userText);
  if (ar) {
    return 'أفهم سؤالك، لكن دوري يقتصر على قضايا الابتزاز الإلكتروني، التسريب/اختراق البيانات، الخصوصية، وحماية الحسابات. إذا تحب، اسألني عن:\n• ما الذي أفعله إذا تعرضت لابتزاز أو تهديد بنشر صور؟\n• كيف أتأكد إن كانت بياناتي مسرّبة وما الخطوات العاجلة؟\n• كيفية تأمين الحسابات (كلمات مرور، 2FA) وخطة استجابة للح incidents.';
  }
  return 'I get your question, but I’m limited to blackmail/sextortion and data-breach/privacy topics. If you’d like, ask me about:\n• What to do if you’re being blackmailed or threatened with intimate images\n• How to check if your data was leaked and immediate steps to take\n• Securing accounts (passwords, 2FA) and incident response basics';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (
      !Array.isArray(messages) ||
      !messages.every(m => m && typeof m.role === 'string' && typeof m.content === 'string')
    ) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Use the latest user message for gating
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    const lastUserText = lastUser?.content ?? '';

    // Server-side scope enforcement
    const allowed = await isAllowedTopic(lastUserText);
    if (!allowed) {
      // refuse gracefully without calling the chat model
      return NextResponse.json({ content: refusalMessage(lastUserText) });
    }

    // In-scope: call the chat model
    const conversationWithSystem: ChatMessage[] = [
      { role: 'system', content: SYSTEM_MESSAGE },
      ...messages,
    ];

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: conversationWithSystem,
      temperature: 0.2,
      max_tokens: 800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return NextResponse.json({
      content: completion.choices[0]?.message?.content ?? '',
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      { error: 'Failed to process chat request', details: isDev ? String(error) : undefined },
      { status: 500 }
    );
  }
}

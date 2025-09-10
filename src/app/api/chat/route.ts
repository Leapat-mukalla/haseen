import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4';
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });


const SYSTEM_MESSAGE = `
أنت "حَصين" خبير افتراضي في الأمن الرقمي ومقتصر على ثلاثة مجالات فقط:
1) الابتزاز الإلكتروني (sextortion/extortion).
2) تسرّب/خرق البيانات.
3) حماية البيانات (سياسات الحماية، الممارسات الآمنة، تقليل المخاطر).

سياسة النطاق والرفض:
- إذا خرج سؤال المستخدم عن هذه المجالات الثلاثة، ارفض باختصار وبأسلوب لطيف، واقترح عليه أن يسأل ضمن النطاق.
- طابق لغة المستخدم (فصحى/عامية عربية أو إنجليزي).
- عندما تكون الإجابة ضمن النطاق: قدّم خطوات عملية ومباشرة، وابتعد عن المصطلحات المعقّدة قدر الإمكان.
`.trim();

const ALLOWED_TOPIC_SEED = [
  'الابتزاز الإلكتروني',
  'ابتزاز عبر الإنترنت',
  'sextortion',
  'online blackmail',
  'تهديد بنشر صور',
  'تهديدات مقابل مال',

  'تسرّب البيانات',
  'data leak',
  'data breach',
  'خرق البيانات',
  'اختراق قواعد البيانات',
  'تسريب كلمات المرور',

  'حماية البيانات',
  'data protection',
  'information security',
  'تشفير البيانات',
  'سياسات حماية البيانات',
  'تقليل المخاطر',
  'data minimization',
  'access control',
];

// ===== Utilities =====
function cosineSim(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function sanitizeIncomingMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter(
      (m) =>
        m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
    )
    .map((m) => ({ role: m.role, content: m.content }));
}

function detectArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

function keywordPass(text: string) {
  const t = text.toLowerCase();

  const ar = [
    'ابتزاز', 'ابتزاز إلكتروني', 'تهديد', 'تهديد بنشر',
    'تسرب بيانات', 'تسرّب بيانات', 'خرق بيانات', 'اختراق بيانات',
    'تسريب', 'تسريب معلومات',
    'حماية البيانات', 'أمن المعلومات', 'حماية الخصوصية', 'تأمين البيانات',
    'تشفير', 'سياسة خصوصية'
  ];

  const en = [
    'blackmail', 'sextortion', 'extortion',
    'data breach', 'data leak', 'breach', 'leaked',
    'data protection', 'privacy protection', 'information security',
    'encrypt', 'encryption', 'dpa', 'gdpr'
  ];

  return [...ar, ...en].some(k => t.includes(k.toLowerCase()));
}

const SIM_THRESHOLD = 0.80; 

function refusalMessage(userText: string) {
  const ar = detectArabic(userText);
  if (ar) {
    return 'أفهم سؤالك، لكنّي مقتصر فقط على: الابتزاز الإلكتروني، تسرّب/خرق البيانات، وحماية البيانات. من فضلك اسأل ضمن هذه المواضيع. أمثلة:\n• ماذا أفعل إذا تم ابتزازي عبر الإنترنت؟\n• كيف أتأكد إن كانت بياناتي تسرّبت؟ وما الخطوات العاجلة؟\n• أفضل ممارسات حماية البيانات (كلمات مرور قوية، 2FA، تشفير، سياسات وصول).';
  }
  return 'I can only help with: online blackmail/sextortion, data leaks/breaches, and data protection. Please ask within these topics.';
}

let cachedAllowedEmbeddings: number[][] | null = null;

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
  if (keywordPass(userText)) return true;

  const allowed = await ensureAllowedEmbeddings();
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

  return best >= SIM_THRESHOLD;
}

// ===== Route =====
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: ChatMessage[] };

    // Validate input
    if (
      !Array.isArray(messages) ||
      !messages.every(m => m && typeof m.role === 'string' && typeof m.content === 'string')
    ) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const sanitizedMessages = sanitizeIncomingMessages(messages);

    const lastUser = [...sanitizedMessages].reverse().find(m => m.role === 'user');
    const lastUserText = lastUser?.content ?? '';

    const allowed = await isAllowedTopic(lastUserText);
    if (!allowed) {
      return NextResponse.json({ content: refusalMessage(lastUserText) });
    }

    const conversationWithSystem: ChatMessage[] = [
      { role: 'system', content: SYSTEM_MESSAGE },
      ...sanitizedMessages,
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

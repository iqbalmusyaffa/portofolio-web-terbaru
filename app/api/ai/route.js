import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security';

export async function POST(request) {
  try {
    // 1. Verify authentication (AI features are admin-gated to protect quota)
    const auth = requireAdminAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response, { status: 401 });
    }

    const { action = 'translate', text = '', targetLang = 'en', prompt = '', type = 'general' } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY belum dikonfigurasi di file .env. Dapatkan API key gratis di https://aistudio.google.com dan masukkan ke file .env (GEMINI_API_KEY=your_key) untuk mengaktifkan AI Google Gemini.'
      }, { status: 400 });
    }

    let systemInstruction = '';
    let userPrompt = '';

    if (action === 'translate') {
      const langName = targetLang === 'en' ? 'English' : 'Bahasa Indonesia';
      const fromLang = targetLang === 'en' ? 'Bahasa Indonesia' : 'English';

      systemInstruction = `You are a professional software engineer translator. Translate technical text from ${fromLang} into natural, polished, high-impact professional ${langName} suitable for a top-tier software engineering portfolio. Keep technical terms, framework names (like Next.js, React, Node.js, Laravel, MySQL), architecture patterns, and programming jargon accurate. Do NOT add extra conversational commentary, quotes, or markdown wrappers. Return ONLY the translated text.`;
      userPrompt = text;
    } else if (action === 'polish') {
      systemInstruction = `You are a senior tech lead and career coach. Polish and rewrite the following ${type} description for a Software Engineer portfolio so it sounds confident, impactful, clean, and professional. Highlight concrete technical achievements, clean code standards, and value delivered. Return ONLY the polished text without meta comments.`;
      userPrompt = text;
    } else if (action === 'generate') {
      systemInstruction = `You are an AI assistant specialized in Software Engineering portfolio content creation. Generate high-quality, professional, realistic developer text based on the user's request. Keep it concise, authentic, and free of generic AI clichés.`;
      userPrompt = prompt || text;
    }

    // Call Google Gemini 1.5 Flash API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nTask:\n${userPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || 'Gagal memanggil Google Gemini API';
      return NextResponse.json({ success: false, error: errorMsg }, { status: response.status });
    }

    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) {
      return NextResponse.json({ success: false, error: 'Tidak ada respons dari Gemini AI' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      result: candidate.trim()
    });
  } catch (err) {
    console.error('[GEMINI API ERROR]', err);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan internal pada layanan AI' }, { status: 500 });
  }
}

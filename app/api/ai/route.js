import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security';

export const dynamic = 'force-dynamic';

const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

export async function POST(request) {
  try {
    // 1. Verify authentication (AI features are admin-gated to protect quota)
    const auth = requireAdminAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({
        success: false,
        isAuthError: true,
        error: 'Sesi login admin Anda telah kedaluwarsa. Silakan refresh atau login ulang di Admin Panel untuk melanjutkan terjemahan AI.'
      }, { status: 401 });
    }

    const { action = 'translate', text = '', targetLang = 'en', prompt = '', type = 'general' } = await request.json();

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY belum dikonfigurasi di file .env. Masukkan API key Google Gemini Anda ke file .env.'
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
      systemInstruction = `You are a senior tech lead and career coach. Polish and rewrite the following ${type} description for a Software Engineer portfolio so it sounds confident, impactful, clean, and professional. Highlight concrete technical achievements, clean code standards, and value delivered. Return ONLY the polished text without meta comments or quotes.`;
      userPrompt = text;
    } else if (action === 'generate') {
      systemInstruction = `You are an AI assistant specialized in Software Engineering portfolio content creation. Generate high-quality, professional, realistic developer text based on the user's request. Keep it concise, authentic, and free of generic AI clichés.`;
      userPrompt = prompt || text;
    }

    // Attempt generation across available models with fallback
    let lastError = null;
    let candidateText = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
                temperature: 0.2,
                maxOutputTokens: 1024
              }
            })
          }
        );

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          candidateText = data.candidates[0].content.parts[0].text;
          break; // Succeeded!
        } else {
          lastError = data.error?.message || `Gagal dengan model ${model} (status: ${response.status})`;
        }
      } catch (callErr) {
        lastError = callErr.message;
      }
    }

    if (!candidateText) {
      return NextResponse.json({
        success: false,
        error: lastError || 'Gagal memproses dengan Google Gemini API. Pastikan API key aktif.'
      }, { status: 500 });
    }

    // Clean any leading/trailing surrounding quotes if the model wrapped it
    let cleanedResult = candidateText.trim();
    if (cleanedResult.startsWith('"') && cleanedResult.endsWith('"') && cleanedResult.length > 2) {
      cleanedResult = cleanedResult.slice(1, -1).trim();
    }

    return NextResponse.json({
      success: true,
      result: cleanedResult
    });
  } catch (err) {
    console.error('[GEMINI API ERROR]', err);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan internal pada layanan AI' }, { status: 500 });
  }
}

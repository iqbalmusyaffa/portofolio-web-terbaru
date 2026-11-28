import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security';

export const dynamic = 'force-dynamic';

const GEMINI_CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

const SUMOPOD_CANDIDATE_MODELS = [
  process.env.SUMOPOD_MODEL || 'deepseek-flash',
  'deepseek-flash',
  'deepseek-v4-flash',
  'deepseek-v4.1-flash-1017',
  'glm-5.3-flash'
];

async function callGoogleGemini({ systemInstruction, userPrompt, apiKey }) {
  let lastError = null;

  for (const model of GEMINI_CANDIDATE_MODELS) {
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
              maxOutputTokens: 2048
            }
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return {
          text: data.candidates[0].content.parts[0].text,
          model: `Google Gemini (${model})`
        };
      } else {
        lastError = data.error?.message || `Status ${response.status} pada ${model}`;
        // If rate limit (429) or quota exceeded, break early to try SumoPod fallback faster
        if (response.status === 429 || lastError.toLowerCase().includes('quota') || lastError.toLowerCase().includes('rate')) {
          break;
        }
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(lastError || 'Semua model Google Gemini tidak merespons.');
}

async function callSumoPod({ systemInstruction, userPrompt, apiKey }) {
  const rawBaseUrl = process.env.SUMOPOD_BASE_URL || 'https://ai.sumopod.com/v1';
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const endpoint = baseUrl.endsWith('/chat/completions') ? baseUrl : `${baseUrl}/chat/completions`;

  let lastError = null;

  // Filter unique candidate models
  const modelsToTry = Array.from(new Set(SUMOPOD_CANDIDATE_MODELS.filter(Boolean)));

  for (const model of modelsToTry) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          max_tokens: 2048
        })
      });

      const data = await response.json();

      if (response.ok && data.choices?.[0]?.message?.content) {
        return {
          text: data.choices[0].message.content,
          model: `SumoPod AI (${model})`
        };
      } else {
        lastError = data.error?.message || data.message || `Status ${response.status} pada SumoPod model ${model}`;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(lastError || 'Gagal memanggil SumoPod AI endpoint.');
}

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

    const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
    const sumopodKey = (process.env.SUMOPOD_API_KEY || '').trim();

    const hasGemini = geminiKey && geminiKey !== 'your_gemini_api_key_here';
    const hasSumopod = sumopodKey && sumopodKey !== 'your_sumopod_api_key_here';

    if (!hasGemini && !hasSumopod) {
      return NextResponse.json({
        success: false,
        error: 'Konfigurasi AI belum lengkap. Masukkan GEMINI_API_KEY atau SUMOPOD_API_KEY di file .env.'
      }, { status: 400 });
    }

    // Prepare system instruction and prompt based on action
    let systemInstruction = '';
    let userPrompt = '';

    if (action === 'translate') {
      const langName = targetLang === 'en' ? 'English' : 'Bahasa Indonesia';
      const fromLang = targetLang === 'en' ? 'Bahasa Indonesia' : 'English';

      systemInstruction = `You are a professional software engineer translator. Translate technical text from ${fromLang} into natural, polished, high-impact professional ${langName} suitable for a top-tier software engineering portfolio. Keep technical terms, framework names (like Next.js, React, Node.js, Laravel, MySQL, Docker), architecture patterns, and programming jargon accurate. Do NOT add extra conversational commentary, quotes, or markdown wrappers. Return ONLY the translated text.`;
      userPrompt = text;
    } else if (action === 'polish') {
      systemInstruction = `You are a senior tech lead and career coach. Polish and rewrite the following ${type} description for a Software Engineer portfolio so it sounds confident, impactful, clean, and professional. Highlight concrete technical achievements, clean code standards, and value delivered. Return ONLY the polished text without meta comments or quotes.`;
      userPrompt = text;
    } else if (action === 'generate') {
      systemInstruction = `You are an AI assistant specialized in Software Engineering portfolio content creation. Generate high-quality, professional, realistic developer text based on the user's request. Keep it concise, authentic, and free of generic AI clichés.`;
      userPrompt = prompt || text;
    }

    let generatedText = null;
    let providerUsed = '';
    let geminiError = null;

    // STEP 1: Attempt Primary Provider (Google Gemini)
    if (hasGemini) {
      try {
        const geminiResult = await callGoogleGemini({
          systemInstruction,
          userPrompt,
          apiKey: geminiKey
        });
        generatedText = geminiResult.text;
        providerUsed = geminiResult.model;
      } catch (err) {
        geminiError = err.message;
        console.warn('[AI] Google Gemini gagal, beralih ke SumoPod AI fallback:', geminiError);
      }
    }

    // STEP 2: Auto-Fallback to Secondary Provider (SumoPod AI)
    if (!generatedText && hasSumopod) {
      try {
        const sumopodResult = await callSumoPod({
          systemInstruction,
          userPrompt,
          apiKey: sumopodKey
        });
        generatedText = sumopodResult.text;
        providerUsed = sumopodResult.model;
      } catch (sumoErr) {
        console.error('[AI] SumoPod AI fallback juga gagal:', sumoErr.message);
        return NextResponse.json({
          success: false,
          error: `Gagal memproses AI. Gemini: ${geminiError || 'Tidak aktif'} | SumoPod: ${sumoErr.message}`
        }, { status: 500 });
      }
    }

    // If both failed or unavailable
    if (!generatedText) {
      return NextResponse.json({
        success: false,
        error: geminiError || 'Gagal memproses teks dengan penyedia AI yang tersedia.'
      }, { status: 500 });
    }

    // Clean quotation wrapping if present
    let cleanedResult = generatedText.trim();
    if (cleanedResult.startsWith('"') && cleanedResult.endsWith('"') && cleanedResult.length > 2) {
      cleanedResult = cleanedResult.slice(1, -1).trim();
    }

    return NextResponse.json({
      success: true,
      result: cleanedResult,
      provider: providerUsed
    });
  } catch (err) {
    console.error('[HYBRID AI API ERROR]', err);
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan internal pada layanan AI: ' + err.message
    }, { status: 500 });
  }
}

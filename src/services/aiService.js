import { api } from './api';
import { smartDemoAnalyse } from '../utils/smartDemoAnalysis';

const HF_MODEL = import.meta.env.VITE_HF_MODEL || 'facebook/deit-base-distilled-patch16-224';
const HF_TOKEN = import.meta.env.VITE_HF_API_TOKEN;
const isValidToken = HF_TOKEN && HF_TOKEN !== 'your_huggingface_token' && HF_TOKEN.startsWith('hf_');

/** Return base64-encoded data URL for a File/blob. */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Analyse a plant-image file.
 * Tries Hugging Face Inference API when a token is present,
 * otherwise falls back to client-side demo colour analysis.
 * @param {File} file
 * @returns {Promise<{ label: string, confidence: number, source: 'huggingface'|'demo' }>}
 */
export async function analyzeImage(file) {
  if (!isValidToken) {
    console.warn('[aiService] VITE_HF_API_TOKEN not set — using client-side demo analysis.');
    return smartDemoAnalyse(file);
  }

  const base64 = await toBase64(file);
  // Strip data URL prefix so API accepts it cleanly
  const body = base64.split(',')[1];

  try {
    const data = await api.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      { inputs: body },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Hugging Face returns an array of [{ label, score }]
    const top = data[0];
    const label = top.label ?? 'Unknown';
    const confidence = top.score ?? 0;

    return { label, confidence, source: 'huggingface' };
  } catch (err) {
    console.warn('[aiService] Hugging Face inference failed, using demo fallback:', err.message);
    return smartDemoAnalyse(file);
  }
}

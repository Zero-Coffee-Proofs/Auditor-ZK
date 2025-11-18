export const TOKENIZER_SESSION_KEY = 'tokenizerSession';

export interface TokenizerSessionData {
  accessToken: string;
  assetName: string;
  assetValue: string;
  tokenSupply: string;
  description: string;
  target: string;
  createdAt: string;
}

export function saveTokenizerSession(data: TokenizerSessionData) {
  try {
    sessionStorage.setItem(TOKENIZER_SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to persist tokenizer session', error);
  }
}

export function loadTokenizerSession(): TokenizerSessionData | null {
  try {
    const raw = sessionStorage.getItem(TOKENIZER_SESSION_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as TokenizerSessionData;
  } catch (error) {
    console.error('Failed to load tokenizer session', error);
    return null;
  }
}

export function clearTokenizerSession() {
  try {
    sessionStorage.removeItem(TOKENIZER_SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear tokenizer session', error);
  }
}

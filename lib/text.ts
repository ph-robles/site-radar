// Normaliza sigla: tira acento, símbolos e deixa UPPERCASE
export function normalizarSigla(s: string) {
  if (!s) return '';
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase();
}

// Levenshtein simples
export function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  const al = a.length, bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const dp = Array.from({ length: al + 1 }, () => Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) dp[i][0] = i;
  for (let j = 0; j <= bl; j++) dp[0][j] = j;

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[al][bl];
}

export function formatCoord(x: number | null | undefined) {
  if (x === null || x === undefined || Number.isNaN(x)) return '—';
  return Number(x).toFixed(6);
}

// Interpreta "capacitado" vindo como texto
const YES = new Set(['sim','s','yes','y','1','true','verdadeiro','ok','ativo','habilitado','cap','capacitado','sim/ativo','sim/ok']);
export function isYes(val: unknown) {
  try {
    return YES.has(String(val ?? '').trim().toLowerCase());
  } catch {
    return false;
  }
}
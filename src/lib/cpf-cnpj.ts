// ─── CPF ─────────────────────────────────────────────────────────────────────

function calcCpfDigit(digits: number[], startWeight: number): number {
  const sum = digits.reduce((acc, d, i) => acc + d * (startWeight - i), 0);
  const rem = sum % 11;
  return rem < 2 ? 0 : 11 - rem;
}

export function generateCpf(): string {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const d1 = calcCpfDigit(digits, 10);
  const d2 = calcCpfDigit([...digits, d1], 11);
  return [...digits, d1, d2].join("");
}

export function formatCpf(cpf: string): string {
  const c = cpf.replace(/\D/g, "");
  return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9, 11)}`;
}

export function validateCpf(raw: string): boolean {
  const cpf = raw.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digits = cpf.split("").map(Number);
  const d1 = calcCpfDigit(digits.slice(0, 9), 10);
  const d2 = calcCpfDigit(digits.slice(0, 10), 11);
  return digits[9] === d1 && digits[10] === d2;
}

// ─── CNPJ ────────────────────────────────────────────────────────────────────
// Unified algorithm: charCode - 48 encoding (works for both numeric and alphanumeric)
// '0'→0, '1'→1, ..., '9'→9, 'A'→17, 'B'→18, ..., 'Z'→42
// Verified against official first alphanumeric CNPJ: 00.000.000/E08G-12

function charValue(c: string): number {
  return c.toUpperCase().charCodeAt(0) - 48;
}

function calcCnpjDigit(chars: string[], weights: number[]): number {
  const sum = chars.reduce((acc, c, i) => acc + charValue(c) * weights[i], 0);
  const rem = sum % 11;
  return rem < 2 ? 0 : 11 - rem;
}

const W1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const W2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

export function generateNumericCnpj(): string {
  const base = [
    ...Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 10))),
    "0", "0", "0", "1",
  ];
  const d1 = calcCnpjDigit(base, W1);
  const d2 = calcCnpjDigit([...base, String(d1)], W2);
  return [...base, String(d1), String(d2)].join("");
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPHANUM_CHARS = LETTERS + "0123456789";

function randomAlphanum(): string {
  return ALPHANUM_CHARS[Math.floor(Math.random() * ALPHANUM_CHARS.length)];
}

function ensureAtLeastOneLetter(chars: string[]): string[] {
  const result = [...chars];
  if (!/[A-Z]/.test(result.join(""))) {
    const pos = Math.floor(Math.random() * result.length);
    result[pos] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  }
  return result;
}

// Numeric root (positions 0–7) + alphanumeric branch (positions 8–11)
// Mirrors what existing companies get when issued new branch numbers
export function generateAlphanumericCnpj(): string {
  const branchChars = ensureAtLeastOneLetter(
    Array.from({ length: 4 }, randomAlphanum)
  );
  const base: string[] = [
    ...Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 10))),
    ...branchChars,
  ];
  const d1 = calcCnpjDigit(base, W1);
  const d2 = calcCnpjDigit([...base, String(d1)], W2);
  return [...base, String(d1), String(d2)].join("");
}

// Fully alphanumeric — all 12 base positions can contain letters or digits
// Matches the spec for new root assignments (e.g. 12.ABC.345/01DE-35)
export function generateFullAlphanumericCnpj(): string {
  const base = ensureAtLeastOneLetter(
    Array.from({ length: 12 }, randomAlphanum)
  );
  const d1 = calcCnpjDigit(base, W1);
  const d2 = calcCnpjDigit([...base, String(d1)], W2);
  return [...base, String(d1), String(d2)].join("");
}

export type CnpjType = "numeric" | "alphanumeric";

export interface CnpjValidationResult {
  valid: boolean;
  type: CnpjType;
  reason?: string;
}

export function validateCnpjFull(raw: string): CnpjValidationResult {
  const cleaned = raw.replace(/[.\-/\s]/g, "").toUpperCase();

  if (cleaned.length !== 14) {
    return { valid: false, type: "numeric", reason: "length" };
  }

  const base = cleaned.slice(0, 12);
  const checkStr = cleaned.slice(12);

  if (!/^[0-9A-Z]{12}$/.test(base)) {
    return { valid: false, type: "numeric", reason: "invalid_chars" };
  }

  if (!/^\d{2}$/.test(checkStr)) {
    return { valid: false, type: "numeric", reason: "check_not_numeric" };
  }

  const type: CnpjType = /[A-Z]/.test(base) ? "alphanumeric" : "numeric";

  if (/^(.)\1{13}$/.test(cleaned)) {
    return { valid: false, type, reason: "all_same" };
  }

  const baseChars = base.split("");
  const d1 = calcCnpjDigit(baseChars, W1);
  const d2 = calcCnpjDigit([...baseChars, String(d1)], W2);

  if (parseInt(checkStr[0]) !== d1 || parseInt(checkStr[1]) !== d2) {
    return { valid: false, type, reason: "invalid_check_digits" };
  }

  return { valid: true, type };
}

export function validateCnpj(raw: string): boolean {
  return validateCnpjFull(raw).valid;
}

export function formatCnpj(cnpj: string): string {
  const c = cnpj.replace(/[.\-/\s]/g, "").toUpperCase();
  return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12, 14)}`;
}

export function detectDocumentType(
  raw: string
): "cpf" | "cnpj_numeric" | "cnpj_alphanumeric" | "unknown" {
  const cleaned = raw.replace(/[.\-/\s]/g, "").toUpperCase();
  if (cleaned.length === 11 && /^\d{11}$/.test(cleaned)) return "cpf";
  if (cleaned.length === 14 && /^\d{14}$/.test(cleaned)) return "cnpj_numeric";
  if (cleaned.length === 14 && /^[0-9A-Z]{12}\d{2}$/.test(cleaned)) return "cnpj_alphanumeric";
  return "unknown";
}

import { describe, it, expect } from "vitest";
import {
  validateCpf,
  generateCpf,
  formatCpf,
  validateCnpj,
  validateCnpjFull,
  generateNumericCnpj,
  generateAlphanumericCnpj,
  formatCnpj,
  detectDocumentType,
} from "./cpf-cnpj";

// ─── CPF ─────────────────────────────────────────────────────────────────────

describe("CPF", () => {
  it("validates a known good CPF", () => {
    expect(validateCpf("529.982.247-25")).toBe(true);
  });

  it("validates unformatted CPF", () => {
    expect(validateCpf("52998224725")).toBe(true);
  });

  it("rejects invalid check digits", () => {
    expect(validateCpf("529.982.247-26")).toBe(false);
  });

  it("rejects all-same CPFs", () => {
    expect(validateCpf("111.111.111-11")).toBe(false);
    expect(validateCpf("00000000000")).toBe(false);
  });

  it("rejects wrong length", () => {
    expect(validateCpf("1234")).toBe(false);
  });

  it("generates valid CPFs", () => {
    for (let i = 0; i < 20; i++) {
      expect(validateCpf(generateCpf())).toBe(true);
    }
  });

  it("formats CPF correctly", () => {
    expect(formatCpf("52998224725")).toBe("529.982.247-25");
  });
});

// ─── CNPJ Numeric ────────────────────────────────────────────────────────────

describe("CNPJ numeric", () => {
  it("validates a known good numeric CNPJ", () => {
    expect(validateCnpj("11.222.333/0001-81")).toBe(true);
  });

  it("validates unformatted numeric CNPJ", () => {
    expect(validateCnpj("11222333000181")).toBe(true);
  });

  it("rejects wrong check digits", () => {
    expect(validateCnpj("11.222.333/0001-82")).toBe(false);
  });

  it("rejects all-same CNPJs", () => {
    expect(validateCnpj("11111111111111")).toBe(false);
  });

  it("generates valid numeric CNPJs", () => {
    for (let i = 0; i < 20; i++) {
      const cnpj = generateNumericCnpj();
      expect(validateCnpj(cnpj)).toBe(true);
      expect(validateCnpjFull(cnpj).type).toBe("numeric");
    }
  });

  it("detects numeric CNPJ type", () => {
    expect(detectDocumentType("11222333000181")).toBe("cnpj_numeric");
  });
});

// ─── CNPJ Alphanumeric ───────────────────────────────────────────────────────

describe("CNPJ alphanumeric", () => {
  // Official first alphanumeric CNPJ issued by Receita Federal on 2026-07-31
  it("validates official example 00.000.000/E08G-12", () => {
    expect(validateCnpj("00.000.000/E08G-12")).toBe(true);
  });

  it("validates unformatted official example", () => {
    expect(validateCnpj("00000000E08G12")).toBe(true);
  });

  it("returns type=alphanumeric for official example", () => {
    const result = validateCnpjFull("00.000.000/E08G-12");
    expect(result.valid).toBe(true);
    expect(result.type).toBe("alphanumeric");
  });

  it("rejects wrong check digits on alphanumeric CNPJ", () => {
    expect(validateCnpj("00.000.000/E08G-13")).toBe(false);
  });

  it("generates valid alphanumeric CNPJs", () => {
    for (let i = 0; i < 20; i++) {
      const cnpj = generateAlphanumericCnpj();
      expect(validateCnpj(cnpj)).toBe(true);
    }
  });

  it("detects alphanumeric CNPJ type", () => {
    expect(detectDocumentType("00000000E08G12")).toBe("cnpj_alphanumeric");
  });

  it("is case-insensitive", () => {
    expect(validateCnpj("00.000.000/e08g-12")).toBe(true);
  });
});

// ─── charValue math verification ─────────────────────────────────────────────

describe("charValue encoding", () => {
  it("E encodes to 21", () => {
    // 'E'.charCodeAt(0) = 69; 69 - 48 = 21
    expect("E".charCodeAt(0) - 48).toBe(21);
  });

  it("G encodes to 23", () => {
    expect("G".charCodeAt(0) - 48).toBe(23);
  });

  it("digit 0 encodes to 0", () => {
    expect("0".charCodeAt(0) - 48).toBe(0);
  });

  it("digit 8 encodes to 8", () => {
    expect("8".charCodeAt(0) - 48).toBe(8);
  });
});

// ─── Format ──────────────────────────────────────────────────────────────────

describe("formatCnpj", () => {
  it("formats numeric CNPJ", () => {
    expect(formatCnpj("11222333000181")).toBe("11.222.333/0001-81");
  });

  it("formats alphanumeric CNPJ", () => {
    expect(formatCnpj("00000000E08G12")).toBe("00.000.000/E08G-12");
  });
});

// ─── detectDocumentType ───────────────────────────────────────────────────────

describe("detectDocumentType", () => {
  it("detects CPF", () => {
    expect(detectDocumentType("52998224725")).toBe("cpf");
    expect(detectDocumentType("529.982.247-25")).toBe("cpf");
  });

  it("returns unknown for garbage", () => {
    expect(detectDocumentType("123")).toBe("unknown");
    expect(detectDocumentType("hello")).toBe("unknown");
  });
});

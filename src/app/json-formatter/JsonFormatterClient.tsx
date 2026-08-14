"use client";

import { useCallback } from "react";
import FormatterTool from "@/components/FormatterTool";

const EXAMPLE = `{
  "user": {
    "id": 1,
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "active": true,
    "roles": ["admin", "developer"],
    "address": {
      "city": "London",
      "country": "UK"
    }
  },
  "createdAt": "2024-01-15T10:30:00Z"
}`;

function parseJsonError(error: unknown, input: string): { message: string; line?: number; column?: number } {
  const msg = String(error);

  const modern = msg.match(/at line (\d+) column (\d+)/);
  if (modern) {
    return { message: msg.replace(/^SyntaxError: /, ""), line: Number(modern[1]), column: Number(modern[2]) };
  }

  const legacy = msg.match(/at position (\d+)/);
  if (legacy) {
    const pos = Number(legacy[1]);
    const before = input.slice(0, pos);
    const line = before.split("\n").length;
    const column = pos - before.lastIndexOf("\n");
    return { message: msg.replace(/^SyntaxError: /, ""), line, column };
  }

  return { message: msg.replace(/^SyntaxError: /, "") };
}

export default function JsonFormatterClient() {
  const format = useCallback((input: string) => {
    try {
      const parsed = JSON.parse(input);
      return { output: JSON.stringify(parsed, null, 2) };
    } catch (e) {
      const { message, line, column } = parseJsonError(e, input);
      return { output: "", error: message, errorLine: line, errorColumn: column };
    }
  }, []);

  const minify = useCallback((input: string) => {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  }, []);

  return (
    <FormatterTool
      mode="json"
      format={format}
      minify={minify}
      example={EXAMPLE}
      placeholder={'{\n  "name": "devbox",\n  "version": "1.0.0"\n}'}
    />
  );
}

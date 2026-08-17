import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

const tools = [
  "JSON Formatter",
  "Regex Tester",
  "CPF / CNPJ",
  "YAML Validator",
  "Text Diff",
  "Encoder / Decoder",
];

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        background: "#0c0c14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        gap: 0,
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "#4f46e5",
          display: "flex",
        }}
      />

      {/* Logo row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          marginBottom: 28,
        }}
      >
        {/* Icon box */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 20,
            background: "#4f46e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 38,
              fontWeight: 700,
              color: "white",
              letterSpacing: -1,
            }}
          >
            &gt;_
          </span>
        </div>

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            DevBox
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#818cf8",
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            .tools
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: 28,
          color: "#71717a",
          margin: 0,
          marginBottom: 52,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Ferramentas online gratuitas para devs e QA — tudo roda no navegador
      </p>

      {/* Tool chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          justifyContent: "center",
          maxWidth: 920,
        }}
      >
        {tools.map((tool) => (
          <div
            key={tool}
            style={{
              padding: "12px 26px",
              borderRadius: 100,
              background: "#18181f",
              border: "1px solid #2e2e42",
              color: "#a5b4fc",
              fontSize: 21,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {tool}
          </div>
        ))}
      </div>

      {/* Bottom URL */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          right: 52,
          color: "#3f3f5a",
          fontSize: 18,
          fontWeight: 400,
          display: "flex",
        }}
      >
        devbox-tools-puce.vercel.app
      </div>
    </div>,
    { ...size }
  );
}

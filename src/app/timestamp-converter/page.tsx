import type { Metadata } from "next";
import TimestampClient from "./TimestampClient";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter — Epoch to Date Online Free",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Shows ISO 8601, UTC, local time, and relative time.",
};

export default function TimestampConverterPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Unix Timestamp Converter</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Convert between Unix timestamps and human-readable dates instantly. Supports seconds and milliseconds.
      </p>
      <TimestampClient />
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-3">About Unix Timestamps</h2>
        <p style={{ color: "var(--text-muted)" }}>
          A Unix timestamp (also called Epoch time) is the number of seconds elapsed since January 1, 1970 00:00:00 UTC.
          It is widely used in APIs, databases, and log files. This tool converts timestamps in both seconds and
          milliseconds to readable formats including ISO 8601, UTC, and local time.
        </p>
      </section>
    </div>
  );
}

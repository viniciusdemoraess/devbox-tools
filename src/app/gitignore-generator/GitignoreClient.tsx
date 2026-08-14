"use client";

import { useState, useCallback } from "react";

const TEMPLATES: Record<string, string> = {
  Node: `# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
.npm
.env
.env.local
.env.*.local
dist/
build/`,

  Python: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.venv/
dist/
build/
*.egg-info/
.eggs/
*.egg
.pytest_cache/
.mypy_cache/`,

  Java: `# Java
*.class
*.log
*.jar
*.war
*.ear
*.zip
*.tar.gz
*.rar
target/
build/
.gradle/
out/`,

  "C/C++": `# C/C++
*.o
*.a
*.so
*.out
*.exe
build/
cmake-build-*/
CMakeCache.txt
CMakeFiles/`,

  Go: `# Go
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
vendor/
go.sum`,

  Rust: `# Rust
/target/
Cargo.lock
**/*.rs.bk`,

  React: `# React
node_modules/
build/
dist/
.env
.env.local
.env.production
.DS_Store`,

  "Next.js": `# Next.js
node_modules/
.next/
out/
build/
.env*.local
.vercel`,

  Vue: `# Vue
node_modules/
dist/
.env
.env.local
.DS_Store`,

  Laravel: `# Laravel
vendor/
node_modules/
.env
.env.backup
public/hot
public/storage
storage/*.key
.phpunit.result.cache`,

  Django: `# Django
*.pyc
__pycache__/
*.pot
*.mo
db.sqlite3
db.sqlite3-journal
media/
staticfiles/
.env`,

  macOS: `# macOS
.DS_Store
.AppleDouble
.LSOverride
._*
.Spotlight-V100
.Trashes
.fseventsd`,

  Windows: `# Windows
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk`,

  Linux: `# Linux
*~
.fuse_hidden*
.directory
.Trash-*
.nfs*`,

  VSCode: `# VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace
.history/`,

  JetBrains: `# JetBrains
.idea/
*.iws
*.iml
*.ipr
out/
.idea_modules/`,

  Docker: `# Docker
.dockerignore
docker-compose.override.yml`,

  Terraform: `# Terraform
.terraform/
*.tfstate
*.tfstate.*
crash.log
*.tfvars
override.tf
override.tf.json`,
};

const CATEGORIES: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Node", "Python", "Java", "C/C++", "Go", "Rust"] },
  { label: "Frameworks", items: ["React", "Next.js", "Vue", "Laravel", "Django"] },
  { label: "OS", items: ["macOS", "Windows", "Linux"] },
  { label: "Editors", items: ["VSCode", "JetBrains"] },
  { label: "Tools", items: ["Docker", "Terraform"] },
];

export default function GitignoreClient() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const toggle = (item: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const output = Array.from(selected)
    .map((key) => TEMPLATES[key])
    .join("\n\n");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".gitignore";
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        {CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              {cat.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <button
                  key={item}
                  onClick={() => toggle(item)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all"
                  style={{
                    background: selected.has(item) ? "var(--accent)" : "var(--surface)",
                    color: selected.has(item) ? "#fff" : "var(--text)",
                    border: `1px solid ${selected.has(item) ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected.size > 0 && (
        <>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              Download .gitignore
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              Clear
            </button>
          </div>
          <textarea
            readOnly
            className="w-full rounded-lg p-4 font-mono text-sm resize-y outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", minHeight: "320px" }}
            value={output}
            spellCheck={false}
          />
        </>
      )}

      {selected.size === 0 && (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Select one or more options above to generate your .gitignore file.
        </p>
      )}
    </div>
  );
}

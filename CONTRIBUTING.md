# Contributing to DevBox Tools

Thank you for your interest in contributing! Here are the main rules and guidelines.

## Getting started

```bash
git clone https://github.com/viniciusdemoraess/devbox.tools.git
cd devbox.tools
npm install
cp .env.example .env.local
npm run dev
```

## Branching

- `main` — production branch (deployed automatically to Vercel)
- `feat/<name>` — new tools or features
- `fix/<name>` — bug fixes
- `chore/<name>` — build, deps, config changes

## Adding a new tool

1. Create the page: `src/app/[locale]/<tool-slug>/page.tsx`
   - Export `generateMetadata` using the `pageMetadata()` helper
   - Export `generateStaticParams` returning `[{ locale: "en" }, { locale: "pt" }]`
2. Create a client component if needed: `src/app/[locale]/<tool-slug>/<ToolName>Client.tsx`
3. Add translation keys in **both** `messages/en.json` and `messages/pt.json` under a new namespace matching the tool slug (camelCase)
4. Add the tool to `src/components/Sidebar.tsx` under the correct group
5. Make sure all processing is **client-side only** — no user data should reach a server

## Privacy rules (mandatory)

- **Never** send user input to any external service or analytics event
- The following data must never appear in GA4, Sentry, or any network request:
  JSON content, JWT tokens, regex patterns, CPF, CNPJ, passwords, Pix keys, compared texts, copied content
- All computation must happen in the browser

## Code style

- TypeScript — all files must compile without errors (`npm run build`)
- No hardcoded strings — use `useTranslations` / `getTranslations`
- Keep components small and focused
- No comments unless the *why* is genuinely non-obvious

## Pull request checklist

- [ ] `npm run build` passes
- [ ] `npm test` passes  
- [ ] Both `en.json` and `pt.json` updated
- [ ] No hardcoded language strings
- [ ] No user data sent to external services
- [ ] PR description explains what the tool does and why it belongs here

## Commit messages

Use the conventional commits format:

```
feat(regex-tester): add named capture group highlighting
fix(cpf-cnpj): correct check digit for edge case all-zeros
chore(deps): bump next-intl to 4.14.0
```

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

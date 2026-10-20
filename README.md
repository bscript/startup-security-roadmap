# Startup Security Roadmap

What a startup needs from its first security engineer, laid out as a year-one plan you can click through.

**Live site: https://bscript.github.io/startup-security-roadmap/**

- **First week**: ten jobs for your first five days.
- **Roadmap**: 73 pieces of work across 10 domains, from the first 30 days to ongoing work. Each item has steps, deliverables, tools, and the SOC 2 and ISO 27001:2022 controls it covers. Filter by company size and what's driving the work, then export as CSV (for Linear or Jira) or Markdown.
- **Maturity**: tick off what's done and see a tier per domain, using the NIST CSF 2.0 tier names.
- **Tools**: over 100 tools grouped by job, marked open source, free tier, paid or built in.

## Contributing

Found a mistake, a missing tool or a better way to do something? Open an issue or a pull request.

- Roadmap items live in `assets/data.js`. Each item has an id, domain, phase (0 to 4), priority (`must`, `should`, `could`), effort (`S`, `M`, `L`), steps, outputs, tools, SOC 2 and ISO references, and dependencies. The `FIT` table at the bottom sets which company sizes and situations each item applies to.
- Tools live in `assets/tools.js`. Each tool has a name, category, type (`oss`, `free`, `paid`, `builtin`, `ref`), URL, a one-line description and the domains it helps with.

Please keep descriptions short and neutral. This isn't a place for vendor marketing, and fixes to control mappings are especially welcome.

## How it was made

I built this with help from Claude (Anthropic): it drafted most of the content, the tool list and the page code. I then reviewed it, changed the structure and wording, and made my own edits. Treat it as a starting point you check against your own context, not a source of truth.

## Disclaimer

This is general guidance, not legal, compliance or audit advice. Control mappings are a starting point; your auditor has the final say. Tool listings are not endorsements, and pricing and features change, so check them yourself.

## Licence

MIT. See [LICENSE](LICENSE).

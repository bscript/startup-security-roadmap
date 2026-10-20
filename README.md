# Startup Security Roadmap

What a startup needs from its first security engineer, laid out as a year-one plan you can click through.

**Live site: https://bscript.github.io/startup-security-roadmap/**

- **First week**: ten jobs to do in your first five days.
- **Roadmap**: 73 pieces of work across 10 domains (governance, code and CI/CD, cloud, identity, data and GDPR, vendors and subprocessors, detection and response, testing, people, product and AI security), in five phases from the first 30 days to ongoing work. Filter by company size and what's driving the work (enterprise deals, an audit, EU personal data, AI features, Gmail or Microsoft 365 APIs), then export what applies as CSV for Linear or Jira, or as Markdown. Each item has the steps, what you hand over, tools to look at, and the SOC 2 and ISO 27001:2022 controls it covers.
- **Maturity**: tick off what you've done and see a tier per domain, using the NIST CSF 2.0 tier names.
- **Tools**: over 100 tools grouped by job (compliance automation, SAST, secrets, cloud posture, SIEM, privacy, AI security and more), marked open source, free tier, paid or built in.

Progress is saved in your browser only. Nothing is sent anywhere.

## Run it locally

It's a static site with no build step.

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish with GitHub Pages

1. Push this folder to a GitHub repo.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, pick **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Set `REPO_URL` at the top of `assets/app.js` to show a GitHub link in the header.
5. In `index.html`, change the `og:image` value to the full URL of `og-image.png` on your Pages site, so link previews show the image.

To change the preview image, edit `tools/og.html` and re-render it at 1200 × 630 (for example with headless Chrome's `--screenshot`).

## Contributing

- Roadmap items: `assets/data.js`. Each item has an id, domain, phase (0 to 4), priority (`must`, `should`, `could`), effort (`S`, `M`, `L`), steps, outputs, tools, SOC 2 and ISO references, and dependencies.
- Tools: `assets/tools.js`. Each tool has a name, category, type (`oss`, `free`, `paid`, `builtin`, `ref`), URL, a one-line description and the domains it helps with.

Pull requests that fix mistakes, add missing tools or update pricing types are welcome. Please keep descriptions short and neutral; this is not a place for vendor marketing.

## Disclaimer

This is general guidance, not legal or audit advice. Control mappings are a starting point; your auditor has the final say. Tool listings are not endorsements.

## Licence

MIT

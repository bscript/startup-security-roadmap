// Tool catalogue. Listing is not an endorsement; check pricing and terms yourself.
// type: oss = open source, free = free tier or free product, paid = paid, builtin = part of a platform you likely already pay for, ref = free guide or framework
// lanes: roadmap domains the tool helps with

const TOOL_TYPES = {
  oss: "Open source",
  free: "Free tier",
  paid: "Paid",
  builtin: "Built in",
  ref: "Free guide"
};

const TOOL_CATEGORIES = [
  { id: "grc", name: "Compliance automation", note: "Pick one. They connect to your cloud, GitHub, IdP and HR system and collect audit evidence. Compare price per framework and whether the audit is bundled." },
  { id: "trust", name: "Trust pages & questionnaires", note: "Answer security questionnaires once and share reports under NDA. Most GRC tools now include a basic version." },
  { id: "sast", name: "Code scanning (SAST)", note: "Start with one scanner and a small ruleset. Too many findings and engineers stop reading them." },
  { id: "sca", name: "Dependencies & supply chain", note: "Known-vulnerable and malicious packages. Turn on Dependabot or Renovate on day one; add the rest as you grow." },
  { id: "secrets", name: "Secrets scanning", note: "Scan the full git history once, then block new leaks at push time." },
  { id: "cicd", name: "CI/CD hardening", note: "Checks for unsafe GitHub Actions workflows and runners." },
  { id: "iac", name: "Containers & infrastructure as code", note: "Scan images and Terraform before they reach the cloud." },
  { id: "cloud", name: "Cloud posture (CSPM)", note: "Finds public buckets, open ports and risky IAM. Start with the free native tools or Prowler." },
  { id: "allinone", name: "All-in-one for small teams", note: "One product covering code, dependencies, secrets and cloud. Useful when there is only one security person." },
  { id: "iam", name: "Identity & access", note: "SSO and MFA first. Just-in-time access to production once you have a few engineers." },
  { id: "device", name: "Devices & endpoints", note: "Laptop management (MDM) and endpoint detection (EDR)." },
  { id: "saas", name: "SaaS security", note: "Settings, sharing and third-party OAuth apps across Google Workspace, Slack, Notion and so on." },
  { id: "siem", name: "Logging & detection", note: "Central logs and alert rules. Native cloud detection first, a SIEM once you have the people to watch it." },
  { id: "ir", name: "Incident response", note: "Run incidents in one place with roles, timelines and postmortems." },
  { id: "privacy", name: "Privacy & GDPR", note: "Data mapping, data subject requests, consent and data loss prevention." },
  { id: "vendor", name: "Vendor risk", note: "Review vendors before you buy and watch them after." },
  { id: "test", name: "Testing, pentest & bug bounty", note: "Hands-on testing tools, pentest platforms and bounty programs." },
  { id: "train", name: "Training & awareness", note: "Phishing simulation and secure coding practice." },
  { id: "ai", name: "AI & LLM security", note: "Guardrails, red-team tools and evals for products that use LLMs." },
  { id: "llm", name: "AI assistants for security work", note: "Use them for code review, triage, threat models, policy drafts and questionnaires. Never paste secrets or customer data into a tool your company hasn't approved." },
  { id: "ref", name: "Frameworks & free references", note: "Free standards and guides to plan against." }
];

const TOOLS = [
  // Compliance automation
  { name: "Vanta", cat: "grc", type: "paid", url: "https://www.vanta.com", what: "Widely used compliance platform for SOC 2, ISO 27001, GDPR, HIPAA and more. Large integration list and trust center.", lanes: ["gov", "vend", "ppl"] },
  { name: "Drata", cat: "grc", type: "paid", url: "https://drata.com", what: "Compliance automation with continuous control monitoring. Owns SafeBase for trust pages.", lanes: ["gov", "vend", "ppl"] },
  { name: "Sprinto", cat: "grc", type: "paid", url: "https://sprinto.com", what: "Compliance automation aimed at startups and mid-size SaaS. Covers SOC 2, ISO 27001, GDPR and many other frameworks.", lanes: ["gov", "vend", "ppl"] },
  { name: "Secureframe", cat: "grc", type: "paid", url: "https://secureframe.com", what: "Compliance automation with built-in policy templates and questionnaire help.", lanes: ["gov", "vend"] },
  { name: "Thoropass", cat: "grc", type: "paid", url: "https://thoropass.com", what: "Compliance platform with the audit included, so you deal with one company.", lanes: ["gov"] },
  { name: "Scrut", cat: "grc", type: "paid", url: "https://www.scrut.io", what: "Compliance and risk platform popular with smaller SaaS teams.", lanes: ["gov"] },
  { name: "Oneleet", cat: "grc", type: "paid", url: "https://www.oneleet.com", what: "Compliance platform bundled with pentest and code scanning.", lanes: ["gov", "test"] },
  { name: "Comp AI", cat: "grc", type: "oss", url: "https://trycomp.ai", what: "Open-source compliance automation for SOC 2, ISO 27001 and GDPR. Hosted option too.", lanes: ["gov"] },
  { name: "Probo", cat: "grc", type: "oss", url: "https://www.getprobo.com", what: "Open-source compliance platform for startups.", lanes: ["gov"] },
  { name: "CISO Assistant", cat: "grc", type: "oss", url: "https://github.com/intuitem/ciso-assistant-community", what: "Open-source GRC tool with many frameworks mapped, including ISO 27001, NIST CSF and NIS2.", lanes: ["gov"] },

  // Trust
  { name: "SafeBase", cat: "trust", type: "paid", url: "https://safebase.io", what: "Trust center with NDA-gated report sharing. Now part of Drata.", lanes: ["gov"] },
  { name: "Conveyor", cat: "trust", type: "paid", url: "https://www.conveyor.com", what: "AI help with security questionnaires, plus a trust center.", lanes: ["gov"] },
  { name: "Whistic", cat: "trust", type: "paid", url: "https://www.whistic.com", what: "Share your security profile and review vendors in one place.", lanes: ["gov", "vend"] },

  // SAST
  { name: "Semgrep", cat: "sast", type: "free", url: "https://semgrep.dev", what: "Fast code scanner with readable custom rules. Free for small teams; paid tier adds cross-file analysis and AI triage.", lanes: ["code"] },
  { name: "CodeQL", cat: "sast", type: "builtin", url: "https://codeql.github.com", what: "GitHub's code analysis engine. Free on public repos; needs GitHub Code Security for private ones. Copilot Autofix suggests fixes.", lanes: ["code"] },
  { name: "Opengrep", cat: "sast", type: "oss", url: "https://github.com/opengrep/opengrep", what: "Community fork of the Semgrep engine, fully open source.", lanes: ["code"] },
  { name: "SonarQube", cat: "sast", type: "free", url: "https://www.sonarsource.com/products/sonarqube/", what: "Code quality and security checks. Free community build; paid editions add more security rules.", lanes: ["code"] },
  { name: "Snyk Code", cat: "sast", type: "free", url: "https://snyk.io", what: "Developer-focused SAST in the IDE and pull requests. Free tier with limited scans.", lanes: ["code"] },

  // SCA & supply chain
  { name: "Dependabot", cat: "sca", type: "builtin", url: "https://docs.github.com/code-security/dependabot", what: "GitHub's dependency alerts and update pull requests. Free.", lanes: ["code"] },
  { name: "Renovate", cat: "sca", type: "oss", url: "https://docs.renovatebot.com", what: "Flexible dependency updates with grouping and schedules. Good when Dependabot gets noisy.", lanes: ["code"] },
  { name: "OSV-Scanner", cat: "sca", type: "oss", url: "https://google.github.io/osv-scanner/", what: "Google's scanner backed by the open OSV vulnerability database.", lanes: ["code"] },
  { name: "Socket", cat: "sca", type: "free", url: "https://socket.dev", what: "Flags malicious or suspicious packages before you install them.", lanes: ["code"] },
  { name: "Syft", cat: "sca", type: "oss", url: "https://github.com/anchore/syft", what: "Generates SBOMs from images and folders.", lanes: ["code"] },
  { name: "Sigstore cosign", cat: "sca", type: "oss", url: "https://docs.sigstore.dev", what: "Sign and verify container images and build artifacts.", lanes: ["code"] },
  { name: "SLSA", cat: "sca", type: "ref", url: "https://slsa.dev", what: "Framework for build integrity and provenance levels.", lanes: ["code"] },

  // Secrets
  { name: "Gitleaks", cat: "secrets", type: "oss", url: "https://github.com/gitleaks/gitleaks", what: "Scans git history and pre-commit for secrets.", lanes: ["code"] },
  { name: "TruffleHog", cat: "secrets", type: "oss", url: "https://github.com/trufflesecurity/trufflehog", what: "Finds secrets and checks whether they are still live.", lanes: ["code"] },
  { name: "GitHub secret scanning", cat: "secrets", type: "builtin", url: "https://docs.github.com/code-security/secret-scanning", what: "Detects secrets and blocks pushes that contain them. Free on public repos; needs GitHub Secret Protection for private.", lanes: ["code"] },
  { name: "GitGuardian", cat: "secrets", type: "free", url: "https://www.gitguardian.com", what: "Secrets detection across repos and other sources. Free for small teams.", lanes: ["code"] },

  // CI/CD
  { name: "zizmor", cat: "cicd", type: "oss", url: "https://docs.zizmor.sh", what: "Static analysis for GitHub Actions workflows: injection, excessive permissions, unpinned actions.", lanes: ["code"] },
  { name: "StepSecurity Harden-Runner", cat: "cicd", type: "free", url: "https://www.stepsecurity.io", what: "Watches and limits network traffic from CI runners. Free for public repos.", lanes: ["code"] },
  { name: "OpenSSF Scorecard", cat: "cicd", type: "oss", url: "https://scorecard.dev", what: "Scores a repo on branch protection, pinned dependencies, token permissions and more.", lanes: ["code"] },

  // IaC & containers
  { name: "Trivy", cat: "iac", type: "oss", url: "https://trivy.dev", what: "Scans images, file systems, Terraform and Kubernetes for vulnerabilities and misconfigurations.", lanes: ["code", "cloud"] },
  { name: "Checkov", cat: "iac", type: "oss", url: "https://www.checkov.io", what: "Policy checks for Terraform, CloudFormation, Kubernetes and Dockerfiles.", lanes: ["code", "cloud"] },
  { name: "KICS", cat: "iac", type: "oss", url: "https://kics.io", what: "Infrastructure-as-code scanner with a large query library.", lanes: ["cloud"] },
  { name: "Grype", cat: "iac", type: "oss", url: "https://github.com/anchore/grype", what: "Vulnerability scanner for container images and SBOMs.", lanes: ["code"] },
  { name: "Chainguard Images", cat: "iac", type: "free", url: "https://www.chainguard.dev", what: "Minimal container base images with few or no known CVEs.", lanes: ["code", "cloud"] },

  // Cloud
  { name: "Prowler", cat: "cloud", type: "oss", url: "https://prowler.com", what: "Cloud security checks for AWS, GCP, Azure and Kubernetes, mapped to CIS and compliance frameworks.", lanes: ["cloud"] },
  { name: "AWS Security Hub", cat: "cloud", type: "builtin", url: "https://aws.amazon.com/security-hub/", what: "AWS's posture checks and findings in one place.", lanes: ["cloud"] },
  { name: "GuardDuty", cat: "cloud", type: "builtin", url: "https://aws.amazon.com/guardduty/", what: "AWS threat detection from CloudTrail, DNS and network logs.", lanes: ["cloud", "ir"] },
  { name: "Security Command Center", cat: "cloud", type: "builtin", url: "https://cloud.google.com/security/products/security-command-center", what: "Google Cloud's posture and threat detection.", lanes: ["cloud", "ir"] },
  { name: "Wiz", cat: "cloud", type: "paid", url: "https://www.wiz.io", what: "Agentless cloud security platform. Strong but priced for larger teams.", lanes: ["cloud"] },
  { name: "Steampipe", cat: "cloud", type: "oss", url: "https://steampipe.io", what: "Query cloud and SaaS APIs with SQL. Handy for inventories and custom checks.", lanes: ["cloud", "gov"] },

  // All-in-one
  { name: "Aikido Security", cat: "allinone", type: "free", url: "https://www.aikido.dev", what: "Code, dependency, secrets, container and cloud scanning in one place, aimed at startups. Free tier.", lanes: ["code", "cloud"] },
  { name: "Snyk", cat: "allinone", type: "free", url: "https://snyk.io", what: "Code, open source, container and IaC scanning. Free tier with limits.", lanes: ["code", "cloud"] },

  // IAM
  { name: "Google Workspace", cat: "iam", type: "builtin", url: "https://workspace.google.com", what: "Works as an identity provider with SSO and passkeys if you already use it.", lanes: ["iam"] },
  { name: "Okta", cat: "iam", type: "paid", url: "https://www.okta.com", what: "Identity provider with SSO, MFA and lifecycle automation.", lanes: ["iam"] },
  { name: "Microsoft Entra ID", cat: "iam", type: "builtin", url: "https://www.microsoft.com/security/business/identity-access/microsoft-entra-id", what: "Microsoft's identity provider, if you run on Microsoft 365.", lanes: ["iam"] },
  { name: "JumpCloud", cat: "iam", type: "paid", url: "https://jumpcloud.com", what: "Identity, SSO and device management in one, popular with small companies.", lanes: ["iam"] },
  { name: "AWS IAM Identity Center", cat: "iam", type: "builtin", url: "https://aws.amazon.com/iam/identity-center/", what: "SSO into AWS accounts with permission sets instead of IAM users.", lanes: ["iam", "cloud"] },
  { name: "Teleport", cat: "iam", type: "oss", url: "https://goteleport.com", what: "Access to servers, databases and Kubernetes with short-lived certificates and session recording.", lanes: ["iam"] },
  { name: "ConductorOne", cat: "iam", type: "paid", url: "https://www.conductorone.com", what: "Access requests, just-in-time access and access reviews.", lanes: ["iam"] },
  { name: "1Password", cat: "iam", type: "paid", url: "https://1password.com", what: "Company password manager with shared vaults and device trust add-on.", lanes: ["iam"] },
  { name: "Bitwarden", cat: "iam", type: "oss", url: "https://bitwarden.com", what: "Open-source password manager with business plans.", lanes: ["iam"] },

  // Devices
  { name: "Fleet", cat: "device", type: "oss", url: "https://fleetdm.com", what: "Open-source device management built on osquery.", lanes: ["iam"] },
  { name: "Jamf", cat: "device", type: "paid", url: "https://www.jamf.com", what: "Mac and iOS management.", lanes: ["iam"] },
  { name: "Microsoft Intune", cat: "device", type: "builtin", url: "https://www.microsoft.com/security/business/microsoft-intune", what: "Device management included in many Microsoft 365 plans.", lanes: ["iam"] },
  { name: "CrowdStrike Falcon", cat: "device", type: "paid", url: "https://www.crowdstrike.com", what: "Endpoint detection and response.", lanes: ["iam", "ir"] },
  { name: "SentinelOne", cat: "device", type: "paid", url: "https://www.sentinelone.com", what: "Endpoint detection and response.", lanes: ["iam", "ir"] },

  // SaaS
  { name: "Nudge Security", cat: "saas", type: "paid", url: "https://www.nudgesecurity.com", what: "Finds every SaaS app and OAuth grant in use and nudges people to fix risks.", lanes: ["iam", "vend"] },
  { name: "Valence", cat: "saas", type: "paid", url: "https://www.valencesecurity.com", what: "SaaS settings, sharing and integration risks.", lanes: ["iam"] },
  { name: "AppOmni", cat: "saas", type: "paid", url: "https://appomni.com", what: "SaaS security posture management for larger app estates.", lanes: ["iam"] },

  // SIEM
  { name: "Panther", cat: "siem", type: "paid", url: "https://panther.com", what: "Cloud SIEM with detections written as code.", lanes: ["ir"] },
  { name: "Datadog Cloud SIEM", cat: "siem", type: "paid", url: "https://www.datadoghq.com/product/cloud-siem/", what: "Easy add-on if you already send logs to Datadog.", lanes: ["ir"] },
  { name: "Elastic Security", cat: "siem", type: "free", url: "https://www.elastic.co/security", what: "SIEM and endpoint on the Elastic stack. Free self-managed tier.", lanes: ["ir"] },
  { name: "Wazuh", cat: "siem", type: "oss", url: "https://wazuh.com", what: "Open-source SIEM and endpoint monitoring.", lanes: ["ir"] },
  { name: "Microsoft Sentinel", cat: "siem", type: "paid", url: "https://www.microsoft.com/security/business/siem-and-xdr/microsoft-sentinel", what: "Cloud SIEM, natural fit on Azure and Microsoft 365.", lanes: ["ir"] },

  // IR
  { name: "incident.io", cat: "ir", type: "paid", url: "https://incident.io", what: "Incident management in Slack: roles, timelines, status pages, postmortems.", lanes: ["ir"] },
  { name: "PagerDuty", cat: "ir", type: "paid", url: "https://www.pagerduty.com", what: "On-call and alert routing.", lanes: ["ir"] },
  { name: "Rootly", cat: "ir", type: "paid", url: "https://rootly.com", what: "Incident management and on-call in Slack.", lanes: ["ir"] },

  // Privacy
  { name: "Transcend", cat: "privacy", type: "paid", url: "https://transcend.io", what: "Data mapping and automated data subject requests across systems.", lanes: ["data"] },
  { name: "DataGrail", cat: "privacy", type: "paid", url: "https://www.datagrail.io", what: "Data subject requests and data discovery.", lanes: ["data"] },
  { name: "Fides (Ethyca)", cat: "privacy", type: "oss", url: "https://github.com/ethyca/fides", what: "Open-source privacy engineering: data maps, consent and access/deletion requests.", lanes: ["data"] },
  { name: "Osano", cat: "privacy", type: "free", url: "https://www.osano.com", what: "Cookie consent and privacy program tools. Free plan for consent.", lanes: ["data"] },
  { name: "Nightfall", cat: "privacy", type: "paid", url: "https://www.nightfall.ai", what: "Finds and blocks sensitive data in SaaS apps, logs and AI prompts.", lanes: ["data"] },

  // Vendor
  { name: "UpGuard", cat: "vendor", type: "paid", url: "https://www.upguard.com", what: "Vendor risk questionnaires and outside-in security ratings.", lanes: ["vend"] },
  { name: "SecurityScorecard", cat: "vendor", type: "free", url: "https://securityscorecard.com", what: "Security ratings of vendors from public signals. Free basic account.", lanes: ["vend"] },

  // Testing
  { name: "Burp Suite", cat: "test", type: "free", url: "https://portswigger.net/burp", what: "The standard web testing proxy. Free Community edition; Pro adds the scanner.", lanes: ["test"] },
  { name: "ZAP", cat: "test", type: "oss", url: "https://www.zaproxy.org", what: "Open-source web app scanner that runs well in CI.", lanes: ["test"] },
  { name: "Nuclei", cat: "test", type: "oss", url: "https://github.com/projectdiscovery/nuclei", what: "Template-based scanner for known issues and misconfigurations.", lanes: ["test"] },
  { name: "subfinder", cat: "test", type: "oss", url: "https://github.com/projectdiscovery/subfinder", what: "Finds subdomains for attack surface mapping.", lanes: ["test"] },
  { name: "Cobalt", cat: "test", type: "paid", url: "https://www.cobalt.io", what: "Pentest as a service with a platform for findings and retests.", lanes: ["test"] },
  { name: "HackerOne", cat: "test", type: "paid", url: "https://www.hackerone.com", what: "Bug bounty, disclosure programs and pentests.", lanes: ["test"] },
  { name: "Intigriti", cat: "test", type: "paid", url: "https://www.intigriti.com", what: "European bug bounty platform.", lanes: ["test"] },
  { name: "Bugcrowd", cat: "test", type: "paid", url: "https://www.bugcrowd.com", what: "Bug bounty and disclosure programs.", lanes: ["test"] },
  { name: "Atomic Red Team", cat: "test", type: "oss", url: "https://atomicredteam.io", what: "Small attack tests mapped to MITRE ATT&CK to check your detections.", lanes: ["ir", "test"] },
  { name: "Stratus Red Team", cat: "test", type: "oss", url: "https://stratus-red-team.cloud", what: "Cloud attack techniques you can run safely to test detections.", lanes: ["ir", "test"] },

  // Training
  { name: "PortSwigger Web Security Academy", cat: "train", type: "ref", url: "https://portswigger.net/web-security", what: "Free hands-on web security labs. Great for engineers and champions.", lanes: ["ppl"] },
  { name: "OWASP Juice Shop", cat: "train", type: "oss", url: "https://owasp.org/www-project-juice-shop/", what: "Deliberately vulnerable app for training sessions and CTFs.", lanes: ["ppl"] },
  { name: "Secure Code Warrior", cat: "train", type: "paid", url: "https://www.securecodewarrior.com", what: "Secure coding training by language and framework.", lanes: ["ppl"] },
  { name: "Hoxhunt", cat: "train", type: "paid", url: "https://www.hoxhunt.com", what: "Phishing simulations that reward reporting.", lanes: ["ppl"] },
  { name: "KnowBe4", cat: "train", type: "paid", url: "https://www.knowbe4.com", what: "Security awareness training and phishing simulation.", lanes: ["ppl"] },

  // AI security
  { name: "promptfoo", cat: "ai", type: "oss", url: "https://www.promptfoo.dev", what: "Evals and red-team tests for prompts and LLM apps, runs in CI.", lanes: ["prod"] },
  { name: "garak", cat: "ai", type: "oss", url: "https://github.com/NVIDIA/garak", what: "NVIDIA's LLM vulnerability scanner: injection, leakage, jailbreaks.", lanes: ["prod"] },
  { name: "PyRIT", cat: "ai", type: "oss", url: "https://github.com/Azure/PyRIT", what: "Microsoft's toolkit for red-teaming generative AI systems.", lanes: ["prod"] },
  { name: "Llama Guard / Prompt Guard", cat: "ai", type: "oss", url: "https://github.com/meta-llama/PurpleLlama", what: "Meta's open models for classifying unsafe inputs and prompt injection.", lanes: ["prod"] },
  { name: "NeMo Guardrails", cat: "ai", type: "oss", url: "https://github.com/NVIDIA/NeMo-Guardrails", what: "Programmable guardrails around LLM conversations and tool use.", lanes: ["prod"] },
  { name: "Lakera Guard", cat: "ai", type: "paid", url: "https://www.lakera.ai", what: "API that screens prompts and outputs for injection and data leaks.", lanes: ["prod"] },
  { name: "OWASP Top 10 for LLM Apps", cat: "ai", type: "ref", url: "https://genai.owasp.org", what: "The common risk list for LLM applications. Use it as the threat model checklist.", lanes: ["prod"] },
  { name: "MITRE ATLAS", cat: "ai", type: "ref", url: "https://atlas.mitre.org", what: "Attack techniques against AI systems, in the style of ATT&CK.", lanes: ["prod"] },
  { name: "Google CASA", cat: "ai", type: "ref", url: "https://appdefensealliance.dev/casa", what: "The assessment Google requires for apps using restricted Gmail and Drive scopes.", lanes: ["prod"] },

  // LLM assistants
  { name: "Claude Code", cat: "llm", type: "paid", url: "https://www.anthropic.com/claude-code", what: "Anthropic's coding agent. Has a built-in /security-review command and works well for threat models, code review and writing policies.", lanes: ["code", "gov", "prod"] },
  { name: "Claude Code Security Review action", cat: "llm", type: "oss", url: "https://github.com/anthropics/claude-code-security-review", what: "GitHub Action that uses Claude to review pull requests for security issues.", lanes: ["code"] },
  { name: "GitHub Copilot Autofix", cat: "llm", type: "builtin", url: "https://docs.github.com/code-security/code-scanning", what: "Suggests fixes for CodeQL alerts inside the pull request.", lanes: ["code"] },
  { name: "Semgrep Assistant", cat: "llm", type: "paid", url: "https://semgrep.dev", what: "AI triage of Semgrep findings: marks likely false positives and drafts fixes.", lanes: ["code"] },
  { name: "Snyk DeepCode AI Fix", cat: "llm", type: "paid", url: "https://snyk.io", what: "AI-suggested fixes for Snyk Code findings.", lanes: ["code"] },

  // References
  { name: "NIST CSF 2.0", cat: "ref", type: "ref", url: "https://www.nist.gov/cyberframework", what: "The cybersecurity framework behind the tiers in the maturity view.", lanes: ["gov"] },
  { name: "OWASP SAMM", cat: "ref", type: "ref", url: "https://owaspsamm.org", what: "Maturity model for software security programs, with a free self-assessment.", lanes: ["gov", "code"] },
  { name: "OWASP ASVS", cat: "ref", type: "ref", url: "https://owasp.org/www-project-application-security-verification-standard/", what: "Detailed checklist of web app security requirements. Good for pentest scope.", lanes: ["code", "test"] },
  { name: "CIS Controls & Benchmarks", cat: "ref", type: "ref", url: "https://www.cisecurity.org", what: "Prioritised controls and hardening guides for clouds, OSes and SaaS.", lanes: ["cloud", "gov"] },
  { name: "MITRE ATT&CK", cat: "ref", type: "ref", url: "https://attack.mitre.org", what: "Catalogue of attacker techniques. Use it to plan detections.", lanes: ["ir"] },
  { name: "ICO guide to the UK GDPR", cat: "ref", type: "ref", url: "https://ico.org.uk/for-organisations/", what: "Clear, practical guidance on GDPR duties, DPIAs and breach reporting.", lanes: ["data"] }
];

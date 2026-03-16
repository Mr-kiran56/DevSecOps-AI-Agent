export interface Repo {
  id: string;
  name: string;
  url: string;
  branch: string;
  status: 'MONITORING' | 'IDLE';
  vulnCount: number;
  lastScan: string;
  mlShield: boolean;
  ragMemory: boolean;
  language: string;
  stars: number;
  commits: number;
  contributors: number;
  openPRs: number;
  size: string;
  lastActivity: string;
  description: string;
  healthScore: number;
  vulnBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface FeedEvent {
  id: number;
  time: string;
  status: 'success' | 'processing' | 'critical';
  text: string;
}

export const MOCK_REPOS: Repo[] = [
  {
    id: 'payment-service',
    name: 'payment-service',
    url: 'https://github.com/org/payment-service',
    branch: 'main',
    status: 'MONITORING',
    vulnCount: 47,
    lastScan: '2 min ago',
    mlShield: true,
    ragMemory: true,
  },
  {
    id: 'billing-service',
    name: 'billing-service',
    url: 'https://github.com/org/billing-service',
    branch: 'develop',
    status: 'MONITORING',
    vulnCount: 23,
    lastScan: '15 min ago',
    mlShield: true,
    ragMemory: true,
  },
  {
    id: 'auth-service',
    name: 'auth-service',
    url: 'https://github.com/org/auth-service',
    branch: 'main',
    status: 'IDLE',
    vulnCount: 12,
    lastScan: '1 hr ago',
    mlShield: true,
    ragMemory: true,
  },
];

export const MOCK_STATS = {
  totalVulns: 383,
  breakdown: {
    sqlInjection: 103,
    commandInjection: 31,
    hardcodedSecrets: 28,
    xss: 19,
    pathTraversal: 14,
  },
  vectorCount: 910,
  memoryHits: 220,
  semanticMatchRate: 87,
  fixSuccessRate: 94,
  avgRetries: 1.2,
  verifiedFixes: 317,
  manualReviews: 12,
};

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  { role: 'user', text: 'Analyze repository payment-service' },
  { role: 'ai', text: 'PR #47 analyzed.\n2 vulnerabilities detected:\n• SQL Injection in auth.py (line 12)\n• Hardcoded API key in config.py (line 7)\nGenerating secure patches using RAG context from 3 similar past cases...\nFix branch created: security-fix/pr-47-sql-injection' },
  { role: 'user', text: 'Show memory knowledge for SQL injection' },
  { role: 'ai', text: 'Retrieved 103 SQL Injection cases from vector memory.\nTop match: payment-service/login.py (similarity: 0.94)\nPattern: f-string interpolation in raw SQL query\nFix pattern applied: parameterized queries using cursor.execute(query, params)\nEmbedding DB: 910 vectors | Last updated: 2 min ago' },
];

export const MOCK_FEED_EVENTS: FeedEvent[] = [
  { id: 1, time: '14:32:01', status: 'success', text: 'PR #47 analyzed — 2 vulnerabilities detected' },
  { id: 2, time: '14:32:03', status: 'processing', text: 'Generating patch using RAG context (3 similar cases)' },
  { id: 3, time: '14:32:08', status: 'success', text: 'Patch generated for auth.py — SQL Injection fixed' },
  { id: 4, time: '14:32:09', status: 'success', text: 'Docker sandbox test PASSED (exit 0)' },
  { id: 5, time: '14:32:10', status: 'success', text: 'ML Shield: container behavior NORMAL' },
  { id: 6, time: '14:32:11', status: 'success', text: 'ChromaDB updated — 911 vectors stored' },
  { id: 7, time: '14:32:12', status: 'success', text: 'Fix PR #48 opened: "AI Security Fix: SQL Injection in auth.py"' },
  { id: 8, time: '14:31:00', status: 'critical', text: 'PR #46 — Hardcoded AWS secret key detected in config.py' },
  { id: 9, time: '14:30:45', status: 'success', text: 'PR #46 fix verified and merged' },
];

export const MOCK_AI_RESPONSES: Record<string, string> = {
  'scan': 'Initiating full repository scan...\nAnalyzing 247 files across 12 directories.\n\nFound 3 potential vulnerabilities:\n• SQL Injection in db/queries.py (line 45)\n• Hardcoded secret in .env.example (line 3)\n• XSS in templates/user_profile.html (line 89)\n\nGenerating patches using RAG context...',
  'analyze': 'Analyzing latest pull request...\nPR #49: "Add payment webhook handler"\n\nSecurity assessment:\n• Input validation: ⚠ Missing sanitization on webhook payload\n• Authentication: ✓ Proper HMAC verification\n• Rate limiting: ✕ No rate limit on endpoint\n\nRecommendation: Add input sanitization and rate limiting before merge.',
  'vuln': 'Current vulnerability summary:\n\n🔴 Critical: 2 (Hardcoded secrets, SQL Injection)\n🟡 High: 5 (XSS, Command Injection)\n🟢 Medium: 12 (Deprecated deps, missing headers)\n\nTotal: 19 active vulnerabilities\nResolved this week: 8\nAuto-patched: 6 (75% success rate)',
  'fix': 'Generating secure fix for detected vulnerability...\n\nTarget: auth.py line 12\nType: SQL Injection\nStrategy: Parameterized query replacement\n\n```python\n# Before (vulnerable)\ncursor.execute(f"SELECT * FROM users WHERE id={user_id}")\n\n# After (secure)\ncursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))\n```\n\nFix branch created: security-fix/sql-injection-auth\nDocker sandbox test: PASSED ✓',
  'memory': 'Vector Memory Status:\n\n📊 Total Embeddings: 910\n🔍 Recent Retrievals: 220\n📈 Semantic Match Rate: 87%\n\nTop knowledge clusters:\n1. SQL Injection patterns (103 vectors)\n2. Authentication bypasses (87 vectors)\n3. Secrets management (64 vectors)\n4. XSS prevention (52 vectors)\n\nLast update: 2 minutes ago',
  'default': 'I\'ve analyzed your request against the current repository context.\n\nBased on the security knowledge base (910 vectors), I recommend:\n1. Running a full dependency audit\n2. Checking for new CVEs against your stack\n3. Reviewing recent PR changes for security implications\n\nWould you like me to proceed with any of these actions?',
};

export const RANDOM_EVENTS: string[] = [
  'PR #50 analyzed — No vulnerabilities detected',
  'ChromaDB updated — {count} vectors stored',
  'ML Shield: container behavior NORMAL',
  'Docker sandbox test PASSED (exit 0)',
  'Dependency audit: 2 outdated packages found',
  'Branch scan complete — main is clean',
  'RAG memory: new pattern learned from fix #48',
  'Agent heartbeat: all systems operational',
  'PR #51 opened — scanning for vulnerabilities...',
  'Config validation passed — no exposed secrets',
];

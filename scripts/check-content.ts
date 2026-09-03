/**
 * Content gate.
 *
 * The brief's hardest rule is that nothing about the business may be invented.
 * `publishable()` enforces that at render time; this script enforces it at
 * build time, and catches the class of mistake render-time checks cannot: a
 * page that would ship empty, structured data emitted for an answer nobody
 * verified, or an Arabic string quietly missing so the page falls back to
 * English in front of an Arabic reader.
 *
 * Errors fail the build. Warnings are the standing list of what the client
 * still owes us, printed on every build so it does not get forgotten.
 *
 *   npm run check:content
 *
 * Runs on plain Node via type stripping — no build step, no extra dependency.
 * That works only because every runtime import in src/content is relative and
 * every cross-directory import is `import type`, which is erased. Keep it that
 * way or this script stops running.
 */

import { serviceCategories, allServices, openQuestions } from '../src/content/services.ts';
import { faqs } from '../src/content/faqs.ts';
import { processSteps } from '../src/content/process.ts';
import { qatarFacts, licensingRoutes } from '../src/content/qatar.ts';
import { testimonials, clientLogos, stats } from '../src/content/proof.ts';
import { company } from '../src/content/company.ts';
import type { Status, Verifiable } from '../src/content/types.ts';

const errors: string[] = [];
const warnings: string[] = [];

const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

/* ---------------------------------------------------------------------------
   1. Bilingual completeness

   Any object shaped exactly { en, ar } is a localized string. Both sides must
   be present and non-empty. A missing Arabic value does not throw at runtime —
   it renders `undefined` or silently falls back, which is exactly the failure
   an Arabic-first audience would notice and we would not.
   ------------------------------------------------------------------------- */

function isLocalized(v: unknown): v is Record<string, unknown> {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
  const keys = Object.keys(v);
  return keys.length === 2 && keys.includes('en') && keys.includes('ar');
}

function empty(v: unknown): boolean {
  if (typeof v === 'string') return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0 || v.some((x) => empty(x));
  return v === null || v === undefined;
}

function walkLocalized(value: unknown, path: string, seen = new WeakSet<object>()): void {
  if (typeof value !== 'object' || value === null) return;
  if (seen.has(value)) return;
  seen.add(value);

  if (isLocalized(value)) {
    for (const locale of ['en', 'ar'] as const) {
      if (empty((value as Record<string, unknown>)[locale])) {
        err(`${path}.${locale} is empty — every user-facing string needs both languages`);
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((v, i) => {
      // Prefer the record's own id over an array index: "services.holding-company"
      // is a build error someone can act on, "services[0].services[4]" is not.
      const id =
        typeof v === 'object' && v !== null && 'id' in v && typeof v.id === 'string'
          ? v.id
          : String(i);
      walkLocalized(v, `${path}.${id}`, seen);
    });
    return;
  }

  for (const [k, v] of Object.entries(value)) {
    walkLocalized(v, `${path}.${k}`, seen);
  }
}

walkLocalized(serviceCategories, 'services');
walkLocalized(faqs, 'faqs');
walkLocalized(processSteps, 'process');
walkLocalized(qatarFacts, 'qatar.facts');
walkLocalized(licensingRoutes, 'qatar.routes');
walkLocalized(company, 'company');

/* ---------------------------------------------------------------------------
   2. No page may ship empty
   ------------------------------------------------------------------------- */

for (const c of serviceCategories) {
  if (c.status === 'blocked') {
    err(`services.${c.id} is blocked — its page would render nothing`);
  }
  const renderable = c.services.filter((s) => s.status !== 'blocked');
  if (renderable.length === 0) {
    err(`services.${c.id} has no publishable services — its page would render an empty list`);
  }
  if (renderable.length < 3) {
    warn(
      `services.${c.id} has only ${renderable.length} publishable services — thin for a category page`,
    );
  }
}

/* ---------------------------------------------------------------------------
   3. Structured data may only carry verified answers

   FAQPage markup puts an answer into Google's index under YNWA's name. An
   unverified claim about Qatari law is not a thing to syndicate.
   ------------------------------------------------------------------------- */

for (const f of faqs) {
  if (!f.schemaEligible) continue;
  if (f.status === 'placeholder' || f.status === 'blocked') {
    err(
      `faqs.${f.id} is schemaEligible but status is "${f.status}" — only confirmed or derived answers may be emitted as FAQPage data`,
    );
  }
  if (f.status === 'confirmed' && !f.sources?.length) {
    err(`faqs.${f.id} is confirmed and schemaEligible but cites no source`);
  }
}

/* ---------------------------------------------------------------------------
   4. Anything asserted about Qatar carries a citation
   ------------------------------------------------------------------------- */

type Sourced = Verifiable & { id: string; sources?: { url: string; checked: string }[] };

for (const [label, records] of [
  ['qatar.facts', qatarFacts],
  ['qatar.routes', licensingRoutes],
] as [string, Sourced[]][]) {
  for (const r of records) {
    if (r.status !== 'confirmed') continue;
    if (!r.sources?.length) {
      err(`${label}.${r.id} is confirmed but cites no source`);
      continue;
    }
    for (const s of r.sources) {
      if (!/^https?:\/\//.test(s.url)) err(`${label}.${r.id} has a source without a valid URL`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s.checked)) {
        err(`${label}.${r.id} has a source without a checked date (YYYY-MM-DD)`);
      }
    }
  }
}

/* ---------------------------------------------------------------------------
   5. Proof stays honest
   ------------------------------------------------------------------------- */

for (const t of testimonials) {
  if (!t.consent) err(`proof.testimonials.${t.id} has no recorded consent to publish`);
}
for (const l of clientLogos) {
  if (!l.consent) err(`proof.clientLogos.${l.id} has no recorded consent to publish`);
}
for (const s of stats) {
  if (!s.basis?.trim()) err(`proof.stats.${s.id} has no basis — a number without a definition is a claim`);
}

/* ---------------------------------------------------------------------------
   Report
   ------------------------------------------------------------------------- */

const tally: Record<Status, number> = {
  confirmed: 0,
  derived: 0,
  placeholder: 0,
  blocked: 0,
};

const outstanding: { path: string; status: Status; note?: string }[] = [];

function count(path: string, records: (Verifiable & { id: string })[]): void {
  for (const r of records) {
    tally[r.status] += 1;
    if (r.status === 'placeholder' || r.status === 'blocked') {
      outstanding.push({ path: `${path}.${r.id}`, status: r.status, note: r.note });
    }
  }
}

count('services', serviceCategories);
count('services', allServices);
count('faqs', faqs);
count('process', processSteps);
count('qatar.facts', qatarFacts);
count('qatar.routes', licensingRoutes);

const total = Object.values(tally).reduce((a, b) => a + b, 0);
const pct = (n: number) => `${Math.round((n / total) * 100)}%`;

console.log('\n  Content audit\n  ─────────────');
console.log(`  confirmed    ${String(tally.confirmed).padStart(3)}   ${pct(tally.confirmed)}`);
console.log(`  derived      ${String(tally.derived).padStart(3)}   ${pct(tally.derived)}`);
console.log(`  placeholder  ${String(tally.placeholder).padStart(3)}   ${pct(tally.placeholder)}`);
console.log(`  blocked      ${String(tally.blocked).padStart(3)}   ${pct(tally.blocked)}`);
console.log(`  ${'─'.repeat(28)}\n  total        ${String(total).padStart(3)}`);

if (outstanding.length) {
  console.log('\n  Waiting on the client\n  ─────────────────────');
  for (const o of outstanding) {
    console.log(`  [${o.status}] ${o.path}`);
    if (o.note) console.log(`      ${o.note.replace(/\s+/g, ' ').slice(0, 150)}`);
  }
}

if (openQuestions.length) {
  console.log('\n  Questions raised by the source material\n  ──────────────────────────────────────');
  for (const q of openQuestions) {
    console.log(`  • ${q.question.replace(/\s+/g, ' ')}`);
  }
}

if (warnings.length) {
  console.log('\n  Warnings\n  ────────');
  for (const w of warnings) console.log(`  ! ${w}`);
}

if (errors.length) {
  console.log('\n  Errors\n  ──────');
  for (const e of errors) console.log(`  ✗ ${e}`);
  console.log(`\n  Content gate failed: ${errors.length} error(s).\n`);
  process.exit(1);
}

console.log('\n  Content gate passed.\n');

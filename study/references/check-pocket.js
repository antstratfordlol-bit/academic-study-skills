/* check-pocket.js — verify a study pocket page before shipping it.
 *
 *   node check-pocket.js "<path to ...— study-pocket.html>"
 *
 * The pocket has no SVG, so check-maps.js is the wrong instrument for it
 * (it reports "no <svg id=…> found" and then dies on the missing hosts).
 * This checks what a PHONE page can actually get wrong.
 *
 * Runs the page's own <script> against a DOM shim that models the handful of
 * things a pocket build touches — getElementById, createElement, innerHTML,
 * addEventListener, querySelector/All — and then asserts:
 *
 *   1 · the script runs at all (one bad quote blanks the whole page)
 *   2 · every declared pane/tab id actually exists, and they correspond
 *   3 · every row was built — no data array silently dropped
 *   4 · SEARCH ACTUALLY RETURNS, for a sample drawn from the page's own data
 *   5 · the <2-character guard holds (typing "a" must not dump the corpus)
 *   6 · the phone-specific CSS invariants the spec names:
 *         · font-size:16px on the search input (iOS zoom-on-focus)
 *         · env(safe-area-inset-*) on both fixed bars
 *         · a 44px+ tap target rule
 *         · single-theme: no prefers-color-scheme block
 *         · body background painted from a token
 *   7 · no unescaped raw " inside JS string data (the Isaacson map bug)
 *
 * ⚠ A checker that only ever passes is worse than none. Each assertion here
 * was confirmed to FIRE by breaking the page deliberately and putting it back.
 */
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.log('usage: node check-pocket.js <path>'); process.exit(1); }
const html = fs.readFileSync(file, 'utf8');

let problems = 0, warnings = 0;
const bad  = m => { problems++; console.log('  ✗ ' + m); };
const warn = m => { warnings++; console.log('  ⚠ ' + m); };
const ok   = m => console.log('  ✓ ' + m);

/* ---------- 1 · does the script run ---------- */
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) { bad('no <script> found'); process.exit(1); }

class El {
  constructor(tag){ this.tag=tag; this.children=[]; this.attrs={}; this.style={};
    this.dataset={}; this._html=''; this.textContent=''; this.hidden=false; this.value='';
    this.handlers={};
    const self=this;
    this.classList={ _s:new Set(),
      add(...c){c.forEach(x=>self.classList._s.add(x));},
      remove(...c){c.forEach(x=>self.classList._s.delete(x));},
      toggle(c,f){ const has=self.classList._s.has(c);
        const on = f===undefined ? !has : !!f;
        if(on) self.classList._s.add(c); else self.classList._s.delete(c);
        return on; },
      contains:c=>self.classList._s.has(c) };
  }
  setAttribute(k,v){ this.attrs[k]=String(v); }
  getAttribute(k){ return this.attrs[k] ?? null; }
  hasAttribute(k){ return k in this.attrs; }
  appendChild(c){ this.children.push(c); return c; }
  addEventListener(t,fn){ (this.handlers[t]=this.handlers[t]||[]).push(fn); }
  fire(t){ (this.handlers[t]||[]).forEach(fn=>fn.call(this,{key:'',preventDefault(){}})); }
  // assigning innerHTML clears children, as in a real DOM — without this a
  // cleared container still reports the nodes appended before the clear
  set innerHTML(v){ this._html=String(v); this.children=[]; }
  get innerHTML(){ return this._html; }
  set className(v){ this.classList._s=new Set(String(v).split(/\s+/).filter(Boolean)); }
  get className(){ return [...this.classList._s].join(' '); }
  querySelector(){ return new El('stub'); }
  querySelectorAll(){ return []; }
  // recursive text of everything built under this node
  deepHTML(){ return this._html + this.children.map(c=>c.deepHTML?c.deepHTML():'').join(''); }
  count(){ return this.children.reduce((n,c)=>n+1+(c.count?c.count():0),0); }
}

// ids the page is allowed to look up; discovered from the markup so a renamed
// host is a reported failure rather than a silent no-op
const markupIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const byId = {};
markupIds.forEach(id => { byId[id] = new El('div'); });

const allTabs = [];
global.document = {
  getElementById: id => byId[id] || null,
  createElement: t => new El(t),
  createElementNS: (ns,t) => new El(t),
  createTextNode: t => ({tag:'#text',textContent:t}),
  addEventListener(){},
  querySelector: sel => {
    if (sel === 'main') return byId.__main || (byId.__main = new El('main'));
    return new El('stub');
  },
  querySelectorAll: sel => {
    if (sel === '.tabs button') return allTabs;
    if (sel === '.pane') return [];
    return [];
  },
  documentElement: new El('html')
};
global.window = { scrollTo(){} };
global.matchMedia = () => ({ matches:false });

// seed the tab buttons from the markup so the tab wiring is exercised
for (const m of html.matchAll(/<button[^>]*data-p="([^"]+)"[^>]*>/g)) {
  const b = new El('button'); b.attrs['data-p'] = m[1]; allTabs.push(b);
}

console.log('\n── 1 · script executes ──');
let threw = false;
scripts.forEach((src,i) => {
  try { new Function(src)(); ok('script ' + i + ' ran'); }
  catch(e){ threw = true; bad('script '+i+' THREW: '+e.message+'\n      '+((e.stack||'').split('\n')[1]||'').trim()); }
});
if (threw) { console.log('\n⚠ NOT CLEAN — the page would render blank.'); process.exit(1); }

/* ---------- 2 · panes and tabs correspond ---------- */
console.log('\n── 2 · panes and tabs ──');
const paneIds = [...html.matchAll(/<section class="pane[^"]*" id="([^"]+)"/g)].map(m=>m[1]);
const tabTargets = allTabs.map(b=>b.attrs['data-p']);
if (!paneIds.length) bad('no .pane sections found');
paneIds.forEach(p => tabTargets.includes(p) ? null : bad('pane "'+p+'" has no tab pointing at it'));
tabTargets.forEach(t => paneIds.includes(t) ? null : bad('tab targets "'+t+'" which is not a pane'));
if (paneIds.length && paneIds.every(p=>tabTargets.includes(p)))
  ok(paneIds.length+' panes, each with a matching tab: '+paneIds.join(', '));
const onCount = (html.match(/class="pane on"/g)||[]).length;
if (onCount !== 1) bad('exactly one pane must start open; found '+onCount);
else ok('exactly one pane starts open');

/* ---------- 3 · everything got built ---------- */
/* Count what the DATA promises and compare. A bare "more than zero" check
 * passes a page whose whole chapter list was dropped but whose act headings
 * survived — which is exactly the silent pass a verifier must not give.
 * (Confirmed by mutation: filtering CH to nothing still left 5 heading nodes.) */
console.log('\n── 3 · content actually built ──');
const jsSource = scripts.join('\n');
const declared = name => {
  const m = new RegExp('var\\s+'+name+'\\s*=\\s*\\[([\\s\\S]*?)\\n\\];').exec(jsSource);
  if (!m) return null;
  // count top-level records: "{" at depth 0 of the array body
  let depth = 0, n = 0, inStr = null, prev = '';
  for (const ch of m[1]) {
    if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; }
    else if (ch === '"' || ch === "'") inStr = ch;
    else if (ch === '{') { if (depth === 0) n++; depth++; }
    else if (ch === '}') depth--;
    prev = ch;
  }
  return n;
};
const counts = {};
[['chapters','CH'],['who','WHO'],['tl','TL']].forEach(([host,arr]) => {
  const built = byId[host] ? byId[host].count() : -1;
  const want  = declared(arr);
  if (built < 0) { warn('no host #'+host+' in markup (skipped)'); return; }
  if (want === null) {
    built === 0 ? bad('#'+host+' built 0 nodes') : ok('#'+host+' built '+built+' nodes');
    return;
  }
  if (built < want)
    bad('#'+host+': '+arr+' declares '+want+' records but only '+built+
        ' nodes were built — records are not reaching the DOM');
  else ok('#'+host+': all '+want+' '+arr+' records built ('+built+' nodes incl. headings)');
  counts[arr] = want;
});

/* ⚠ The check above compares the data against itself, so it cannot see records
 * that were never DECLARED — drop half the chapters and both numbers shrink
 * together and it passes. An internal check needs an external truth, so where
 * an --expect is supplied (or a sibling store/outline can be counted), assert
 * against that instead. (Mutation-found, 2026-08-27: truncating CH from 42 to
 * 11 passed clean.) */
const expectArg = process.argv.find(a => a.startsWith('--expect='));
if (expectArg) {
  const want = Object.fromEntries(expectArg.slice(9).split(',').map(p => {
    const [k,v] = p.split(':'); return [k.trim(), parseInt(v,10)];
  }));
  for (const k in want) {
    if (counts[k] === undefined) { warn(`--expect names ${k}, which the page does not declare`); continue; }
    counts[k] === want[k]
      ? ok(`${k} matches the expected ${want[k]} records`)
      : bad(`${k} declares ${counts[k]} records, but ${want[k]} were expected — records are missing from the DATA, not just the DOM`);
  }
} else {
  warn('no --expect given: record counts are self-consistent, but nothing proves\n' +
       '       the data is complete. Pass e.g. --expect=CH:42,WHO:38 (from the store) to check that.');
}

/* ---------- 4 & 5 · search ---------- */
console.log('\n── 4 · search returns for real terms ──');
const q = byId.q, hits = byId.hits;
if (!q || !hits) { bad('no #q / #hits — search cannot be tested'); }
else {
  // sample terms straight out of the page's own data, so the test cannot
  // drift from the content the way a hardcoded list would
  const names = [...html.matchAll(/\{n:"([^"]{3,40})",g:"/g)].map(m=>m[1]);
  const sample = [];
  [0, Math.floor(names.length/3), Math.floor(2*names.length/3), names.length-1]
    .forEach(i => { if (names[i] && !sample.includes(names[i])) sample.push(names[i]); });
  // a surname-only probe, which is how you actually search on a phone
  const surname = (names.find(n=>n.split(' ').length>1)||'').split(' ').pop();
  if (surname) sample.push(surname);

  // count result blocks by the containers actually appended, not by scraping
  // markup — rows are El objects, so their class lives on classList
  const blocks = () => hits.children.filter(c =>
    ['row','ch','ev','tl'].some(k => c.classList.contains(k))).length
    + hits.children.reduce((n,c)=>n + (c.children?c.children.filter(g=>g.classList &&
        g.classList.contains('ev')).length:0), 0);

  sample.forEach(term => {
    q.value = term; q.fire('input');
    const n = blocks();
    const none = /class="none"/.test(hits.innerHTML);
    if (none || n === 0) bad('search "'+term+'" returned nothing');
    else ok('search "'+term+'" → '+n+' result block(s)');
  });

  console.log('\n── 5 · the <2-character guard ──');
  q.value = 'a'; q.fire('input');
  if (hits.hidden === true && blocks() === 0 && !hits.innerHTML)
    ok('single character shows nothing (guard holds)');
  else bad('single character "a" produced output — the corpus dumps on one keystroke');

  q.value = ''; q.fire('input');
  if (byId.__main && byId.__main.hidden === false) ok('clearing search restores the panes');
}

/* ---------- 6 · phone CSS invariants ---------- */
console.log('\n── 6 · phone invariants ──');
const css = (html.match(/<style>([\s\S]*?)<\/style>/)||[])[1] || '';
const inputRule = /#q\s*\{[^}]*\}/.exec(css);
if (inputRule && /font-size:\s*16px/.test(inputRule[0])) ok('search input is 16px (no iOS zoom-on-focus)');
else bad('search input must be font-size:16px or iOS zooms on focus and wrecks the layout');

/env\(safe-area-inset-top\)/.test(css) ? ok('safe-area inset on the top bar')
  : bad('top bar needs env(safe-area-inset-top) or the notch eats it');
/env\(safe-area-inset-bottom\)/.test(css) ? ok('safe-area inset on the bottom bar')
  : bad('bottom bar needs env(safe-area-inset-bottom) or the home indicator eats it');

const taps = [...css.matchAll(/min-height:\s*(\d+)px/g)].map(m=>+m[1]);
if (taps.some(v=>v>=44)) ok('tap targets ≥44px present (largest '+Math.max(...taps)+'px)');
else bad('no min-height ≥44px — tap targets are too small for a thumb');

if (/prefers-color-scheme/.test(css))
  warn('a prefers-color-scheme block is present; the spec says the pocket is single-theme by choice');
else ok('single-theme (no prefers-color-scheme) — committed, as the spec requires');

// match the standalone body rule, not "html,body{margin:0}" — a selector list
// that happens to contain body was matching first and reporting a false fault
const bodyRules = [...css.matchAll(/(^|[}\s])((?:[^{}]*\bbody\b[^{}]*))\{([^}]*)\}/g)];
if (bodyRules.some(m => /background:\s*var\(/.test(m[3]))) ok('body background painted from a token');
else bad('body must paint an explicit background or it borrows the host ground');

if (/<svg/.test(html)) warn('an <svg> is present — the spec says no SVG diagrams on the pocket');
else ok('no SVG diagrams, per spec');

/* ---------- 7 · the quote bug ---------- */
console.log('\n── 7 · string hygiene ──');
let quoteHits = 0;
jsSource.split('\n').forEach((line,i) => {
  // a double-quoted JS string containing a bare " that is not an escape
  const m = /:"(?:[^"\\]|\\.)*"[^",}\]:;)]*"/.exec(line);
  if (m && !/^\s*\/[/*]/.test(line)) { quoteHits++;
    if (quoteHits<=3) bad('line '+(i+1)+' may have an unescaped quote inside a string: '+line.trim().slice(0,80)); }
});
if (!quoteHits) ok('no unescaped double quotes inside JS string data');

/* ---------- verdict ---------- */
console.log('\n' + (problems ? '⚠ '+problems+' PROBLEM(S)'+(warnings?' · '+warnings+' warning(s)':'')
                              : '✓ PASS'+(warnings?' · '+warnings+' warning(s)':'')));
process.exit(problems ? 1 : 0);

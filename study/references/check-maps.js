/* check-maps.js — verify a study maps page before shipping it.
 *
 *   node check-maps.js "<path to ...— study-maps.html>"
 *
 * Runs the page's own <script> blocks against a minimal DOM shim (no browser,
 * no dependencies) and reports, per SVG:
 *   · whether the script threw at all — one bad quote blanks every map
 *   · the viewBox and the element counts actually built
 *   · EVERY PAIR OF OVERLAPPING TEXT LABELS, with the overlap in px
 *
 * Zero overlaps is the passing condition. See references/maps.md,
 * "Every label owns a box, and boxes may not overlap."
 *
 * ⚠ THE WIDTH ESTIMATOR IS THE WEAK POINT. The page has its own; if the two
 * disagree, this tool certifies a layout it never measured — or invents faults
 * that are not there. (Levin, 2026-08-27: the page used A–Z=0.68, this file
 * used 0.76, and the ~12% inflation produced three false "buried label"
 * reports on a page that was correct.)
 *
 * So: the page's estimator WINS. If the page defines textW/tw, it is lifted
 * out and used verbatim; the copy below is only a fallback for pages that
 * define none.
 */
// Minimal DOM shim: run the maps' script and report what each SVG ended up containing.
const fs = require('fs');
const path = process.argv[2];
const html = fs.readFileSync(path, 'utf8');

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) { console.log('NO SCRIPT FOUND'); process.exit(1); }

const byIdSeed = {};

class El {
  constructor(tag){ this.tag=tag; this.children=[]; this.attrs={}; this.style={}; this.dataset={};
    this.classList={ _s:new Set(),
      add:(...c)=>c.forEach(x=>this.classList._s.add(x)),
      remove:(...c)=>c.forEach(x=>this.classList._s.delete(x)),
      toggle:()=>{}, contains:c=>this.classList._s.has(c) };
    this.textContent=''; this._html=''; }
  setAttribute(k,v){ this.attrs[k]=String(v); }
  getAttribute(k){ return this.attrs[k] ?? null; }
  hasAttribute(k){ return k in this.attrs; }
  appendChild(c){ this.children.push(c); return c; }
  /* insertBefore is ordinary DOM and pages use it to put a node UNDER the rest
   * (background bands, links drawn behind boxes). Without it the whole script
   * throws on the first call and every later SVG reports "NOTHING DRAWN" —
   * which reads as a page fault when it is the shim's gap.
   * (Mitchell, 2026-08-29: three of four maps reported empty for this reason.) */
  insertBefore(c, ref){
    const i = ref ? this.children.indexOf(ref) : -1;
    if (i < 0) this.children.push(c); else this.children.splice(i, 0, c);
    return c;
  }
  removeChild(c){ const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i,1); return c; }
  get firstChild(){ return this.children.length ? this.children[0] : null; }
  contains(n){ if (n === this) return true;
    return this.children.some(c => c && c.contains ? c.contains(n) : false); }
  get parentNode(){ return this._parent || null; }
  get parentElement(){ return this._parent || null; }
  replaceChild(){} normalize(){}
  addEventListener(){}
  querySelector(){ return new El('stub'); }
  querySelectorAll(){ return []; }
  set innerHTML(v){ this._html=v; } get innerHTML(){ return this._html; }
  getBoundingClientRect(){ return {left:0,top:0,width:100,height:20}; }
  get offsetWidth(){ return 380; } get offsetHeight(){ return 200; }
  // count every descendant, recursively
  count(){ return this.children.reduce((n,c)=>n+1+(c.count?c.count():0),0); }
  tally(acc={}){ acc[this.tag]=(acc[this.tag]||0)+1;
    this.children.forEach(c=>c.tally&&c.tally(acc)); return acc; }
}

/* Discover the SVGs from the markup rather than assuming s1–s4, and seed each
 * with the attributes already present in the HTML — a viewBox set in markup is
 * never seen by the script, so without this the canvas reads as zero-area and
 * every rect looks like a full-bleed backdrop. (Levin, 2026-08-27.) */
const svgIds = [];
for (const m of html.matchAll(/<svg\b([^>]*)>/g)) {
  const tag = m[1];
  const id = /\bid="([^"]+)"/.exec(tag)?.[1];
  if (!id) continue;
  svgIds.push(id);
  const e = new El('svg');
  for (const a of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) e.attrs[a[1]] = a[2];
  byIdSeed[id] = e;
}
if (!svgIds.length) console.log('WARNING: no <svg id="…"> found in markup');

const byId = byIdSeed;
/* ⚠ Frame/host ids were once hardcoded f1–f6, so a page with f7+ got null back
 * from getElementById, threw inside its own popover helper, and left every later
 * SVG empty — reported as a page fault when it was the checker's. Discover the
 * ids from the markup instead; the fixed list is only a fallback for hosts that
 * the script creates rather than the markup declaring them. (Whitby, 2026-08-29.) */
for (const m of html.matchAll(/\bid="([^"]+)"/g)) {
  if (!byId[m[1]]) byId[m[1]] = new El('div');
}
['th','q','openall','shutall','acts','panel','tree','detail']
  .forEach(id => { if (!byId[id]) byId[id] = new El('div'); });

global.document = {
  getElementById: id => byId[id] || null,
  createElement: t => new El(t),
  createElementNS: (ns,t) => new El(t),
  createTextNode: t => ({tag:'#text',textContent:t}),
  addEventListener(){},
  querySelectorAll(){ return []; },
  documentElement: new El('html')
};
global.matchMedia = () => ({ matches:false });

let failed = false;
scripts.forEach((src,i) => {
  /* Capture the page's own width estimator so measurement cannot drift.
   * It usually lives inside an IIFE, so appending at the end reaches nothing —
   * inject the grab immediately after its definition instead. */
  let src2 = src.replace(
    /(function\s+(textW|tw)\s*\([^)]*\)\s*\{)/,
    (mm, head, name) => `${head}\n  try{ if(!globalThis.__pageTextW) globalThis.__pageTextW=${name}; }catch(e){}\n`
  );
  try { new Function(src2)(); }
  catch(e){ failed = true; console.log(`SCRIPT ${i} THREW: ${e.message}\n  ${(e.stack||'').split('\n')[1]||''}`); }
});

console.log(failed ? '\n--- ran with errors ---' : '\n--- all scripts ran clean ---');

/* Prefer the page's own estimator, captured while its scripts ran. Only if the
 * page defines none do we fall back to the local copy below. */
let textW;
{
  const fromPage = global.__pageTextW;
  if (typeof fromPage === 'function') {
    textW = (s,size=11.5,bold=false) => {
      try { const v = fromPage(String(s),size,bold); return isFinite(v)&&v>0 ? v : fallbackW(s,size,bold); }
      catch { return fallbackW(s,size,bold); }
    };
    console.log("     (using the page's own width estimator)");
  } else {
    textW = (...a) => fallbackW(...a);
    console.log('     ⚠ page defines no textW/tw — using this file\'s fallback estimator;\n       overlap findings are approximate');
  }
}
function fallbackW(s,size=11.5,bold=false){
  s=String(s); let u=0;
  for(const ch of s){
    if(/[ .,:;'’!|]/.test(ch)) u+=0.30;
    else if(/[ijltfr()\[\]-]/.test(ch)) u+=0.38;
    else if(/[A-Z★◇—…]/.test(ch)) u+=0.76;
    else if(/[mwMW]/.test(ch)) u+=0.92;
    else u+=0.56;
  }
  return u*size*(bold?1.06:1)+2;
}
const flat = el => el.children.flatMap(c => [c, ...(c.flat?[]:[])].concat(flat(c)));

// Collect drawn text as boxes and report any pair that overlaps.
function boxesOf(svg,rotated){
  const out=[];
  (function walk(n){
    n.children.forEach(c=>{
      if(c.tag==='text' && c.textContent && String(c.textContent).trim()){
        // font-size may be a style declaration OR a presentation attribute
        const st=c.attrs.style||'';
        const m=/font-size:\s*([\d.]+)px/.exec(st);
        const size = m ? parseFloat(m[1])
                   : (c.attrs['font-size'] ? parseFloat(c.attrs['font-size']) : 11.5);
        const bold=/font-weight:\s*(700|800|bold)/.test(st)
                   || /^(700|800|bold)$/.test(c.attrs['font-weight']||'');
        const w=textW(c.textContent,size,bold);
        const x=parseFloat(c.attrs.x||0), y=parseFloat(c.attrs.y||0);
        const a=c.attrs['text-anchor'];
        const x0 = a==='middle' ? x-w/2 : a==='end' ? x-w : x;
        // a rotated label cannot be measured as an axis-aligned box — report it
        // rather than certifying a layout that was never checked
        if(c.attrs.transform && /rotate/i.test(c.attrs.transform)) rotated.push(c.textContent);
        else out.push({t:c.textContent,x0,x1:x0+w,y0:y-size*0.78,y1:y+size*0.26,size});
      }
      walk(c);
    });
  })(svg);
  return out;
}

/* Opaque rects, so we catch text buried UNDER a box — which is what the
 * original map-4 bug was (row labels painted over by column 1). Text-vs-text
 * alone tests only half of "every label owns a box".
 *
 * Excluded, because none of them can hide a label:
 *   · fill:none / transparent, and declared hit-areas
 *   · anything translucent — background banding, decade stripes, lane tints
 *     are routinely drawn at opacity .05–.5 and sit BEHIND the text by design
 *   · full-bleed backdrops (a rect covering most of the canvas is a ground,
 *     not a box that could bury something) */
function rectsOf(svg,vb){
  const out=[];
  const [,,VW,VH]=(vb||'0 0 0 0').split(/\s+/).map(Number);
  const canvas=(VW||0)*(VH||0);
  (function walk(n){
    n.children.forEach(c=>{
      if(c.tag==='rect'){
        // class may arrive either way: setAttribute("class",…) or classList.add(…)
        const cls=[(c.attrs.class||''),
                   [...(c.classList&&c.classList._s||[])].join(' ')].join(' ');
        const fill=(c.attrs.fill||'').trim();
        const fo=parseFloat(c.attrs['fill-opacity'] ?? '1');
        const op=parseFloat(c.attrs.opacity ?? '1');
        const w=parseFloat(c.attrs.width||0), h=parseFloat(c.attrs.height||0);
        /* Translucency threshold: banding and tints sit around .05–.6 and are
         * drawn BEHIND text by design; a node plate at .8–1 is a real box that
         * can bury a label. Anything at .7 or above counts as opaque. */
        const translucent=(isFinite(fo)&&fo<0.7)||(isFinite(op)&&op<0.7);
        const backdrop = canvas>0 && (w*h)/canvas > 0.30;
        const skip = fill==='none' || fill==='transparent' || /\bhit\b/.test(cls)
                     || translucent || backdrop;
        if(!skip && w>0 && h>0){
          const x=parseFloat(c.attrs.x||0), y=parseFloat(c.attrs.y||0);
          out.push({x0:x,x1:x+w,y0:y,y1:y+h,fill});
        }
      }
      walk(c);
    });
  })(svg);
  return out;
}
let anyFail = failed;
for (const id of svgIds) {
  const s = byId[id];
  const t = s.tally(); delete t[id];
  const vb = s.getAttribute('viewBox');
  const parts = Object.entries(t).filter(([k])=>k!=='svg')
    .sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}:${v}`).join(' ');
  console.log(`\n${id}  viewBox="${vb}"  nodes=${s.count()}`);
  console.log(`     ${parts}`);
  const rotated=[];
  const B=boxesOf(s,rotated), R=rectsOf(s,vb);
  if(!vb) { console.log('     ⚠ NO viewBox — nothing could be measured against a canvas'); anyFail=true; }
  if(!B.length && !R.length) { console.log('     ⚠ NOTHING DRAWN — this SVG is empty'); anyFail=true; }
  const ov=(a,b)=>{
    const ox=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0);
    const oy=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0);
    return (ox>1.5&&oy>1.5) ? [ox,oy] : null;
  };
  const clashes=[];
  for(let i=0;i<B.length;i++) for(let j=i+1;j<B.length;j++){
    const o=ov(B[i],B[j]);
    if(o) clashes.push(`"${B[i].t}" ↔ "${B[j].t}"  (${o[0].toFixed(0)}×${o[1].toFixed(0)}px)`);
  }
  /* Text buried under a filled rect. A label centred on its own plate or band
   * is not buried — it belongs there. So: find the rect that best CONTAINS the
   * label (its home) and exempt it; only rects other than its home can bury it.
   * Without this, a label that slightly overspills the band it labels reads as
   * covered by the band next door. (Levin, 2026-08-27.) */
  const buried=[];
  for(const t of B){
    const area=(t.x1-t.x0)*(t.y1-t.y0);
    // its home: the overlapping rect that covers the most of it
    let home=null, best=0;
    for(const r of R){
      const o=ov(t,r); if(!o) continue;
      const cov=o[0]*o[1];
      const centred = t.x0+ (t.x1-t.x0)/2 >= r.x0 && t.x0+(t.x1-t.x0)/2 <= r.x1
                      && t.y1>=r.y0 && t.y0<=r.y1;
      if(centred && cov>best){ best=cov; home=r; }
    }
    for(const r of R){
      if(r===home) continue;
      const o=ov(t,r); if(!o) continue;
      const covered=o[0]*o[1];
      if(covered/area>0.35)
        buried.push(`"${t.t}" under rect [${r.x0.toFixed(0)},${r.y0.toFixed(0)}→${r.x1.toFixed(0)},${r.y1.toFixed(0)}] (${Math.round(covered/area*100)}% covered)`);
    }
  }
  if(clashes.length){
    console.log(`     ⚠ ${clashes.length} TEXT OVERLAP(S):`);
    clashes.slice(0,14).forEach(c=>console.log(`       ${c}`));
    if(clashes.length>14) console.log(`       …and ${clashes.length-14} more`);
  } else console.log(`     ✓ no text overlaps (${B.length} labels checked)`);
  if(buried.length){
    console.log(`     ⚠ ${buried.length} LABEL(S) PARTLY UNDER A FILLED RECT:`);
    buried.slice(0,10).forEach(c=>console.log(`       ${c}`));
    if(buried.length>10) console.log(`       …and ${buried.length-10} more`);
  } else console.log(`     ✓ no labels buried under boxes (${R.length} filled rects)`);
  if(rotated.length){
    console.log(`     ⚠ ${rotated.length} ROTATED LABEL(S) — NOT CHECKED: ${rotated.slice(0,5).map(t=>`"${t}"`).join(', ')}${rotated.length>5?' …':''}`);
    console.log(`       rotation cannot be measured as an axis-aligned box; prefer measured horizontal packing`);
    anyFail=true;
  }
  if(clashes.length||buried.length) anyFail=true;
}
console.log(anyFail ? '\n⚠ NOT CLEAN — see above.' : '\n✓ PASSES: every label measured, no overlaps, no burials, nothing unchecked.');
process.exitCode = anyFail ? 1 : 0;

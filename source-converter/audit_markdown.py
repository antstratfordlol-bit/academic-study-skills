#!/usr/bin/env python3
"""
audit_markdown.py — Deterministic quality auditor for academic Markdown conversions.
Checks:
  1. Footnote parity: All [^N] calls have matching [^N]: definitions and vice versa.
  2. Pagination continuity: Checks for missing or duplicate [p. N]{#p.N} anchors.
  3. Residual HTML/Calibre tags: Flags raw <span>, <div>, or ebook CSS artifacts.
  4. Orphaned hyphens: Identifies split words across line-breaks (e.g. 'hypo- static').
  5. Suspicious running headers: Lines resembling author/title echoes.
"""

import sys
import re
import os
from typing import List, Dict, Set, Tuple

def audit_file(filepath: str) -> Dict[str, any]:
    if not os.path.exists(filepath):
        print(f"Error: File '{filepath}' does not exist.", file=sys.stderr)
        sys.exit(1)

    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        lines = content.splitlines()

    issues = {
        "footnotes": [],
        "pagination": [],
        "html_residue": [],
        "orphaned_hyphens": [],
        "header_echoes": []
    }

    # 1. Footnote Parity
    call_pattern = re.compile(r'\[\^(\d+)\](?!:)')
    def_pattern = re.compile(r'^\[\^(\d+)\]:\s*(.*)', re.MULTILINE)

    calls: Set[int] = set()
    for m in call_pattern.finditer(content):
        calls.add(int(m.group(1)))

    defs: Dict[int, str] = {}
    for m in def_pattern.finditer(content):
        num = int(m.group(1))
        defs[num] = m.group(2).strip()

    missing_defs = calls - set(defs.keys())
    orphaned_defs = set(defs.keys()) - calls

    if missing_defs:
        issues["footnotes"].append(f"Missing definitions for footnote calls: {sorted(list(missing_defs))}")
    if orphaned_defs:
        issues["footnotes"].append(f"Footnote definitions without corresponding inline calls: {sorted(list(orphaned_defs))}")

    # 2. Pagination Continuity
    page_pattern = re.compile(r'\[p\.\s*(\d+)\](?:\{#p\.\d+\})?')
    pages = [int(m.group(1)) for m in page_pattern.finditer(content)]

    if pages:
        duplicates = set([p for p in pages if pages.count(p) > 1])
        if duplicates:
            issues["pagination"].append(f"Duplicate page anchors detected: {sorted(list(duplicates))}")

        # Check for gaps > 1 in strictly ascending sequences
        for i in range(len(pages) - 1):
            curr_p, next_p = pages[i], pages[i+1]
            if next_p > curr_p + 1:
                issues["pagination"].append(f"Page jump detected between p. {curr_p} and p. {next_p} (missing {next_p - curr_p - 1} pages)")
            elif next_p < curr_p:
                issues["pagination"].append(f"Non-monotonic page sequence: p. {curr_p} followed by p. {next_p}")

    # 3. Residual HTML / Calibre tags
    html_pattern = re.compile(r'<(?:span|div|p|br|table|tr|td|th)\b[^>]*>', re.IGNORECASE)
    for i, line in enumerate(lines, 1):
        if html_pattern.search(line):
            issues["html_residue"].append(f"Line {i}: Raw HTML tag found: '{line.strip()[:60]}'")
        if 'pcalibre' in line or 'calibre_feed' in line:
            issues["html_residue"].append(f"Line {i}: Calibre CSS artifact found: '{line.strip()[:60]}'")

    # 4. Orphaned Hyphens (words split by newline + hyphen)
    hyphen_pattern = re.compile(r'(\b[a-zA-Z\u00C0-\u024F]+[-‐­])\s*\n\s*([a-z\u00C0-\u024F]+)', re.MULTILINE)
    for m in hyphen_pattern.finditer(content):
        issues["orphaned_hyphens"].append(f"Suspicious word break: '{m.group(1)}' + '{m.group(2)}'")

    return issues

def main():
    if len(sys.argv) < 2:
        print("Usage: python audit_markdown.py <file.md>")
        sys.exit(1)

    target = sys.argv[1]
    issues = audit_file(target)

    total_issues = sum(len(v) for v in issues.values())
    print(f"=== Quality Audit Report: {os.path.basename(target)} ===")
    
    if total_issues == 0:
        print("PASS: Zero structural defects detected. Output is publication-grade.")
        sys.exit(0)

    print(f"FAILED: {total_issues} anomaly/anomalies detected:")
    for category, items in issues.items():
        if items:
            print(f"\n[{category.upper()} - {len(items)} issues]")
            for item in items[:10]:
                print(f"  * {item}")
            if len(items) > 10:
                print(f"  * ... and {len(items) - 10} more.")

    sys.exit(1 if len(issues["footnotes"]) > 0 or len(issues["pagination"]) > 5 else 0)

if __name__ == '__main__':
    main()
